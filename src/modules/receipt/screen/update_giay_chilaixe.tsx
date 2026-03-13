
import { UpdateForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Column, DataTable, Panel } from "components/uiCore";
import { showToast } from "redux/features/toast";
import { ChiPhiLaiXe, listToast, refreshObject } from "utils";
import { giayHoanUng, yeuCauChiLaiXe } from "../api";
import { useDispatch } from "react-redux";
import { Helper } from "utils/helper";
export default function UpdateGiayChiLaiXe({ detail, onClose}: { detail: any, onClose: () => void}) {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [debitRows, setDebitRows] = useState<any[]>([]);
  const [filters, setFilters] = useState({})
  const [infos, setInfos] = useState<any>({vat:0,type_doi_tuong:0,accountingDate:Helper.toDayString(),formOfPayment:1 });
  const dispatch = useDispatch();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const totalAmount = debitRows.reduce(
      (acc: number, item: any) => acc + (Number(item.amount) || 0),
      0
    );
    let info = {
      ...infos,
      data: JSON.stringify(debitRows),
      DebitId: detail.id,
      amount: detail.Con_lai,
      EmployeeId:detail.employee_driver_id,
      status: 1
    };
    console.log(detail);
    setLoading(true);
    fetchDataSubmit(info);
  };
  async function fetchDataSubmit(info: any) {
    const response = await yeuCauChiLaiXe(info);
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
  const getSumColumn = (field: string) => {
        const filtered = (debitRows??[]).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });
        const sum = filtered.reduce((acc: any, item: any) => {
            const val = parseInt(item[field]?.toString().replace(/\D/g, ""), 10) || 0;
            return acc + val;
        }, 0);
        return Helper.formatCurrency(sum.toString());
  };
  useEffect(() => {
    if (!detail) return;

    const mapped = ChiPhiLaiXe.map((row: any) => {
      return {
        ...row,
        amount: Number(detail[row.key]) || 0
      };
    });
    setDebitRows(mapped);
  }, [detail]);
  return (
    <>
      <UpdateForm       
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        loading={loading}
        onSubmit={handleSubmit}
        route={Number(id) ? "/receipt/update" : "/receipt/create"}
        AddName="Tạo yêu cầu chi lái xe"
      >
        <div className="field">
          <Panel header="Thông tin">
            <h3 style={{ textAlign: "center",textTransform: 'uppercase' }}>
                 Yêu cầu chi lái xe
            </h3>
            <div className="grid">
              <div className="col-12">
                <div className="formgrid grid">
                  {/* <div className="field col-12">
                    <div>Ngày tạo: {Helper.formatDMY(new Date(infos.accountingDate))}</div>
                    <div>Họ và tên: {nhanVienGiaoNhan}</div>
                  </div> */}
                   <div className="field col-12">
                     <div><b>Thông tin chi tiết</b></div>
                        <DataTable 
                          rowHover 
                          value={debitRows}
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                        >
                          <Column 
                            header="STT" 
                            body={(rowData:any, options:any) => options.rowIndex + 1}
                          />
                          <Column 
                            header="Diễn giải" 
                            body={(row: any) => row.label }
                          />
                          <Column body={(row: any) => Helper.formatCurrency(row.amount.toString())} header="Số tiền"
                            footer={getSumColumn("amount")}
                            footerStyle={{ fontWeight: "bold" }}
                          />
                          <Column
                            header="Thanh toán"
                            body={() => null}
                            footer={Helper.formatCurrency(detail.receipt_total?.toString() || "0")}
                            footerStyle={{ fontWeight: "bold"}}
                          />
                          <Column
                            header="Còn lại"
                            body={() => null}
                            footer={Helper.formatCurrency(detail.Con_lai?.toString() || "0")}
                            footerStyle={{ fontWeight: "bold" }}
                          />
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

