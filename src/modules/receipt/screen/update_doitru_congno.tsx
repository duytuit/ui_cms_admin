
import { AddFormCustom } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Checkbox, Column, DataTable} from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { AddDoiTruCongNo, addReceiptChiGiaoNhan, updateReceiptChiGiaoNhan } from "../api";
import { useDispatch } from "react-redux";
import { classNames } from "primereact/utils";
import { Helper } from "utils/helper";
import { Dropdown, GridForm, Input } from "components/common/ListForm";
import { useGetPartnerKHAndNCCDetail, useListCustomerDetailWithState, useListSupplierDetailWithState } from "modules/partner/service";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListDebitDoiTruKH, useListDebitDoiTruNCC } from "modules/Debit/service";
import { DataTableClient, DateBody } from "components/common/DataTable";
import { MyCalendar } from "components/common/MyCalendar";
import { FilterMatchMode } from "primereact/api";
const Header = ({ _setParamsPaginator, _paramsPaginator,_setSelectedRows,_setSelectedNCCRows }: any) => {
  const [filter, setFilter] = useState({
     supplierDetailId: 0,
     customerDetailId: 0,
     partnerId:0,
     accountingDate:_paramsPaginator.accountingDate,
     customerName:""
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
      _setSelectedRows([])
      _setSelectedNCCRows([])
     const supplier =  supplierDetails.find((x:any)=>x.partner_id == partnerId)
     const customer =  customerDetails.find((x:any)=>x.partner_id == partnerId)
     if(customer && supplier){
       setFilter({...filter,partnerId:partnerId,supplierDetailId:supplier.id,customerDetailId:customer.id,customerName:customer?.partners?.name})
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
      <div className="col-2">
          <MyCalendar
            dateFormat="dd/mm/yy"
            value={Helper.formatDMYLocal(
              filter.accountingDate ? filter.accountingDate : ""
            )} // truyền nguyên ISO string
            onChange={(e: any) =>
              setFilter({ ...filter, accountingDate: e })
            }
            className={classNames(
              "w-full",
              "p-inputtext",
              "input-form-sm",
              "calendar-sm"
            )}
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
  const [filterKH, setFilterKH] = useState({
     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
     name: { value: null, matchMode: FilterMatchMode.CONTAINS },
     fileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [filterNCC, setFilterNCC] = useState({
     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
     name: { value: null, matchMode: FilterMatchMode.CONTAINS },
     fileNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [activeSide, setActiveSide] = useState<'KH' | 'NCC' | null>(null);
  const [paramsPaginator, setParamsPaginator] = useState({supplierDetailId: 0,customerDetailId:0,customerName:"",accountingDate:Helper.toDayString()});
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,formOfPayment:1,incomeExpenseCategoryId:15 });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const sumKH = selectedRows.reduce((s, r) => s + (+r.conlai_tong || 0), 0);
    const sumNCC = selectedNCCRows.reduce((s, r) => s + (+r.conlai_tong || 0), 0);
    if(sumKH == 0 || sumNCC == 0 || sumKH !== sumNCC){
      dispatch(showToast({ ...listToast[2], detail: "Chưa được chọn hoặc bị lệch. Hãy kiểm tra lại"  }));
      return
    } 
    infos.accountingDate = paramsPaginator.accountingDate
    infos.customerDetailId = paramsPaginator.customerDetailId
    infos.customerName = paramsPaginator.customerName
    infos.debitThu = JSON.stringify(selectedRows)
    infos.debitChi = JSON.stringify(selectedNCCRows)
    infos.Price = sumNCC
    let info = {
      ...infos
    };
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
      const response = await AddDoiTruCongNo(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true });
          dispatch(
            showToast({ ...listToast[0], detail: response.data.message })
          );
          navigate("/receipt/ListDoiTruCongNo");
        } else {
          dispatch(
            showToast({ ...listToast[2], detail: response.data.message })
          );
        }
      } else
        dispatch(
          showToast({ ...listToast[1], detail: response.data.message })
        );
  };
  const { data:debitDoiTruNCC, loading: loadingNCC } = useListDebitDoiTruNCC({ params: {...paramsPaginator}});
  const { data:debitDoiTruKH, loading: loadingKH } = useListDebitDoiTruKH({ params: {...paramsPaginator}});
    const getSumColumnKH = (field: string) => {
        const selectedIds = new Set(selectedRows.map((r: any) => r.id));

        const filtered = (displayDataKH ?? [])
            // ✅ lọc theo checkbox
            .filter((item: any) => selectedIds.has(item.id))
            // ✅ lọc theo filterKH hiện có
            .filter((item: any) => {
                return Object.entries(filterKH).every(([key, f]: [string, any]) => {
                    const value = f?.value?.toString().toLowerCase() ?? "";
                    if (!value) return true;
                    const cell = item[key]?.toString().toLowerCase() ?? "";
                    return cell.includes(value);
                });
            });

        const sum = filtered.reduce((acc: number, item: any) => {
            const raw = item[field]?.toString() ?? "0";
            const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
    const getSumColumnNCC = (field: string) => {
         const selectedIds = new Set(selectedNCCRows.map((r: any) => r.id));

        const filtered = (displayDataNCC ?? [])
            // ✅ lọc theo checkbox
            .filter((item: any) => selectedIds.has(item.id))
            // ✅ lọc theo filterKH hiện có
            .filter((item: any) => {
                return Object.entries(filterNCC).every(([key, f]: [string, any]) => {
                    const value = f?.value?.toString().toLowerCase() ?? "";
                    if (!value) return true;
                    const cell = item[key]?.toString().toLowerCase() ?? "";
                    return cell.includes(value);
                });
            });

        const sum = filtered.reduce((acc: number, item: any) => {
            const raw = item[field]?.toString() ?? "0";
            const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
  useEffect(() => {
           const mapped = (debitDoiTruKH?.data || []).map((row: any) => {
                  let _fileNumber='';
                  if(row.data){
                      const data = JSON.parse(row.data)
                      _fileNumber = data?.fileNumber
                  }
                  const total_price = row.price + row.price_com;
                  const thanh_tien_dv = Math.round(total_price * (1 + row.vat / 100));
                  const thanh_tien_ch = Math.round(row.price * (1 + row.vat / 100));
                  const thanh_tien = thanh_tien_dv;
                return {
                    ...row,
                    fileNumber:_fileNumber,
                    thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 8) ? thanh_tien_dv : 0,
                    thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien_ch : 0,
                    dathu_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 8) ? row.receipt_total : 0,
                    dathu_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? row.receipt_total : 0,
                    conlai_dv_view: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 8) ? thanh_tien_dv - row.receipt_total : 0,
                    conlai_ch_view: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien_ch - row.receipt_total : 0,
                    conlai_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 8) ? thanh_tien_dv - row.receipt_total : 0,
                    conlai_ch: (row.type === 2 || row.type === 3 || row.type === 6) ? thanh_tien_ch - row.receipt_total : 0,
                    conlai_tong: thanh_tien - row.receipt_total,
                    conlai: thanh_tien - row.receipt_total
                };
            });
            setDisplayDataKH(mapped);
            const mappedNCC = (debitDoiTruNCC?.data || []).map((row: any) => {
                let _fileNumber='';
                if(row.data){
                    const data = JSON.parse(row.data)
                    _fileNumber = data?.fileNumber
                }
                const total_purchase = row.purchase_price + row.purchase_com;
                const thanh_tien_dv = Math.round(total_purchase * (1 + row.purchase_vat / 100));
                const thanh_tien_ch = Math.round(row.purchase_price * (1 + row.purchase_vat / 100));
                const thanh_tien = thanh_tien_dv;
                return {
                    ...row,
                    fileNumber:_fileNumber,
                    thanhtien_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 ||row.type === 7 ||row.type === 10) ? thanh_tien_dv : 0,
                    thanhtien_ch: (row.type === 2 || row.type === 3 || row.type === 6 ||row.type === 11) ? thanh_tien_ch : 0,
                    dathu_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 7 ||row.type === 10) ? row.receipt_total : 0,
                    dathu_ch: (row.type === 2 || row.type === 3 || row.type === 6 ||row.type === 11) ? row.receipt_total : 0,
                    conlai_dv_view: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 7 ||row.type === 10) ? thanh_tien_dv - row.receipt_total : 0,
                    conlai_ch_view: (row.type === 2 || row.type === 3 || row.type === 6 ||row.type === 11) ? thanh_tien_ch - row.receipt_total : 0,
                    conlai_dv: (row.type === 0 || row.type === 1 || row.type === 4 || row.type === 5 || row.type === 7 ||row.type === 10) ? thanh_tien_dv - row.receipt_total : 0,
                    conlai_ch: (row.type === 2 || row.type === 3 || row.type === 6 ||row.type === 11) ? thanh_tien_ch - row.receipt_total : 0,
                    conlai_tong: thanh_tien - row.receipt_total,
                    conlai: thanh_tien - row.receipt_total
                };
            });
            setDisplayDataNCC(mappedNCC);
            
    }, [debitDoiTruNCC,debitDoiTruKH,paramsPaginator])
    const isSameData = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  return a.every((x, i) =>
    x.id === b[i].id &&
    Number(x.conlai_tong) === Number(b[i].conlai_tong)
  );
};
useEffect(() => {
  if (!activeSide) return;
  if (selectedRows.length === 0 && selectedNCCRows.length === 0) return;

  const { newKH, newNCC } = canBangBuTru(
    selectedRows,
    selectedNCCRows,
    activeSide,
    displayDataKH,
    displayDataNCC
  );

  // 🔥 CHỈ UPDATE KHI THAY ĐỔI
  if (!isSameData(displayDataKH, newKH)) {
    setDisplayDataKH(newKH);
  }

  if (!isSameData(displayDataNCC, newNCC)) {
    setDisplayDataNCC(newNCC);
  }

  // sync selected KH
  const nextSelectedKH = selectedRows.map(r => {
    const found = newKH.find(x => x.id === r.id);
    return found ? { ...r, conlai_tong: found.conlai_tong } : r;
  });

  if (!isSameData(selectedRows, nextSelectedKH)) {
    setSelectedRows(nextSelectedKH);
  }

  // sync selected NCC
  const nextSelectedNCC = selectedNCCRows.map(r => {
    const found = newNCC.find(x => x.id === r.id);
    return found ? { ...r, conlai_tong: found.conlai_tong } : r;
  });

  if (!isSameData(selectedNCCRows, nextSelectedNCC)) {
    setSelectedNCCRows(nextSelectedNCC);
  }

}, [selectedRows, selectedNCCRows, activeSide]);
const canBangBuTru = (
  listKH: any[],
  listNCC: any[],
  activeSide: 'KH' | 'NCC' | null,
  displayKH: any[],
  displayNCC: any[]
) => {
  const sumKH = listKH.reduce((s, r) => s + (+r.conlai || 0), 0);
  const sumNCC = listNCC.reduce((s, r) => s + (+r.conlai || 0), 0);

  let newKH = displayKH.map(r => ({ ...r }));
  let newNCC = displayNCC.map(r => ({ ...r }));

  const selectedKHIds = new Set(listKH.map(x => x.id));
  const selectedNCCIds = new Set(listNCC.map(x => x.id));

  if (activeSide === 'KH') {
    let tienCon = sumNCC;

    newKH = newKH.map(kh => {
      if (!selectedKHIds.has(kh.id)) return kh;
      if (tienCon <= 0) return { ...kh, conlai_tong: kh.conlai };

      const bu = Math.min(tienCon, kh.conlai);
      tienCon -= bu;

      return { ...kh, conlai_tong: bu };
    });

    newNCC = newNCC.map(ncc => ({
      ...ncc,
      conlai_tong: ncc.conlai
    }));
  }

  if (activeSide === 'NCC') {
    let tienCon = sumKH;

    newNCC = newNCC.map(ncc => {
      if (!selectedNCCIds.has(ncc.id)) return ncc;
      if (tienCon <= 0) return { ...ncc, conlai_tong: ncc.conlai };

      const bu = Math.min(tienCon, ncc.conlai);
      tienCon -= bu;

      return { ...ncc, conlai_tong: bu };
    });

    newKH = newKH.map(kh => ({
      ...kh,
      conlai_tong: kh.conlai
    }));
  }

  return { newKH, newNCC };
};
  return (
    <>
      
      <AddFormCustom
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="Đối trừ công nợ"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/receipt/ListDoiTruCongNo"
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
        AddName="Bù trừ công nợ"
      >
        <div className="field">
           <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          _setSelectedRows={setSelectedRows}
          _setSelectedNCCRows={setSelectedNCCRows}
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
                             <DataTableClient 
                                rowHover
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                className={classNames("Custom-DataTableClient")}
                                value={displayDataKH}
                                filterDisplay="row"
                                filters={filterKH}
                                onFilter={(e:any) => setFilterKH(e.filters)}
                                >
                                <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} />
                                <Column field="fileNumber" header="Số file"  filter showFilterMenu={false} filterMatchMode="contains"/>
                                <Column field="bill_cus" header="Số hóa đơn" />
                                <Column field="name" header="Nội dung" filter showFilterMenu={false} filterMatchMode="contains"/>
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
                                body={(rowData: any) => {
                                  const total_price = rowData.price + rowData.price_com;
                                  const thanh_tien = Math.round(total_price * (1 + rowData.vat / 100));
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
                                            setActiveSide('KH');
                                            const rowFromDisplay = displayDataKH.find((d:any) => d.id === rowData.id);
                                            if (!prev.some(r => r.id === rowData.id) && rowFromDisplay) {
                                              return [...prev, rowFromDisplay];
                                            }
                                            return prev;
                                          } else {
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
                                    const isChecked = selectedRows.some(r => r.id === row.id); // check theo id
                                    if(isChecked){
                                        return Helper.formatCurrency(String(row.conlai_tong))
                                    }
                                  }}
                                  header="Số tiền bù trừ" style={{ textAlign: 'right' }} 
                                  footer={getSumColumnKH("conlai_tong")}
                                  footerStyle={{ fontWeight: "bold" }}
                                 />
                            </DataTableClient>
                      </div>
                    </SplitterPanel>
                    <SplitterPanel
                      size={50}
                      minSize={10}
                      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                          <b>Chứng từ phải trả</b>
                            <DataTableClient 
                                rowHover
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                value={displayDataNCC}
                                filters={filterNCC}
                                filterDisplay="row"
                                onFilter={(e:any) => setFilterNCC(e.filters)}
                                className={classNames("Custom-DataTableClient")}
                                >
                                <Column field="accounting_date" header="Ngày hạch toán" body={(e: any) => DateBody(e.accounting_date)} />
                                <Column field="fileNumber" header="Số file"  filter showFilterMenu={false} filterMatchMode="contains"/>
                                <Column field="bill_cus" header="Số hóa đơn" />
                                <Column field="name" header="Nội dung" filter showFilterMenu={false} filterMatchMode="contains"/>
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
                                body={(rowData: any) => {
                                  const total_purchase = rowData.purchase_price + rowData.purchase_com;
                                  const thanh_tien = Math.round(total_purchase * (1 + rowData.purchase_vat / 100));
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
                                                setActiveSide('NCC');
                                                const rowFromDisplayNCC = displayDataNCC.find((d:any) => d.id === rowData.id);
                                                if (!prev.some(r => r.id === rowData.id) && rowFromDisplayNCC) {
                                                  return [...prev, rowFromDisplayNCC];
                                                }
                                              
                                                return prev;
                                              } else {
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
                                    const isChecked = selectedNCCRows.some(r => r.id === row.id);
                                    if(isChecked){
                                      return Helper.formatCurrency(String(row.conlai_tong))
                                    }
                                  }}
                                  header="Số tiền bù trừ" style={{ textAlign: 'right' }} 
                                  footer={getSumColumnNCC("conlai_tong")}
                                  footerStyle={{ fontWeight: "bold" }}
                                />
                            </DataTableClient>
                        </div>
                    </SplitterPanel>
                 </Splitter>
            </div>
        </div>
      </AddFormCustom>
    </>
  );
}

