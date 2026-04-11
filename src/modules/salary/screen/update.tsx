
import { AddForm, InputForm } from "components/common/AddForm";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { addDepartment, showDepartment, updateDepartment } from "../api";
import { Dropdown, GridForm } from "components/common/ListForm";
import { Column, DataTable, Panel, ScrollPanel } from "components/uiCore";
import { MyCalendar } from "components/common/MyCalendar";
import { classNames } from "primereact/utils";
import { Helper } from "utils/helper";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListCongNoLaiXeWithDriverEmployee } from "modules/Debit/service";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { DataTableClient, DateBody } from "components/common/DataTable";
import { GetObjectDebitLaiXeTinhLuongAsync } from "modules/Debit/api";
import { FilterMatchMode } from "primereact/api";
import { Splitter, SplitterPanel } from "primereact/splitter";
const Header = ({ _setParamsPaginator, _paramsPaginator,_setSelectedRows,_setSelectedNCCRows }: any) => {
  const [filter, setFilter] = useState({
     employeeDriverId:0,
     fromDate: Helper.lastWeekString(),
     toDate: Helper.toDayString(),
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
            setFilter({ ...filter, employeeDriverId: e.value })
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
    const { handleParamUrl } = useHandleParamUrl();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      });
    const [infos, setInfos] = useState<any>({type:CategoryEnum.country,isExternalDriver:0});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [displayData, setDisplayData] = useState<any>();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [selectedNCCRows, setSelectedNCCRows] = useState<any[]>([]);
    const [paramsPaginator, setParamsPaginator] = useState({supplierDetailId: 0,customerDetailId:0,customerName:"",accountingDate:Helper.toDayString()});
    const { data:debitLaiXe, loading: loadingLaiXe } = useListCongNoLaiXeWithDriverEmployee({ params: {...paramsPaginator}});
    const handleSubmit = (e:any) => {
        e.preventDefault();
        let info = {
          ...infos, status: infos.status ? 0 : 1,
      };
      console.log('info',info);
      
      //setLoading(true);
     // fetchDataSubmit(info);
    };
     async function fetchDataSubmit(info:any) {
      if (info.id) {
          const response = await updateDepartment(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/department/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      } else {
          const response = await addDepartment(info);
          if (response) setLoading(false);
          if (response.status === 200) {
              if(response.data.status){
                setInfos({ ...refreshObject(infos), status: true })
                dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                navigate('/department/list');
              }else{
                dispatch(showToast({ ...listToast[2], detail: response.data.message }))
              }
          } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
  };
    useEffect(()=>{
      if (!debitLaiXe) return;
      handleParamUrl(paramsPaginator);
      const mapped = (debitLaiXe?.data || []).map((row: any) => {
                  return {    
                      ...row,
                  };
      });
      setDisplayData(mapped);
       if(id){
          showDepartment({id:id,type:CategoryEnum.country}).then(res=>{
              const detail = res.data.data
              if(detail){
                let info = {
                  ...detail, status: detail.status === 0 ? true : false,
                };
                setInfos(info)
              }
          }).catch(err => {
            //setHasError(true)
        });
       }
    },[debitLaiXe,paramsPaginator]);
      const getSumColumn = (field: string) => {
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
                  <Splitter style={{ height: '100%', width: '100%' }}>
                    {/* Panel 1 */}
                    <SplitterPanel
                      size={50}
                      minSize={10}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <b>Danh sách chuyến đi của lái xe</b>
                          <DataTableClient  
                            rowHover
                            scrollable
                            scrollHeight="flex"
                            style={{ flex: 1 }}
                            className={classNames("Custom-DataTableClient")}
                            value={displayData}
                          >
                            <Column field="service_date" header="Ngày điều xe" body={(e: any) => DateBody(e.service_date)} />
                            <Column field="name" header="Tuyến vận chuyển" filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Điểm trả hàng"
                              footer={getSumColumn("delivery_point")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency((row.delivery_point ?? 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Lái xe thu cước"
                              footer={getSumColumn("driver_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.driver_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Tiền ăn"
                              footer={getSumColumn("meal_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.meal_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Tiền vé"
                              footer={getSumColumn("ticket_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.ticket_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Tiền qua đêm"
                              footer={getSumColumn("overnight_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.overnight_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Tiền luật"
                              footer={getSumColumn("penalty_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.penalty_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                            <Column header="Lương hàng về"
                              footer={getSumColumn("goods_fee")}
                              footerStyle={{ fontWeight: "bold" }}
                              body={(row: any) => Helper.formatCurrency(row.goods_fee.toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                          </DataTableClient>
                      </div>
                    </SplitterPanel>
                    {/* Panel 2 */}
                    <SplitterPanel
                      size={30}
                      minSize={20}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <b>Danh sách lần ứng tiền của lái xe</b>
                    </div>
                    </SplitterPanel>
                    {/* Panel 3 */}
                    <SplitterPanel
                      size={20}
                      minSize={20}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                      }}
                    >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <b>Danh sách nghỉ phép nhân viên</b>
                    </div>
                    </SplitterPanel>
                  </Splitter>
                </SplitterPanel>
                <SplitterPanel
                  size={50}
                  minSize={10}
                  style={{ display: 'flex', flexDirection: 'column'}}
                >
                  {/* Header cố định */}
                  <div style={{ padding: '8px' }}>
                    <b>Thông tin khoản lương</b>
                  </div>
                  <div className="p-3">
                    <div className="formgrid grid">
                       <div className="field col-2">
                        <InputForm className="w-full"
                          id="route"
                          value={infos.route}
                          onChange={(e: any) =>
                            setInfos({ ...infos, route: e.target.value })
                          }
                          label="Phiếu lương"
                        />
                      </div>
                      <div className="field col-2">
                        <InputForm className="w-full"
                          id="route"
                          value={infos.route}
                          onChange={(e: any) =>
                            setInfos({ ...infos, route: e.target.value })
                          }
                          label="Lương cứng"
                        />
                      </div>
                      <div className="field col-2">
                        <InputForm className="w-full"
                          id="customerVehicleType"
                          value={infos.customerVehicleType}
                          onChange={(e: any) =>
                            setInfos({ ...infos, customerVehicleType: e.target.value })
                          }
                          label="Số ngày nghỉ có phép"
                        />
                      </div>

                      <div className="field col-2">
                        <InputForm className="w-full"
                          id="customerVehicleType"
                          value={infos.customerVehicleType}
                          onChange={(e: any) =>
                            setInfos({ ...infos, customerVehicleType: e.target.value })
                          }
                          label="Số ngày nghỉ không phép"
                        />
                      </div>
                      <div className="field col-4">
                        <InputForm className="w-full"
                          id="route"
                          value={infos.route}
                          onChange={(e: any) =>
                            setInfos({ ...infos, route: e.target.value })
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
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Điểm trả hàng"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Tiền ăn"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Tiền vé"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Điện thoại"
                              />
                            </div>
                             <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Qua đêm"
                              />
                            </div>
                             <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Luật"
                              />
                            </div>
                             <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Lương hàng về"
                              />
                            </div>
                             <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
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
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Tổng tạm ứng"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
                                }
                                label="Bảo hiểm xã hội"
                              />
                            </div>
                            <div className="field col-4">
                              <InputForm className="w-full"
                                id="route"
                                value={infos.route}
                                onChange={(e: any) =>
                                  setInfos({ ...infos, route: e.target.value })
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
                          <InputForm className="w-full"
                            id="route"
                            value={infos.route}
                            onChange={(e: any) =>
                              setInfos({ ...infos, route: e.target.value })
                            }
                            label="Lương cứng"
                          />
                        </div>
                        <div className="field col-8">
                          <InputForm className="w-full"
                            id="route"
                            value={infos.route}
                            onChange={(e: any) =>
                              setInfos({ ...infos, route: e.target.value })
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
