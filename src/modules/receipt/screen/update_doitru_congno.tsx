
import { AddForm, AddFormCustom } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, Column, DataTable} from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { addReceiptChiGiaoNhan, updateReceiptChiGiaoNhan } from "../api";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { Helper } from "utils/helper";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useGetPartnerKHAndNCCDetail, useListCustomerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListDebitDoiTruKH, useListDebitDoiTruNCC } from "modules/Debit/service";
import { DateBody } from "components/common/DataTable";
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
     supplierDetailId: 0,
     customerDetailId: 0,
     partnerId:0
  });
  const { data: parnertDetails } = useGetPartnerKHAndNCCDetail({params:{a:"abc"}});
  const { data: supplierDetails } = useListSupplierDetailWithState({ status: 2});
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
  // --- chuyển sang options bằng useMemo ---
  const parnertOptions = useMemo(() => {
    if (!Array.isArray(parnertDetails.data)) return [];
    return parnertDetails.data.map((x: any) => ({
      label: x?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [parnertDetails]);

  function getPartnerDetail(partnerId: number) {
     const supplier =  supplierDetails.find((x:any)=>x.partner_id == partnerId)
     const customer =  customerDetails.find((x:any)=>x.partner_id == partnerId)
     if(customer && supplier){
       setFilter({...filter,partnerId:partnerId,supplierDetailId:supplier.id,customerDetailId:customer.id})
     }
  }
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,...filter
    }));
  }, [filter]);

  return (
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
    >
     <div className="col-6">
        <Dropdown
          filter
          showClear
          value={filter.partnerId}
          options={parnertOptions}
          onChange={(e: any) =>
            getPartnerDetail(e.value)
          }
          label="Nhà cung cấp"
          className={classNames("w-full","dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
  );
};
export default function UpdateDoiTruCongNo() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedNCCRows, setSelectedNCCRows] = useState<any[]>([]);
  const [displayDataKH, setDisplayDataKH] = useState<any>([]);
  const [displayDataNCC, setDisplayDataNCC] = useState<any>([]);
  const [paramsPaginator, setParamsPaginator] = useState({supplierDetailId: 0,customerDetailId:0});
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1,incomeExpenseCategoryId:15 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let info = {
      ...infos
    };

  };
  async function fetchDataSubmit(info: any) {
   
     if (info.id) {
         const response = await updateReceiptChiGiaoNhan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListChuyenTienNoiBo");
         } else {
           dispatch(
             showToast({ ...listToast[2], detail: response.data.message })
           );
         }
       } else
         dispatch(
           showToast({ ...listToast[1], detail: response.data.message })
         );
     } else {
       const response = await addReceiptChiGiaoNhan(info);
       if (response) setLoading(false);
       if (response.status === 200) {
         if (response.data.status) {
           setInfos({ ...refreshObject(infos), status: true });
           dispatch(
             showToast({ ...listToast[0], detail: response.data.message })
           );
           navigate("/receipt/ListChuyenTienNoiBo");
         } else {
           dispatch(
             showToast({ ...listToast[2], detail: response.data.message })
           );
         }
       } else
         dispatch(
           showToast({ ...listToast[1], detail: response.data.message })
         );
     }
  };
  const { data:debitDoiTruNCC, loading: loadingNCC } = useListDebitDoiTruNCC({ params: {...paramsPaginator}});
  const { data:debitDoiTruKH, loading: loadingKH } = useListDebitDoiTruKH({ params: {...paramsPaginator}});
  useEffect(() => {
           const mapped = (debitDoiTruKH?.data || []).map((row: any) => {
                const thanh_tien = Math.round(row.price * (1 + row.vat / 100));
                return {
                    ...row,
                    thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien : 0,
                    thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien : 0,
                    dathu_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? row.receipt_total : 0,
                    dathu_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? row.receipt_total : 0,
                    conlai_dv_view: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
                    conlai_ch_view: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
                    conlai_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
                    conlai_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
                    conlai_tong: thanh_tien - row.receipt_total
                };
            });
            setDisplayDataKH(mapped);
            const mappedNCC = (debitDoiTruNCC?.data || []).map((row: any) => {
                const thanh_tien = Math.round(row.purchase_price * (1 + row.purchase_vat / 100));
                return {
                    ...row,
                    thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien : 0,
                    thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien : 0,
                    dathu_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? row.receipt_total : 0,
                    dathu_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? row.receipt_total : 0,
                    conlai_dv_view: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
                    conlai_ch_view: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
                    conlai_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5) ? thanh_tien - row.receipt_total : 0,
                    conlai_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien - row.receipt_total : 0,
                    conlai_tong: thanh_tien - row.receipt_total
                };
            });
            setDisplayDataNCC(mappedNCC);
    }, [debitDoiTruNCC,debitDoiTruKH,paramsPaginator])
  return (
    <>
      
      <AddFormCustom
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="Đối trừ công nợ"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/ListChuyenTienNoiBo"
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
        AddName="Bù trừ công nợ"
      >
        <div className="field">
           <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
        />
               <div style={{ height: 'calc(100vh - 8rem)' }}>
                 <Splitter layout="vertical" style={{ height: '100%', width: '100%' }}>
                    <SplitterPanel
                      size={50}
                      minSize={10}
                      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                         <b>Chứng từ phải thu</b>
                             <DataTable 
                                rowHover
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                value={displayDataKH}
                                >
                                 <Column 
                                  header="STT" 
                                  body={(rowData:any, options:any) => options.rowIndex + 1}
                                />
                                <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} />
                                <Column header="Số file" body={(row: any) => {
                                      if(row.data){
                                          const data = JSON.parse(row.data)
                                          return data?.fileNumber
                                      }
                                }} />
                                <Column field="bill_cus" header="Số hóa đơn" />
                                <Column field="name" header="Nội dung" />
                                <Column field="thanhtien_dv" body={(row: any) =>{
                                  return Helper.formatCurrency(row.thanhtien_dv.toString());
                                }}  header="Dịch vụ phát sinh" style={{ textAlign: 'right' }}/>
                                <Column field="thanhtien_ch" body={(row: any) =>{
                                  return Helper.formatCurrency(row.thanhtien_ch.toString());
                                }} header="Chi hộ phát sinh" style={{ textAlign: 'right' }}/>
                                <Column field="conlai_dv_view" body={(row: any) =>{
                                  return Helper.formatCurrency(row.conlai_dv_view.toString());
                                }} header="Dịch vụ chưa thu" style={{ textAlign: 'right' }}/>
                                <Column field="conlai_ch_view" body={(row: any) =>{
                                  return Helper.formatCurrency(row.conlai_ch_view.toString());
                                }} header="Chi hộ chưa thu" style={{ textAlign: 'right' }}/>
                                <Column
                                header={
                                  <Checkbox
                                    checked={
                                      selectedRows.length === displayDataKH.length &&
                                      displayDataKH.length > 0
                                    } 
                                    onChange={(e: any) => {
                                      if (e.checked) setSelectedRows([...displayDataKH]); // lưu nguyên object
                                      else setSelectedRows([]);
                                    }}
                                  />
                                }
                                body={(rowData: any) => {
                                  const thanh_tien = Math.round(rowData.price * (1 + rowData.vat / 100));
                                  let conlai = thanh_tien - rowData.receipt_total;
                                  conlai = Math.max(conlai, 0);
                                  if(conlai > 0){
                                    const isChecked = selectedRows.some(r => r.id === rowData.id); // check theo id
                                    return (
                                      <Checkbox
                                        className="p-checkbox-sm"
                                        checked={isChecked}
                                        onChange={(e: any) => {
                                          setSelectedRows(prev => {
                                            if (e.checked) {
                                              // add row: lấy object mới nhất từ displayData
                                              const rowFromDisplay = displayDataKH.find((d:any) => d.id === rowData.id);
                                              if (!prev.some(r => r.id === rowData.id) && rowFromDisplay) {
                                                return [...prev, rowFromDisplay];
                                              }
                                              return prev;
                                            } else {
                                              // remove row
                                              return prev.filter(r => r.id !== rowData.id);
                                            }
                                          });
                                        }}
                                        onClick={(e: any) => e.stopPropagation()}
                                      />
                                    );
                                  }
                                }}
                                style={{ width: "3em", textAlign: 'center'}}
                              />
                                <Column field="conlai_tong" 
                                body={(row:any, options:any) => {
                                  const price = typeof row.price === "string"
                                    ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.price) || 0;
                                  const vat = Number(row.vat) || 0;
                                  const thanh_tien = Math.round(price * (1 + vat / 100));
                                  const conlai = thanh_tien - (row.receipt_total || 0);
                                  return (
                                      <Input
                                        className="w-full input-sm"
                                        value={Helper.formatCurrency(String(conlai))}
                                        onChange={(e: any) => {
                                          const newValue = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    
                                          setDisplayDataKH((prev:any) => {
                                            // Tạo mảng displayData mới
                                            const updated = [...prev];
                                            updated[options.rowIndex] = {
                                              ...updated[options.rowIndex],
                                              conlai_ch: newValue
                                            };
                    
                                            // Đồng bộ selectedRows: nếu row đang chọn, cập nhật object mới
                                            // setSelectedRows(prevSelected =>
                                            //   prevSelected.map(sel =>
                                            //     sel.id === row.id ? { ...updated[options.rowIndex] } : sel
                                            //   )
                                            // );
                    
                                            return updated;
                                          });
                                        }}
                                      />
                                  );
                                }}
                                 header="Số tiền bù trừ" style={{ textAlign: 'right' }} />
                            </DataTable>
                      </div>
                    </SplitterPanel>
                    <SplitterPanel
                      size={50}
                      minSize={10}
                      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <b>Chứng từ phải trả</b>
                            <DataTable 
                                rowHover
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                value={displayDataNCC}
                                >
                                  <Column 
                                  header="STT" 
                                  body={(rowData:any, options:any) => options.rowIndex + 1}
                                />
                                <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} />
                                <Column header="Số file" body={(row: any) => {
                                      if(row.data){
                                          const data = JSON.parse(row.data)
                                          return data?.fileNumber
                                      }
                                }} />
                                <Column field="bill_cus" header="Số hóa đơn" />
                                <Column field="name" header="Nội dung" />
                                <Column field="thanhtien_dv" body={(row: any) =>{
                                  return Helper.formatCurrency(row.thanhtien_dv.toString());
                                }}  header="Dịch vụ phát sinh" style={{ textAlign: 'right' }}/>
                                <Column field="thanhtien_ch" body={(row: any) =>{
                                  return Helper.formatCurrency(row.thanhtien_ch.toString());
                                }} header="Chi hộ phát sinh" style={{ textAlign: 'right' }}/>
                                <Column field="conlai_dv_view" body={(row: any) =>{
                                  return Helper.formatCurrency(row.conlai_dv_view.toString());
                                }} header="Dịch vụ chưa thu" style={{ textAlign: 'right' }}/>
                                <Column field="conlai_ch_view" body={(row: any) =>{
                                  return Helper.formatCurrency(row.conlai_ch_view.toString());
                                }} header="Chi hộ chưa thu" style={{ textAlign: 'right' }}/>
                                <Column
                                header={
                                  <Checkbox
                                    checked={
                                      selectedNCCRows.length === displayDataNCC.length &&
                                      displayDataNCC.length > 0
                                    } 
                                    onChange={(e: any) => {
                                      if (e.checked) setSelectedNCCRows([...displayDataNCC]); // lưu nguyên object
                                      else setSelectedNCCRows([]);
                                    }}
                                  />
                                }
                                body={(rowData: any) => {
                                  const thanh_tien = Math.round(rowData.purchase_price * (1 + rowData.purchase_vat / 100));
                                  let conlai = thanh_tien - rowData.receipt_total;
                                  conlai = Math.max(conlai, 0);
                                  if(conlai > 0){
                                    const isChecked = selectedNCCRows.some(r => r.id === rowData.id); // check theo id
                                    return (
                                      <Checkbox
                                        className="p-checkbox-sm"
                                        checked={isChecked}
                                        onChange={(e: any) => {
                                          setSelectedNCCRows(prev => {
                                            if (e.checked) {
                                              // add row: lấy object mới nhất từ displayData
                                              const rowFromDisplayNCC = displayDataNCC.find((d:any) => d.id === rowData.id);
                                              if (!prev.some(r => r.id === rowData.id) && rowFromDisplayNCC) {
                                                return [...prev, rowFromDisplayNCC];
                                              }
                                              return prev;
                                            } else {
                                              // remove row
                                              return prev.filter(r => r.id !== rowData.id);
                                            }
                                          });
                                        }}
                                        onClick={(e: any) => e.stopPropagation()}
                                      />
                                    );
                                  }
                                }}
                                style={{ width: "3em", textAlign: 'center'}}
                              />
                                <Column field="conlai_tong" 
                                body={(row:any, options:any) => {
                                  const purchase_price = typeof row.purchase_price === "string"
                                    ? parseFloat(row.purchase_price.replace(/[^0-9.]/g, "")) || 0
                                    : Number(row.purchase_price) || 0;
                                  const vat = Number(row.purchase_vat) || 0;
                                  const thanh_tien = Math.round(purchase_price * (1 + vat / 100));
                                  const conlai = thanh_tien - (row.receipt_total || 0);
                                  return (
                                      <Input
                                        className="w-full input-sm"
                                        value={Helper.formatCurrency(String(conlai))}
                                        onChange={(e: any) => {
                                          const newValue = parseInt(e.target.value.replace(/\D/g, ""), 10);
                    
                                          setDisplayDataNCC((prev:any) => {
                                            // Tạo mảng displayData mới
                                            const updated = [...prev];
                                            updated[options.rowIndex] = {
                                              ...updated[options.rowIndex],
                                              conlai_ch: newValue
                                            };
                    
                                            // Đồng bộ selectedRows: nếu row đang chọn, cập nhật object mới
                                            // setSelectedRows(prevSelected =>
                                            //   prevSelected.map(sel =>
                                            //     sel.id === row.id ? { ...updated[options.rowIndex] } : sel
                                            //   )
                                            // );
                    
                                            return updated;
                                          });
                                        }}
                                      />
                                  );
                                }}
                                 header="Số tiền bù trừ" style={{ textAlign: 'right' }} />
                            </DataTable>
                        </div>
                    </SplitterPanel>
                 </Splitter>
            </div>
        </div>
      </AddFormCustom>
    </>
  );
}

