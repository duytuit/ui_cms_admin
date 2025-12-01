
import { AddForm, InputForm } from "components/common/AddForm";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, loaiToKhai, refreshObject, typeDebit, VatDebit } from "utils";
import { useDispatch } from "react-redux";
import { Dropdown, Input} from "components/common/ListForm";
import { Button, Column, DataTable, Dialog, Panel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { Helper } from "utils/helper";
import { classNames } from "primereact/utils";
import { showWithDebitContractFile } from "modules/ContractFile/api";
import { useListPartnerDetail, useListSupplierDetailWithState } from "modules/partner/service";
import { useListServiceCategoryWithState } from "modules/categories/service";
import { updateDebitFileGia, updateVATDebitFileGia } from "../api";
import UpdateConfirmService from "./update_confirm_service";
import ViewConfirmService from "./view_confirm_service";
export default function UpdateVATFileGia({ id, onClose }: { id: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [confirmDebitDetail, setConfirmDebitDetail] = useState<any>(null);
  const [debitDetail, setDebitDetail] = useState<any[]>([]);
  const [productDebit, setProductDebit] = useState<any[]>([]);
  const [newDebit, setNewDebit] = useState<any>({ name: "", purchasePrice: "", price: "",vat:0, note: "", bill: "" ,SupplierDetailId:"",SupplierName:""});
  const dispatch = useDispatch();
  const { data: partnerDetails } = useListPartnerDetail({ params: {f:"abc"}, debounce: 500 });
  const partnerOptions = useMemo(() => {
    if (!Array.isArray(partnerDetails?.data)) return [];
    return partnerDetails.data.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [partnerDetails]);
    const { data: supplierDetails } = useListSupplierDetailWithState({status: 2, debounce: 500 });
    const supplierOptions = useMemo(() => {
      if (!Array.isArray(supplierDetails)) return [];
      return supplierDetails.map((x: any) => ({
        label: x?.partners?.abbreviation ?? "(không tên)",
        value: x.id,
      }));
    }, [supplierDetails]);
  const openDialogAdd = (row:any) => {
        setConfirmDebitDetail(row);
        setVisible(true);
    };
  const handleModalClose = () => {
    fetchDebitDetail(id, partnerOptions, setInfos, setDebitDetail, setLoading);
    setVisible(false);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    let _file_info = {
      FileInfoId: infos.id,
      fileNumber: infos.fileNumber,
      PartnerDetailId: infos.customerDetailId,
      AccountingDate: infos.accountingDate,
      DebitDtos: debitDetail
    };
    fetchDataSubmit(_file_info);
  };
  async function fetchDataSubmit(debitDetail: any) {
    if (id) {
       const response = await updateVATDebitFileGia(debitDetail);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true })
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          onClose();
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }))
        }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    }
  };
  // Hàm riêng để gọi API và cập nhật state
  async function fetchDebitDetail(id: number, partnerOptions: any[], setInfos: any, setDebitDetail: any, setLoading: any) {
    if (!id || partnerOptions.length === 0) return;

    try {
      setLoading(true);

      const res = await showWithDebitContractFile({ id });
      const detail = res.data.data;
      if (!detail) return;

      // Xử lý partnerName
      const partner = partnerOptions.find((x: any) => x.value == detail.customerDetailId);
      detail.partnerName = partner?.label;

      // Xử lý debits
      const _debits = (detail.debits || []).map((row: any) => {
        const cus = partnerOptions.find((x: any) => x.value == row.supplierDetailId);
        return {
          ...row,
          customerAbb: cus?.label || "",
        };
      });

      // Xử lý loaiToKhai và status
      const _loaiToKhai = loaiToKhai.find((x: any) => x.DeclarationType === detail.declarationType);
      const info = {
        ...detail,
        status: detail.status === 0,
        loaiToKhai: _loaiToKhai?.name,
      };

      // ✅ Cập nhật state luôn trong function
      setInfos(info);
      setDebitDetail(_debits);
    } catch (err) {
      console.error("fetchDebitDetail error:", err);
    } finally {
      setLoading(false);
    }
  }
  // useEffect gọn hơn
  useEffect(() => {
    if (!id || partnerOptions.length === 0) return;
    fetchDebitDetail(id, partnerOptions, setInfos, setDebitDetail, setLoading);
  }, [id, partnerOptions.length]);
  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
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
                      <span>{infos.partnerName}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số tờ khai:</label>
                      <span>{infos.declaration}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số bill:</label>
                      <span>{infos.bill}</span>
                    </div>
                  </td>
                </tr>
                {/* --- HÀNG 2 --- */}
                <tr>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số file:</label>
                      <span>{infos.fileNumber}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                    <div className="mb-2">
                      <label className="font-medium mr-2">Số Cont:</label>
                      <span>{infos.containerCode}</span>
                    </div>
                  </td>
                  <td className="pr-4 align-top">
                  </td>
                </tr>
                {/* --- HÀNG 3 --- */}
                <tr>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Số Lượng:</label>
                    <span>{infos.quantity}</span>
                  </td>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Loại tờ khai:</label>
                    <span>{infos.loaiToKhai}</span>
                  </td>
                  <td className="pr-4">
                    <label className="font-medium mr-2">Ngày hạch toán:</label>
                     <span>{infos.accountingDate ? Helper.formatDMYLocal(infos.accountingDate) : ""}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </Panel>
          <Panel header="Chi tiết các chi phí">
            <div className="child-table">
             <DataTable rowHover value={debitDetail}>
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
                <Column field="customerAbb" header="Nhà cung cấp" />
                <Column
                  field="purchasePrice"
                  header="Giá mua"
                  body={(row: any) => Helper.formatCurrency(row.purchasePrice?.toString() || "0")}
                  footer={Helper.formatCurrency(
                    debitDetail
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
                    debitDetail
                      .reduce((sum, item) => sum + (item.price || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />

                <Column
                  header="VAT"
                  body={(_: any, opt: any) => (
                    <Dropdown
                      value={debitDetail[opt.rowIndex].vat || 0}
                      options={VatDebit}
                      optionValue="vat"
                      optionLabel="name"
                      className="p-inputtext-sm p-dropdown-sm"
                      onChange={(e: any) => {
                        const vatValue = Number(e.value) || 0;
                        const updated = [...debitDetail];
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

                        setDebitDetail(updated);
                      }}
                      required
                    />
                  )}
                />

               <Column
                  field="thanh_tien"
                  header="Thành tiền"
                  body={(_: any, opt: any) => {
                    const row = debitDetail[opt.rowIndex];
                    // Chuyển price về số thực, giữ decimal
                    const price = typeof row.price === "string"
                      ? parseFloat(row.price.replace(/[^0-9.]/g, "")) || 0
                      : Number(row.price) || 0;
                    const vat = Number(row.vat) || 0;
                    // Tính thành tiền
                    const thanh_tien = Math.round(price * (1 + vat / 100));
                    // ✅ Cập nhật luôn vào state
                    if (row.thanh_tien !== thanh_tien) {
                      const updated = [...debitDetail];
                      updated[opt.rowIndex] = { ...row, thanh_tien };
                      setDebitDetail(updated);
                    }
                    return Helper.formatCurrency(thanh_tien.toString());
                  }}
                  footer={Helper.formatCurrency(
                    debitDetail
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
              value={Helper.formatCurrency((debitDetail
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
       <Dialog
          position="top"
          dismissableMask
          header="Thông tin duyệt chi phí hải quan"
          visible={visible}
          onHide={() => setVisible(false)}
          style={{ width: "50vw",top:"200px" }}
        >
          <p className="m-0">
            {confirmDebitDetail && <ViewConfirmService debitDetail={confirmDebitDetail} onClose={handleModalClose} ></ViewConfirmService>}
          </p>
        </Dialog>
    </>
  );
}