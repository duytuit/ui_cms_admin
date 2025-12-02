
import { AddForm, InputForm } from "components/common/AddForm";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, typeDebit, VatDebit } from "utils";
import { useDispatch } from "react-redux";
import { Dropdown} from "components/common/ListForm";
import { Column, DataTable, Dialog, Panel } from "components/uiCore";
import { Helper } from "utils/helper";
import { useListPartnerDetailWithState} from "modules/partner/service";
import { showDebit, updateVATDebitFileGia, updateVATDebitNoFile } from "../api";
import { log } from "console";
export default function UpdateVATDebitNoFile({ id, onClose }: { id: any; onClose: () => void }) {
  const dispatch = useDispatch();
  const [infos, setInfos] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [debitDetail, setDebitDetail] = useState<any>({});
  const [details, setDetails] = useState<any[]>([]);
  const { data: listPartner } = useListPartnerDetailWithState({});
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    let info = {
        ...details[0]
    };
    console.log(info);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(debitDetail: any) {
    if (id) {
       const response = await updateVATDebitNoFile(debitDetail);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          onClose();
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  useEffect(() => {
      if(id){
          showDebit({id: id}).then(res=>{
              const detail = res.data.data;
              if(detail){
                  const _customer = listPartner?.find((x: any) => x.id === detail.customerDetailId);
                  const _supplier = listPartner?.find((x: any) => x.id === detail.supplierDetailId);
                  let info = {
                    ...detail,
                    customerName: _customer?.partners?.name || "",
                    customerAbb: _customer?.partners?.abbreviation || "",
                    supplierName: _supplier?.partners?.name || "",
                    supplierAbb: _supplier?.partners?.abbreviation || "",
                  };
                  setDebitDetail(info);
                  setDetails([info]);
              }
          }).catch(err => {
        });
      }
    }, [id])
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id||id}
        title="xe"
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/debit/update" : "/debit/create"}
      >
        <div className="field">
          <Panel header="Thông tin bảng kê">
            <table className="w-full">
              <tbody>
                {/* --- HÀNG 1 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Khách hàng:</label>
                      <span>{debitDetail?.customerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                   
                  </td>
                  <td className="pr-4 align-top">
                   
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                      <div className="mb-2">
                        <label className="font-medium mr-2">Ngày hạch toán:</label>
                        <span>{debitDetail.accountingDate ? Helper.formatDMYLocal(debitDetail.accountingDate || "") : ""}</span>
                      </div>
                  </td>
                  <td className="pr-4 align-top">
                     
                  </td>
                  <td className="pr-4 align-top">
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                  
                  </td>
                  <td className="pr-4">
                  
                  </td>
                  <td className="pr-4">
                   
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel header="Chi tiết các chi phí">
            <div className="child-table">
             <DataTable rowHover value={details}>
                <Column
                    field="name"
                    header="Chi phí"
                />
                <Column
                  field="type"
                  header="Loại chi phí"
                  body={(row: any) =>
                    typeDebit.find((x: any) => x.type === row.type)?.name || ""
                  }
                />
                <Column field="supplierAbb" header="Nhà cung cấp" />
                <Column
                  field="purchasePrice"
                  header="Giá mua"
                  body={(row: any) => Helper.formatCurrency(row.purchasePrice?.toString() || "0")}
                  footer={Helper.formatCurrency(
                    details
                      .reduce((sum, item) => sum + (item.purchasePrice || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
               <Column
                  field="price"
                  header="Giá bán"
                  body={(row: any, opt: any) => {
                    return Helper.formatCurrency(row.price?.toString() || "0");
                  }}
                  footer={Helper.formatCurrency(
                    details
                      .reduce((sum, item) => sum + (item.price || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />

                <Column
                  header="VAT"
                  body={(_: any, opt: any) => (
                    <Dropdown
                      value={details[opt.rowIndex].vat || 0}
                      options={VatDebit}
                      optionValue="vat"
                      optionLabel="name"
                      className="p-inputtext-sm p-dropdown-sm"
                      onChange={(e: any) => {
                        const vatValue = Number(e.value) || 0;
                        const updated = [...details];
                        const row = { ...updated[opt.rowIndex] };

                        // ✅ Chuyển price về số nguyên, loại bỏ ký tự không phải số
                        const rawPrice =
                          typeof row.price === "string"
                            ? parseInt(row.price.replace(/\D/g, ""), 10) || 0
                            : Number(row.price) || 0;

                        // ✅ Nếu có quantity thì nhân thêm, mặc định là 1
                        const qty = Number(row.quantity) || 1;
                        // ✅ Tính thành tiền (price * qty * (1 + vat/100))
                        const thanh_tien = Math.round(rawPrice * qty * (1 + vatValue / 100));
                        
                        updated[opt.rowIndex] = {
                          ...row,
                          vat: vatValue,
                          thanh_tien: thanh_tien
                        };

                        setDetails(updated);
                      }}
                      required
                    />
                  )}
                />

               <Column
                  field="thanh_tien"
                  header="Thành tiền"
                  body={(_: any, opt: any) => {
                    const row = details[opt.rowIndex];
                    // Chuyển price về số thực, giữ decimal
                    const price = typeof row.price === "string"
                      ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                      : Number(row.price) || 0;
                    const vat = Number(row.vat) || 0;
                    // Tính thành tiền
                    const thanh_tien = Math.round(price * (1 + vat / 100));
                    // ✅ Cập nhật luôn vào state
                    if (row.thanh_tien !== thanh_tien) {
                      const updated = [...details];
                      updated[opt.rowIndex] = { ...row, thanh_tien };
                      setDetails(updated);
                    }
                    return Helper.formatCurrency(thanh_tien.toString());
                  }}
                  footer={Helper.formatCurrency(
                    details
                      .reduce((sum, item) => {
                        const price = typeof item.price === "string"
                          ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
                          : Number(item.price) || 0;

                        const vat = Number(item.vat) || 0;
                        return Math.round(sum + price * (1 + vat / 100));
                      }, 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />

                <Column
                  field="bill"
                  header="Hóa đơn"
                />
              </DataTable>
            </div>
          </Panel>
          {/* thêm dòng tổng cộng nằm bên phải */}
          <div className="field mt-4">
            <InputForm
              className="w-64"
              id="total_thanhtien"
              value={Helper.formatCurrency((details
                .reduce((sum, item) => {
                  // Chuyển price về số thực, giữ decimal
                  const price = typeof item.price === "string"
                    ? parseFloat(item.price.replace(/[^0-9.]/g, "")) || 0
                    : Number(item.price) || 0;

                  const vat = Number(item.vat) || 0;

                  return Math.round(sum + price * (1 + vat / 100));
                }, 0).toString()))}
              label="Tổng cộng"
              readOnly // ✅ làm input chỉ đọc
            />
          </div>
        </div>
      </AddForm>
    </>
  );
}