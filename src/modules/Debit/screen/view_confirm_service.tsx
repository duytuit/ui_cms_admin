
import { UpdateForm } from "components/common/AddForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject} from "utils";
import { useDispatch } from "react-redux";
import { addDebitService, confirmChiPhiHaiQuan } from "../api";
import { Input } from "components/common/ListForm";
import { Column, DataTable } from "components/uiCore";
import { Helper } from "utils/helper";
export default function ViewConfirmService({ debitDetail, onClose }: { debitDetail: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const [productHaiquan, setProductHaiquan] = useState<any[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    infos.productHaiquan= productHaiquan;
    infos.status = infos.status ? 0 : 1;
    let info = {
      ...infos,
      data:JSON.stringify(infos)
    };
    console.log('info', info);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    if (info.id) {
       const response = await confirmChiPhiHaiQuan(info);
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

  useEffect(() => {
    if (debitDetail) {
      setInfos(debitDetail);
      let serviceDetail: any[] = [];
      const raw = debitDetail.serviceDetail || debitDetail.productHaiquan || "[]";
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) serviceDetail = parsed;
      } catch (err) {
        console.warn("Lỗi parse serviceDetail:", err);
      }
      setProductHaiquan(serviceDetail);
      console.log("serviceDetail UPDATED:", serviceDetail);
    }
  }, [debitDetail]);
  return (
    <>
       <UpdateForm
            className="w-full"
            style={{ margin: "0 auto" }}
            checkId={infos.id}
            title="xe"
            loading={loading}
            onSubmit={handleSubmit}
            route={Number(infos.id) ? "/debit/update" : "/debit/create"}
        >
        <div className="field">
           <div className="child-table">
              <DataTable rowHover value={productHaiquan}>
                <Column field="Name" header="Phí hải quan" />
                <Column
                  field="PurchasePrice"
                  header="Giá mua"
                  body={(_: any, opt: any) => {
                    const row = productHaiquan[opt.rowIndex];
                    return (
                      <Input
                        className="w-full input-sm"
                        id={`PurchasePrice-${opt.rowIndex}`}
                        value={Helper.formatCurrency(row.PurchasePrice?.toString()) || "0"} // dùng giá trị raw để dễ nhập
                        onChange={(e: any) => {
                          const rawValue = e.target.value.replace(/\D/g, "");
                          const numericValue = parseInt(rawValue, 10) || 0;
                          const updated = [...productHaiquan];
                          updated[opt.rowIndex] = {
                            ...row,
                            PurchasePrice: numericValue,
                          };
                          setProductHaiquan(updated);
                        }}
                        label=""
                      />
                    );
                  }}
                  footer={Helper.formatCurrency(
                    productHaiquan
                      .reduce((sum: number, item: any) => sum + (item.PurchasePrice || 0), 0)
                      .toString()
                  )}
                  footerStyle={{ fontWeight: "bold" }}
                />
                <Column field="Note" header="Ghi chú" />
              </DataTable>
            </div>
        </div>
        </UpdateForm>
    </>
  );
}