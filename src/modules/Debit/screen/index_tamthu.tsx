import { useEffect, useMemo, useState } from "react";
import { Column, TimeBody, DataTableClient, DateBody, } from "components/common/DataTable";
import { Dropdown, GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListCustomerDetailWithState } from "modules/partner/service";
import { useListUserWithState } from "modules/user/service";
import { Button, Checkbox } from "components/uiCore";
import { useListEmployeeWithState } from "modules/employee/service";
import { Helper } from "utils/helper";
import { useListContractFileWithState } from "modules/ContractFile/service";
import { useListDebitTamThu } from "../service";
import { Splitter } from "primereact/splitter";
import { FilterMatchMode } from "primereact/api";
import { listToast, statusServiceDebit } from "utils";
import { updateServiceStatus } from "../api";
import { showToast } from "redux/features/toast";
import { useDispatch } from "react-redux";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,_selectedRows,_setSelectedRows,refresh }: any) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    name: "",
    customerDetailId: "",
    fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString(),
  });
  const { data: customerDetails } = useListCustomerDetailWithState({ status: 1});
  // --- chuyển sang options bằng useMemo ---
  const customerOptions = useMemo(() => {
    if (!Array.isArray(customerDetails)) return [];
    return customerDetails.map((x: any) => ({
      label: x?.partners?.abbreviation ?? "(không tên)",
      value: x.id,
    }));
  }, [customerDetails]);
  useEffect(() => {
    // Mỗi khi filter thay đổi => cập nhật params
    _setParamsPaginator((prev: any) => ({
      ...prev,
      keyword: filter.name,
      customerDetailId: filter.customerDetailId,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
    }));
  }, [filter]);
  async function NhanPhieuCuoc(){
     console.log(_selectedRows);
      const res = await updateServiceStatus({ ids: _selectedRows, serviceStatus: 2 });
      if (res.status === 200) {
        if (res.data.status) {
          dispatch(
            showToast({ ...listToast[0], detail: res.data.message })
          );
          refresh?.();
          _setSelectedRows([]);
        } else {
          dispatch(
            showToast({ ...listToast[2], detail: res.data.message })
          );
        }
      } else
        dispatch(
          showToast({ ...listToast[1], detail: res.data.message })
        );
  }
  async function HuyNhanPhieuCuoc(){
     console.log(_selectedRows);
      const res = await updateServiceStatus({ ids: _selectedRows, serviceStatus: 1 });
      if (res.status === 200) {
        if (res.data.status) {  
          dispatch(
            showToast({ ...listToast[0], detail: res.data.message })
          );
          refresh?.();
          _setSelectedRows([]);
        } else {
          dispatch(
            showToast({ ...listToast[2], detail: res.data.message })
          );
        } 
      } else
        dispatch(
          showToast({ ...listToast[1], detail: res.data.message })
        );
  }
  const items = [
    {
        label: 'Nhận phiếu cược',
        icon: "pi pi-check-square",
        command: () => NhanPhieuCuoc()
    },
    {
        label: 'Hủy nhận phiếu cược',
        icon: "pi pi-times-circle",
        command: () => HuyNhanPhieuCuoc()
    }
  ];
  return (
    <GridForm
      paramsPaginator={_paramsPaginator}
      setParamsPaginator={_setParamsPaginator}
      filter={filter}
      setFilter={setFilter}
      className="lg:col-9"
      MenuItems={items}
      MenuName="Xác nhận"
      MenuIcon="pi pi-check-square"
    >
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.fromDate}
          onChange={(e: any) => setFilter({ ...filter, fromDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
      <div className="col-2">
        <MyCalendar
          dateFormat="dd/mm/yy"
          value={filter.toDate}
          onChange={(e: any) => setFilter({ ...filter, toDate: e })}
          className={classNames("w-full", "p-inputtext", "input-sm")}
        />
      </div>
      <div className="col-6">
        <Dropdown
          filter
          showClear
          value={filter.customerDetailId}
          options={customerOptions}
          onChange={(e: any) =>
            setFilter({ ...filter, customerDetailId: e.target.value })
          }
          label="Khách hàng"
          className={classNames("dropdown-input-sm", "p-dropdown-sm")}
        />
      </div>
    </GridForm>
  );
};

export default function ListTamThu() {
  const { handleParamUrl } = useHandleParamUrl();
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [filters, setFilters] = useState({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          service_status: { value: null, matchMode: FilterMatchMode.CONTAINS },
          customerAbb: { value: null, matchMode: FilterMatchMode.CONTAINS },
          customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
          employee: { value: null, matchMode: FilterMatchMode.CONTAINS },
          file_number: { value: null, matchMode: FilterMatchMode.CONTAINS },
          note: { value: null, matchMode: FilterMatchMode.CONTAINS },
          name: { value: null, matchMode: FilterMatchMode.CONTAINS },
          });
  const { data: customers } = useListCustomerDetailWithState({status: 1});
  const [paramsPaginator, setParamsPaginator] = useState({
    pageNum: 1,
    pageSize: 20,
    first: 0,
    render: false,
    keyword: "",
  });
  const { data, loading, error, refresh } = useListDebitTamThu({
    params: {...paramsPaginator},
    debounce: 500,
  });
  const { data: listContractFile } = useListContractFileWithState({});
  const { data: userInfos } = useListUserWithState({});
  const userInfosOptions = useMemo(() => {
    return userInfos;
  }, [userInfos]);
  const { data: employeeInfos } = useListEmployeeWithState({});
  const employeeOptions = useMemo(() => {
    return employeeInfos;
  }, [employeeInfos]);
  // ✅ Client-side pagination
  useEffect(() => {
    if (!data) return;
    handleParamUrl(paramsPaginator);
    const mapped = (data?.data || []).map((row: any) => {
      const cus = customers.find((x: any) => x.id === row.customer_detail_id);
      const _fileContract = listContractFile.find((x: any) => x.id === row.file_info_id);
      const _user = employeeOptions.find((x: any) => x.user_id === row.updated_by);
      const _employee = employeeInfos.find((x: any) => x.id === row.employee_staff_id);
      return {
        ...row,
        customerName: cus?.partners?.name || "",
        customerAbb: cus?.partners?.abbreviation || "",
        userName: `${_user?.last_name ?? ""} ${_user?.first_name ?? ""}`.trim(),
        file_number : _fileContract?.file_number,
        employee: `${_employee?.last_name ?? ""} ${_employee?.first_name ?? ""}`.trim(),
      };
    });
    setDisplayData(mapped);
  }, [listContractFile,employeeOptions, data, paramsPaginator, customers]);
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
      <div className="card">
        <Header
          _paramsPaginator={paramsPaginator}
          _setParamsPaginator={setParamsPaginator}
          _selectedRows={selectedRows}
          _setSelectedRows={setSelectedRows}
          refresh={refresh}
        />
        <div style={{ height: 'calc(100vh - 8rem)' }}>
          <Splitter style={{ height: '100%', width: '100%' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <DataTableClient
                    rowHover
                    value={displayData}
                    currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                    loading={loading}
                    dataKey="id"
                    title="Tài khoản"
                    filterDisplay="row"
                    filters={filters}
                    onFilter={(e:any) => setFilters(e.filters)}
                    className={classNames("Custom-DataTableClient")}
                    scrollable
                    scrollHeight="flex"
                    style={{ flex: 1 }}
                    tableStyle={{ minWidth: "2000px" }} // ép bảng rộng hơn để có scroll ngang
                  >
                    {/* Custom checkbox column */}
                    <Column
                     
                       header={(rowData: any) => {
                        const _selectableRows = displayData.filter(row =>  row.service_status >= 1 && row.service_status <= 2);
                        return (
                          <Checkbox
                            checked={
                                selectedRows.length > 0 && selectedRows.length === _selectableRows.length
                            }
                            onChange={(e: any) => {
                              const _selectableRows = displayData.filter(row =>  row.service_status >= 1 && row.service_status <= 2);
                              if (e.checked) setSelectedRows([..._selectableRows.map((d) => d.id)]);
                              else setSelectedRows([]);
                            }}
                          />
                        )
                      }}
                      body={(rowData: any) =>{
                        const isChecked = selectedRows.findIndex(id => id === rowData.id) !== -1;
                        if (rowData.service_status >= 1 && rowData.service_status <= 2) {
                            return (<Checkbox
                            className="p-checkbox-sm"
                            checked={isChecked}
                            onChange={(e: any) => {
                              if (e.checked)
                                setSelectedRows((prev) => [...prev, rowData.id]);
                              else
                                setSelectedRows((prev) =>
                                  prev.filter((id) => id !== rowData.id)
                                );
                            }}
                            onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
                          />)
                        }
                      }}
                      style={{ width: "3em" }}
                    />
                    <Column
                      field="service_status"
                      header="Trạng thái"
                        body={(row: any) => {
                        if(row.service_status === 2){
                          return <Button label="đã nhận phiếu" rounded severity="success" size="small" text  />
                        }else if(row.service_status === 1){
                          return <Button label="đã bàn giao phiếu" rounded severity="warning" size="small" text  />
                        }else if(row.service_status === 3){
                          return <Button label="đã hoàn trả" rounded severity="info" size="small" text  />
                        }else if(row.service_status === 4){
                          return <Button label="đã hoàn tiền" rounded severity="help" size="small" text  />
                        }else if(row.service_status === 5){
                          return <Button label="đã hoàn cược" rounded severity="info" size="small" text  />
                        }else{
                          return <Button label="chưa bàn giao" rounded severity="secondary" size="small" text  />
                        }
                      }}
                      filter
                      filterElement={(options:any) => (
                          <Dropdown
                              value={options.value}
                              options={statusServiceDebit}
                              onChange={(e:any) => {
                                options.filterApplyCallback(e.value)
                              }}
                              placeholder="Chọn trạng thái"
                              className="p-column-filter"
                              showClear
                          />
                      )}
                      showFilterMenu={false}  style={{ width:"180px" }}/>
                    <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="employee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="name" header="Tên phí" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="price" body={(row: any) => Helper.formatCurrency(row.price.toString())} header="Số tiền"
                      footer={getSumColumn("price")}
                      footerStyle={{ fontWeight: "bold" }}
                      filter showFilterMenu={false} filterMatchMode="contains" 
                    />
                    <Column field="note" header="Ghi chú" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column field="userName" header="Người thực hiện" filter showFilterMenu={false} filterMatchMode="contains" />
                    <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />

                  </DataTableClient>
            </div>
          </Splitter>
        </div>  
      </div>
    </>
  );
}
