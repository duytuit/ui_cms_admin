
import { UpdateForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Dropdown, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, VatDebit } from "utils";
import { useDispatch } from "react-redux";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { confirmDebitNoFileDispatchKH } from "../api";
import { Input } from "components/common/ListForm";
export default function UpdateDebitNoFileKH({ debits, onClose}: { debits: any, onClose: () => void }) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [debitRows, setDebitRows] = useState<any[]>([]);
  const [infos, setInfos] = useState<any>({vat_all:0,accountingDate:Helper.toDayString()});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.Data = JSON.stringify(debitRows);
    setLoading(true);
    fetchDataSubmit(infos);
  };
  async function fetchDataSubmit(info: any) {
    const response = await confirmDebitNoFileDispatchKH(info);
    if (response) setLoading(false);
    if (response.status === 200) {
      if (response.data.status) {
        setInfos({ ...refreshObject(infos), status: true });
        dispatch(
          showToast({ ...listToast[0], detail: response.data.message })
        );
        onClose();
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
 
  useEffect(() => {
      if(debits && debits.length > 0){
         setDebitRows(debits)
         console.log(debits);
         
      }
    }, [debits])
  return (
    <>
      <UpdateForm       
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
        AddName="Tạo công nợ"
      >
        <div className="field">
          <Panel header="Thông tin">
            <div className="grid">
              <div className="col-12">
                <div className="formgrid grid">
                  <div className="field col-3">
                      <div>Ngày hạch toán</div>
                      <MyCalendar dateFormat="dd/mm/yy"
                      value={Helper.formatDMYLocal(infos.accountingDate ? infos.accountingDate : '')} // truyền nguyên ISO string
                      onChange={(e: any) =>
                        setInfos({ ...infos, accountingDate: e })}
                      className={classNames("w-full", "p-inputtext", "input-form-sm")} />
                  </div>
                  <div className="field col-2">
                    <div>VAT</div>
                    <Dropdown
                      value={infos.vat_all}
                      options={VatDebit}
                      optionValue="vat"
                      optionLabel="name"
                      className="p-dropdown-sm"
                      onChange={(e: any) => {
                        setInfos({ ...infos, vat_all: e.value })
                        const vatValue = Number(e.value) || 0;

                          const updated = debitRows.map(row => {
                            const total = (row.price ?? 0) + (row.price_com ?? 0);
                            const totalWithVat = Math.round(total + total * vatValue / 100);

                            return {
                              ...row,
                              vat: vatValue,
                              thanh_tien: totalWithVat
                            };
                          });

                          setDebitRows(updated);
                      }}
                    />
                  </div>
                   <div className="field col-12">
                     <div><b>Thông tin chi tiết</b></div>
                        <DataTable 
                          rowHover 
                          value={debitRows}
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                        >
                        <Column header="STT" body={(rowData:any, options:any) => options.rowIndex + 1}/>
                        <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="dispatch_code" header="Mã điều xe" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="vehicle_number" header="Biển số" />
                        <Column header="Mua com"
                          body={(_: any, opt: any) => {
                            const row = debitRows[opt.rowIndex];
                            return (
                              <Input
                                className="w-full input-sm"
                                id={`purchase-com-${opt.rowIndex}`}
                                value={Helper.formatCurrency((row.purchase_com || 0).toString())}
                                onChange={(e: any) => {
                                  // Lấy giá trị mới từ Input
                                  const rawValue = e.target.value.replace(/\D/g, "");
                                  const numericValue = parseInt(rawValue, 10) || 0;
                                  const updated = [...debitRows];
                                  updated[opt.rowIndex] = { 
                                    ...row, 
                                    purchase_com: numericValue,
                                  };
                                  setDebitRows(updated);
                                }}
                                label=""
                              />
                            );
                          }}
                         filter showFilterMenu={false} filterMatchMode="contains" />
                         <Column header="Bán com"
                          body={(_: any, opt: any) => {
                            const row = debitRows[opt.rowIndex];
                            return (
                              <Input
                                className="w-full input-sm"
                                id={`price-com-${opt.rowIndex}`}
                                value={Helper.formatCurrency((row.price_com || 0).toString())}
                                onChange={(e: any) => {
                                  // Lấy giá trị mới từ Input
                                  const rawValue = e.target.value.replace(/\D/g, "");
                                  const numericValue = parseInt(rawValue, 10) || 0;
                                  const updated = [...debitRows];
                                  updated[opt.rowIndex] = { 
                                    ...row, 
                                    price_com: numericValue,
                                  };
                                  setDebitRows(updated);
                                }}
                                label=""
                              />
                            );
                          }}
                         filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="price" header="Số tiền"
                          body={(row: any) => Helper.formatCurrency(row.price?.toString() || "0")}
                          footer={Helper.formatCurrency(
                            debitRows
                              .reduce((sum, item) => sum + (item.price || 0), 0)
                              .toString()
                          )}
                          footerStyle={{ fontWeight: "bold" }}
                        />
                          <Column
                            header="VAT"
                            body={(_: any, opt: any) => (
                              <>
                                 <div className="py-1">
                                       <Dropdown
                                        value={debitRows[opt.rowIndex].vat || 0}
                                        options={VatDebit}
                                        optionValue="vat"
                                        optionLabel="name"
                                        className="p-inputtext-sm p-dropdown-sm"
                                        onChange={(e: any) => {
                                          const vatValue = Number(e.value) || 0;
                                          const updated = [...debitRows];
                                          const row = { ...updated[opt.rowIndex] };
                                          // ✅ Chuyển price về số nguyên, loại bỏ ký tự không phải số
                                          const rawPrice =
                                            typeof row.price === "string"
                                              ? parseInt(row.price.replace(/\D/g, ""), 10) || 0
                                              : Number(row.price) || 0;
                                          const priceCom =
                                            typeof row.price_com === "string"
                                              ? parseInt(row.price_com.replace(/\D/g, ""), 10) || 0
                                              : Number(row.price_com) || 0;
                                          // ✅ Tính thành tiền (price * qty * (1 + vat/100))
                                          const total_price = rawPrice + priceCom
                                          const thanh_tien = Math.round(total_price * (1 + vatValue / 100));
                                          updated[opt.rowIndex] = {
                                            ...row,
                                            vat: vatValue,
                                            thanh_tien: thanh_tien
                                          };
                                          setDebitRows(updated);
                                        }}
                                      />
                                 </div>
                              </>
                            )}
                          />
                        <Column
                          field="thanh_tien"
                          header="Thành tiền"
                          body={(_: any, opt: any) => {
                            const updated = [...debitRows];
                            const row = { ...updated[opt.rowIndex] };
                            const vatValue = Number(row.vat) || 0;
                            // ✅ Chuyển price về số nguyên, loại bỏ ký tự không phải số
                            const rawPrice =
                              typeof row.price === "string"
                                ? parseInt(row.price.replace(/\D/g, ""), 10) || 0
                                : Number(row.price) || 0;
                            const priceCom =
                              typeof row.price_com === "string"
                                ? parseInt(row.price_com.replace(/\D/g, ""), 10) || 0
                                : Number(row.price_com) || 0;
                            // ✅ Tính thành tiền (price * qty * (1 + vat/100))
                            const total_price = rawPrice + priceCom
                            const thanh_tien = Math.round(total_price * (1 + vatValue / 100));
                            // ✅ Cập nhật luôn vào state
                            if (row.thanh_tien !== thanh_tien) {
                              const updated = [...debitRows];
                              updated[opt.rowIndex] = { ...row, thanh_tien };
                              setDebitRows(updated);
                            }
                            return Helper.formatCurrency(thanh_tien.toString());
                          }}
                          footer={Helper.formatCurrency(
                            debitRows
                              .reduce((sum, item) => {
                                const price = typeof item.price === "string"
                                  ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
                                  : Number(item.price) || 0;
                                const price_com = typeof item.price_com === "string"
                                  ? parseFloat(item.price_com.replace(/[^0-9.]/g, "")) || 0
                                  : Number(item.price_com) || 0;

                                const vat = Number(item.vat) || 0;
                                const total_price = price + price_com
                                return Math.round(sum + total_price * (1 + vat / 100));
                              }, 0)
                              .toString()
                          )}
                          footerStyle={{ fontWeight: "bold" }}
                        />
                        
                        <Column field="supplierAbb" header="Nhà cung cấp" filter showFilterMenu={false} filterMatchMode="contains" />
                        </DataTable>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </UpdateForm>
    </>
  );
}

