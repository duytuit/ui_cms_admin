
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { addPayrollPeriod } from "../api";
import { Dropdown, GridForm } from "components/common/ListForm";
import { Column, DataTable } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { Helper } from "utils/helper";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListCongNoLaiXeWithDriverEmployee } from "modules/Debit/service";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { DataTableClient, DateBody } from "components/common/DataTable";
import { FilterMatchMode } from "primereact/api";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { useListReceiptUngTienLaiXe } from "modules/receipt/service";
import { useListFormRequest } from "../service";
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
  const [filter, setFilter] = useState({
     employeeDriverId:0,
     fromDate: Helper.lastWeekString(),
     toDate: Helper.toDayString(),
     fullName:""
  });
  const { data: employees } = useListEmployeeWithState({});
  const employeeOptions = useMemo(() => {
      if (!Array.isArray(employees)) return [];
      return employees.map((x: any,index:number) => ({
        label: `${index+1}.${x.last_name ?? ""} ${x.first_name ?? ""}`.trim(),
        value: x.id,
      }));
  }, [employees]);
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
          value={filter.employeeDriverId}
          options={employeeOptions}
          onChange={(e: any) =>
          {
            setFilter({ ...filter, employeeDriverId: e.value,fullName: e.originalEvent.target.innerText })
          }
          }
          label="Nhân viên"
          className={classNames("w-full","dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
      <div className="col-2 flex justify-content-end align-items-center">Tính lương từ</div>
      <div className="col-2">
          <MyCalendar
            dateFormat="dd/mm/yy"
            value={Helper.formatDMYLocal(
              filter.fromDate ? filter.fromDate : ""
            )} // truyền nguyên ISO string
            onChange={(e: any) =>
              setFilter({ ...filter, fromDate: e })
            }
            className={classNames(
              "w-full",
              "p-inputtext",
              "input-form-sm",
              "calendar-sm"
            )}
          />
      </div>
       <div className="col-2">
          <MyCalendar
            dateFormat="dd/mm/yy"
            value={Helper.formatDMYLocal(
              filter.toDate ? filter.toDate : ""
            )} // truyền nguyên ISO string
            onChange={(e: any) =>
              setFilter({ ...filter, toDate: e })
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
export default function UpdateSalary() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { handleParamUrl } = useHandleParamUrl();
    const [loading, setLoading] = useState(false);
       const [filters, setFilters] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
    const [dataCycleName, setDataCycleName] = useState<any[]>([]);
    const cycleOptions = useMemo(() => {
      return dataCycleName.map(cycle => ({
        label: `Tháng ${cycle.slice(0, 2)}/${cycle.slice(2)}`,
        value: cycle,
      }));
    }, [dataCycleName]);
    const [infos, setInfos] = useState<any>({
       cycleName:Helper.getCurrentMonthCycle(),
       fromDate: Helper.lastWeekString(),
       toDate: Helper.toDayString(),
    });
    const [displayData, setDisplayData] = useState<any>();
    const [displayUngTienLaiXe, setDisplayUngTienLaiXe] = useState<any>();
    const [displayNghiPhepNV, setDisplayNghiPhepNV] = useState<any>();
    const [paramsPaginator, setParamsPaginator] = useState({
      supplierDetailId: 0,
      customerDetailId:0,
      customerName:"",
      accountingDate:Helper.toDayString(),
      fromDate: Helper.lastWeekString(),
      toDate: Helper.toDayString(),
      fullName:"",
      employeeDriverId:0
    });
    const { data: employees } = useListEmployeeWithState({});
    const { data:debitLaiXe, loading: loadingLaiXe } = useListCongNoLaiXeWithDriverEmployee({ params: {...paramsPaginator}});
    const { data:ungTienLaiXe, loading: loadingUngTienLaiXe } = useListReceiptUngTienLaiXe({ params: {...paramsPaginator,employeeId: paramsPaginator.employeeDriverId}});
    const { data:nghiPhepNV, loading: loadingNghiPhepNV } = useListFormRequest({ params: {...paramsPaginator,employeeId: paramsPaginator.employeeDriverId}});
    const handleSubmit = (e:any) => {
        e.preventDefault();
        if (!infos.employeeId || infos.employeeId <= 0) {
          dispatch(showToast({ ...listToast[2], detail: "Vui lòng chọn nhân viên" }));
          return;
        }
        infos.DiemTraHang= Number((infos.DiemTraHang || 0).toString().replaceAll(".", "") || 0)
        infos.TienAn= Number((infos.TienAn || 0).toString().replaceAll(".", "") || 0)
        infos.TienVe= Number((infos.TienVe || 0).toString().replaceAll(".", "") || 0)
        infos.DienThoai= Number((infos.DienThoai || 0).toString().replaceAll(".", "") || 0)
        infos.Luat= Number((infos.Luat || 0).toString().replaceAll(".", "") || 0)
        infos.LuongHangVe= Number((infos.LuongHangVe || 0).toString().replaceAll(".", "") || 0)
        infos.QuaDem= Number((infos.QuaDem || 0).toString().replaceAll(".", "") || 0)
        infos.TongUng= Number((infos.TongUng || 0).toString().replaceAll(".", "") || 0)
        infos.TroCapKhac= Number((infos.TroCapKhac || 0).toString().replaceAll(".", "") || 0)
        infos.LuongThucNhan= Number((infos.LuongThucNhan || 0).toString().replaceAll(".", "") || 0)
        infos.ChiKhac = Number((infos.ChiKhac || 0).toString().replaceAll(".", "") || 0)
        infos.LuongCung = Number((infos.LuongCung || 0).toString().replaceAll(".", "") || 0)
        infos.BaoHiemXaHoi = Number((infos.BaoHiemXaHoi || 0).toString().replaceAll(".", "") || 0)
        infos.LuongThucTe = Number((infos.LuongThucTe || 0).toString().replaceAll(".", "") || 0)
        infos.LaiXeThuCuuoc = Number((infos.LaiXeThuCuuoc || 0).toString().replaceAll(".", "") || 0)
        infos.TruPhep = Number((infos.TruPhep || 0).toString().replaceAll(".", "") || 0)
        infos.EmployeeId = paramsPaginator.employeeDriverId;
        infos.ChiTietDebit = JSON.stringify(displayData);
        infos.ChiTietNghiPhep = JSON.stringify(displayNghiPhepNV);
        infos.ChiTietPhieuChi = JSON.stringify(displayUngTienLaiXe);

        let info = {
          ...infos
      };
      console.log('info',info);
      
      setLoading(true);
      fetchDataSubmit(info);
    };
    async function fetchDataSubmit(info:any) {
          const response = await addPayrollPeriod(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/salary/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
     };
useEffect(() => {
  if (!debitLaiXe) return;

  handleParamUrl(paramsPaginator);

  const mapped = debitLaiXe?.data || [];
  const mappedUngTien = ungTienLaiXe?.data || [];
  const mappedNghiPhep = nghiPhepNV?.data || [];

  setDisplayData(mapped);
  setDisplayUngTienLaiXe(mappedUngTien);
  setDisplayNghiPhepNV(mappedNghiPhep);

  setDataCycleName(Helper.getMonthlyCycles());

  const employee = employees?.find(
    (e: any) => e.id === paramsPaginator.employeeDriverId
  );

  setInfos((prev: any) => ({
    ...prev,

    // ✅ API
    LuongCung: employee?.base_salary || 0,

    // ✅ tính từ API (KHÔNG dùng state)
    DiemTraHang: getSumColumn(mapped, "delivery_point"),
    TienAn: getSumColumn(mapped, "meal_fee"),
    TienVe: getSumColumn(mapped, "ticket_fee"),
    DienThoai: getSumColumn(mapped, "phone_fee"),
    Luat: getSumColumn(mapped, "penalty_fee"),
    LuongHangVe: getSumColumn(mapped, "goods_fee"),
    QuaDem: getSumColumn(mapped, "overnight_fee"),
    TongUng: getSumColumnUngTienLaiXe(mappedUngTien, "total"),

    TroCapKhac: prev.TroCapKhac ?? 0, // 👈 giữ input user
  }));

}, [debitLaiXe, ungTienLaiXe, nghiPhepNV, employees, paramsPaginator]);
 const getSumColumn = (data: any[], field: string) => {
  const sum = (data ?? []).reduce((acc: number, item: any) => {
    const raw = item[field]?.toString() ?? "0";
    const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
    return acc + val;
  }, 0);

  return Helper.formatCurrency(sum.toString());
};

const getSumColumnUngTienLaiXe = (data: any[], field: string) => {
  const sum = (data ?? []).reduce((acc: number, item: any) => {
    const raw = item[field]?.toString() ?? "0";
    const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
    return acc + val;
  }, 0);

  return Helper.formatCurrency(sum.toString());
};
    const getSumColumnV2 = (field: string) => {
        const filtered = (displayData ?? []).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: number, item: any) => {
            const raw = item[field]?.toString() ?? "0";
            const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0; // giữ lại dấu âm
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
    const getSumColumnUngTienLaiXeV2 = (field: string) => {
        const filtered = (displayUngTienLaiXe ?? []).filter((item: any) => {
            return Object.entries(filters).every(([key, f]: [string, any]) => {
                const value = f?.value?.toString().toLowerCase() ?? "";
                if (!value) return true;
                const cell = item[key]?.toString().toLowerCase() ?? "";
                return cell.includes(value);
            });
        });

        const sum = filtered.reduce((acc: number, item: any) => {
            const raw = item[field]?.toString() ?? "0";
            const val = parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0; // giữ lại dấu âm
            return acc + val;
        }, 0);

        return Helper.formatCurrency(sum.toString());
    };
    return (
      <>
        <AddForm
          className="w-full"
          style={{ margin: "0 auto" }}
          checkId={infos.id}
          title="phiếu lương"
          loading={loading}
          onSubmit={handleSubmit}
          routeList="/salary/list"
          route={Number(id) ? "/salary/update" : "/salary/create"}
        >
          <div className="field">
            <Header
              _paramsPaginator={paramsPaginator}
              _setParamsPaginator={setParamsPaginator}
            />
            <div style={{ height: "calc(100vh - 8rem)" }}>
              <Splitter
                layout="vertical"
                style={{ height: "100%", width: "100%" }}
              >
                <SplitterPanel
                  size={50}
                  minSize={10}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Splitter style={{ height: "100%", width: "100%" }}>
                    {/* Panel 1 */}
                    <SplitterPanel
                      size={40}
                      minSize={10}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <b>Danh sách chuyến đi của lái xe</b>
                        <DataTableClient
                          rowHover
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                          className={classNames("Custom-DataTableClient")}
                          value={displayData}
                        >
                          <Column
                            field="service_date"
                            header="Ngày điều xe"
                            body={(e: any) => DateBody(e.service_date)}
                          />
                          <Column
                            field="name"
                            header="Tuyến vận chuyển"
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Điểm trả hàng"
                            footer={getSumColumnV2("delivery_point")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency(
                                (row.delivery_point ?? 0).toString(),
                              )
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Lái xe thu cước"
                            footer={getSumColumnV2("driver_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency((row.driver_fee ?? 0).toString())
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Tiền ăn"
                            footer={getSumColumnV2("meal_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency((row.meal_fee ?? 0).toString())
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Tiền vé"
                            footer={getSumColumnV2("ticket_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency((row.ticket_fee ?? 0).toString())
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Tiền qua đêm"
                            footer={getSumColumnV2("overnight_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency(
                                (row.overnight_fee ?? 0).toString(),
                              )
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Tiền luật"
                            footer={getSumColumnV2("penalty_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency((row.penalty_fee ?? 0).toString())
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                          <Column
                            header="Lương hàng về"
                            footer={getSumColumnV2("goods_fee")}
                            footerStyle={{ fontWeight: "bold" }}
                            body={(row: any) =>
                              Helper.formatCurrency((row.goods_fee ?? 0).toString())
                            }
                            filter
                            showFilterMenu={false}
                            filterMatchMode="contains"
                          />
                        </DataTableClient>
                      </div>
                    </SplitterPanel>
                    {/* Panel 2 */}
                    <SplitterPanel
                      size={20}
                      minSize={20}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                       style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <b>Danh sách lần chi ứng tiền của lái xe </b>
                        {/* income_expense_category_id:10 trong bảng receipts */}
                         <DataTableClient
                          value={displayUngTienLaiXe}
                          scrollable
                          scrollHeight="flex"
                          style={{ flex: 1 }}
                          className={classNames("Custom-DataTableClient")}
                          >
                              <Column field="note" header="Diễn giải" />
                              <Column field="total" body={(row: any) => Helper.formatCurrency((row.total || 0).toString())} header="Số tiền" 
                               footer={getSumColumnUngTienLaiXeV2("total")}
                               footerStyle={{ fontWeight: "bold" }}
                              />
                          </DataTableClient>
                      </div>
                    </SplitterPanel>
                    {/* Panel 3 */}
                    <SplitterPanel
                      size={40}
                      minSize={20}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          overflow: "hidden",
                        }}
                      >
                        <b>Danh sách nghỉ phép nhân viên</b>
                        {/* lấy dữ liệu từ bảng form_requests */}
                         <DataTable rowHover value={displayNghiPhepNV}>
                              <Column field="note" header="Diễn giải" />
                              <Column field="total_day_no_paid_leave" header="Nghỉ không lương" />
                              <Column field="total_day_has_paid_leave" header="Nghỉ có lương" />
                              <Column field="status" header="Trạng thái" 
                                body={(row:any) => {
                                  if(row.status === 0) return "Chờ duyệt";
                                  if(row.status === 1) return "Đã duyệt";
                                  if(row.status === 2) return "Từ chối";
                                  return "";
                                }}
                               />
                          </DataTable>
                      </div>
                    </SplitterPanel>
                  </Splitter>
                </SplitterPanel>
                <SplitterPanel
                  size={50}
                  minSize={10}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  {/* Header cố định */}
                  <div style={{ padding: "8px" }}>
                    <b>Thông tin khoản lương {paramsPaginator.fullName} tính từ ngày {paramsPaginator.fromDate} đến {paramsPaginator.toDate}</b>
                  </div>
                  <div className="p-3">
                    <div className="formgrid grid">
                      <div className="field col-2">
                          <Dropdown
                            value={infos.cycleName}
                            options={cycleOptions}
                            label="Kỳ lương"
                            className="p-inputtext-sm"
                            onChange={(e: any) => {
                              console.log(e.target.value);
                              setInfos({
                                ...infos,
                                cycleName: e.target.value,
                              });
                            }}
                          />
                      </div>
                      <div className="field col-2">
                        <InputForm
                          className="w-full"
                          id="LuongCung"
                          value={Helper.formatCurrency((infos.LuongCung || "").toString())}
                          onChange={(e: any) =>
                            setInfos({ ...infos, LuongCung: e.target.value })
                          }
                          label="Lương cứng"
                        />
                      </div>
                      <div className="field col-2">
                        <InputForm
                          className="w-full"
                          type="number"
                          id="NghiPhep"
                          value={infos.NghiPhep}
                          onChange={(e: any) =>
                            setInfos({
                              ...infos,
                              NghiPhep: e.target.value,
                            })
                          }
                          label="Số ngày nghỉ có phép"
                        />
                      </div>

                      <div className="field col-2">
                        <InputForm
                          className="w-full"
                          type="number"
                          id="NghiKhongLuong"
                          value={infos.NghiKhongLuong}
                          onChange={(e: any) =>
                            setInfos({
                              ...infos,
                              NghiKhongLuong: e.target.value,
                            })
                          }
                          label="Số ngày nghỉ không phép"
                        />
                      </div>
                      <div className="field col-2">
                        <InputForm
                          className="w-full"
                          id="SoNgayLam"
                          value={infos.SoNgayLam}
                          onChange={(e: any) =>
                            setInfos({ ...infos, SoNgayLam: e.target.value })
                          }
                          label="Ngày đi làm thực tế"
                        />
                      </div>
                       <div className="field col-2">
                        <InputForm
                          className="w-full"
                          id="LuongThucTe"
                          value={infos.LuongThucTe}
                          onChange={(e: any) =>
                            setInfos({ ...infos, LuongThucTe: e.target.value })
                          }
                          label="Lương thực tế"
                        />
                      </div>
                      <div className="field col-6">
                        <div className="card col-12">
                          <div className="mb-2">
                            <b>Các khoản trợ cấp</b>
                          </div>
                          <div className="field grid">
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="DiemTraHang"
                                value={ Helper.formatCurrency((infos.DiemTraHang || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, DiemTraHang: e.target.value })
                                }
                                label="Điểm trả hàng"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="TienAn"
                                value={Helper.formatCurrency((infos.TienAn || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, TienAn: e.target.value })
                                }
                                label="Tiền ăn"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="TienVe"
                                value={Helper.formatCurrency((infos.TienVe || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, TienVe: e.target.value })
                                }
                                label="Tiền vé"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="DienThoai"
                                value={Helper.formatCurrency((infos.DienThoai || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, DienThoai: e.target.value })
                                }
                                label="Điện thoại"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="QuaDem"
                                value={Helper.formatCurrency((infos.QuaDem || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, QuaDem: e.target.value })
                                }
                                label="Qua đêm"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="Luat"
                                value={Helper.formatCurrency((infos.Luat || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, Luat: e.target.value })
                                }
                                label="Luật"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="LuongHangVe"
                                value={Helper.formatCurrency((infos.LuongHangVe || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, LuongHangVe: e.target.value })
                                }
                                label="Lương hàng về"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="TroCapKhac"
                                value={Helper.formatCurrency((infos.TroCapKhac || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, TroCapKhac: e.target.value })
                                }
                                label="Trợ cấp khác"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="field col-6">
                        <div className="card col-12">
                          <div className="mb-2">
                            <b>Các khoản chi</b>
                          </div>
                          <div className="field grid">
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="TongUng"
                                value={Helper.formatCurrency((infos.TongUng || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, TongUng: e.target.value })
                                }
                                label="Tổng tạm ứng"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="BaoHiemXaHoi"
                                value={Helper.formatCurrency((infos.BaoHiemXaHoi || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, BaoHiemXaHoi: e.target.value })
                                }
                                label="Bảo hiểm xã hội"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="LaiXeThuCuuoc"
                                value={Helper.formatCurrency((infos.LaiXeThuCuuoc || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, LaiXeThuCuuoc: e.target.value })
                                }
                                label="Lái xe thu cước"
                              />
                            </div>
                             <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="TruPhep"
                                value={Helper.formatCurrency((infos.TruPhep || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, TruPhep: e.target.value })
                                }
                                label="Trừ phép"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm
                                className="w-full"
                                id="ChiKhac"
                                value={Helper.formatCurrency((infos.ChiKhac || "").toString())}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, ChiKhac: e.target.value })
                                }
                                label="Chi khác"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card col-12">
                      <div className="mb-2">
                        <b>Lương thực nhận</b>
                      </div>
                      <div className="formgrid grid">
                        <div className="field col-4">
                          <InputForm
                            className="w-full"
                            id="LuongThucNhan"
                            value={Helper.formatCurrency((infos.LuongThucNhan || "").toString())}
                            onChange={(e: any) =>
                              setInfos({ ...infos, LuongThucNhan: e.target.value })
                            }
                            label="Lương thực nhận"
                          />
                        </div>
                        <div className="field col-8">
                          <InputForm
                            className="w-full"
                            id="GhiChu"
                            value={infos.GhiChu}
                            onChange={(e: any) =>
                              setInfos({ ...infos, GhiChu: e.target.value })
                            }
                            label="Ghi chú thông tin lương"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </SplitterPanel>
              </Splitter>
            </div>
          </div>
        </AddForm>
      </>
    );
}
