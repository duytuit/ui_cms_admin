import { useEffect, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient, DateBody} from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useListDepreciation, useListDepreciationAllocation } from "../service";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { DataTable, Dialog, InputSwitch } from "components/uiCore";
import { Helper } from "utils/helper";
import UpdatePhanBoKhauHao from "modules/Debit/screen/update_phanbo_khauhao";
import { useListEmployeeWithState } from "modules/employee/service";
import { deleteDepreciation, deleteDepreciationAllocation, getDepreciationAllocationDetailByDepreciationAllocationId } from "../api";
import { MyCalendar } from "components/common/MyCalendar";
import { useListVehicleWithState } from "modules/VehicleDispatch/service";
import { type } from "os";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator,_refresh,_refreshAllocation}: any) => {
    const [filter, setFilter] = useState({
         fromDate: Helper.getFirstDayOfCurrentMonthYMD(),
         toDate: Helper.getLastDayOfCurrentMonthYMD(),
    });
    const [visible, setVisible] = useState(false);
    const [dataCycleName, setDataCycleName] = useState<any[]>([]);
    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        const monthlyCycles = Helper.getMonthlyCycles();
        setDataCycleName(monthlyCycles);
        _setParamsPaginator((prev: any) => ({
            ...prev,
            fromDate: filter.fromDate,
            toDate: filter.toDate,
        }));
    }, [filter]);
    const openDialogAdd = (e:any) => {
       setVisible(true)
    };
    const handleModalClose = () => {
       setVisible(false);
       _refresh();
       _refreshAllocation();
    };
    return (
        <>
            <GridForm
                paramsPaginator={_paramsPaginator}
                setParamsPaginator={_setParamsPaginator}
                filter={filter}
                setFilter={setFilter}
                className="lg:col-9"
                add="/depreciation/add?type=1"
                addName="Thêm tài sản"
                openDialogAdd={openDialogAdd}
                openDialogAddName="Phân bổ khấu hao tài sản"
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
            </GridForm>
            <Dialog
                position="top"
                dismissableMask
                visible={visible}
                onHide={handleModalClose}
                style={{ width: "30vw", top: "30px" }}
            >
                <p className="m-0">
                    {visible && <UpdatePhanBoKhauHao type={1} onClose={handleModalClose} ></UpdatePhanBoKhauHao>}
                </p>
            </Dialog>
        </>
    
    );
};

export default function ListDepreciation() {
    const { handleParamUrl } = useHandleParamUrl();
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [displayDataAllocation, setDisplayDataAllocation] = useState<any[]>([]);
    const [detailAllocation, setDetailAllocation] = useState<any[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const { data: employees } = useListEmployeeWithState({});
    const { data: vehicles } = useListVehicleWithState({});
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: 1,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListDepreciation({
        params: paramsPaginator,
        debounce: 500,
    });
     const { data: dataAllocation, loading: loadingAllocation, error: errorAllocation, refresh: refreshAllocation } = useListDepreciationAllocation({
        params: paramsPaginator,
        debounce: 500,
    });
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
         const mapped = (data?.data || []).map((row: any) => {
                    const _employee = employees.find((x: any) => x.user_id === row.created_by);
                    const _fullname = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                    const _vehicle = vehicles.find((x: any) => x.id === row.vehicle_id);
                    return {
                        ...row,
                        remaining_value: (row.original_cost || 0) - (row.total_depreciation || 0),  
                        userName: _fullname,
                        number_code: _vehicle ? _vehicle.number_code : '',
                    };
                });
        setDisplayData(mapped);
        const mappedAllocation = (dataAllocation?.data || []).map((row: any) => {
                const _employee = employees.find((x: any) => x.user_id === row.created_by);
                const _fullname = `${_employee?.last_name ?? ""} ${ _employee?.first_name ?? ""}`.trim();
                return {
                    ...row,
                    userName: _fullname,
                };
            });
        setDisplayDataAllocation(mappedAllocation);
    }, [first, rows,employees, data, dataAllocation, paramsPaginator]);
    function getDetail(id:any,cycleName:any){
        getDepreciationAllocationDetailByDepreciationAllocationId({ id: id}).then(res => {
            const detail = res.data.data
            if (detail) {
                const mappedDetail = detail.map((row: any) => ({
                    ...row,
                    cycleName: cycleName,
                }));
                setDetailAllocation(mappedDetail);
                console.log('detail',mappedDetail);
                
            }
            }).catch(err => {
            //setHasError(true)
            }).finally();
    }
    return (
        <div className="card">
            <Header 
            _paramsPaginator={paramsPaginator} 
            _setParamsPaginator={setParamsPaginator}
            _refresh={refresh} 
            _refreshAllocation={refreshAllocation}
            />
             <div style={{ height: 'calc(100vh - 8rem)' }}>
                <Splitter style={{ height: '100%', width: '100%' }}>
                {/* Panel 1 */}
                <SplitterPanel
                    size={35}
                    minSize={10}
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                    }}
                >
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <b>Danh sách tài sản</b>
                        <DataTableClient
                        rowHover
                        value={displayData}
                        loading={loading}
                        dataKey="id"
                        title="Tài khoản"
                        filterDisplay="row"
                        className={classNames("Custom-DataTableClient")}
                        scrollable
                        scrollHeight="flex"
                        style={{ flex: 1 }}
                        tableStyle={{ minWidth: "1600px" }}// ép bảng rộng hơn để có scroll ngang
                        >
                        <Column header="Thao tác" body={(e: any) => {
                            if (e.debits == null) {
                                return ActionBody(
                                        e,
                                        "/Depreciation/detail",
                                        { route: "/Depreciation/delete", action: deleteDepreciation ,params: {type: 1}},
                                        paramsPaginator,
                                        setParamsPaginator,
                                    );
                            } else {
                                return ActionBody(
                                        e,
                                        "/Depreciation/detail",
                                         { route: null, action: null ,params: {type: 1}},
                                        paramsPaginator,
                                        setParamsPaginator
                                    );
                            }
                        }} style={{ width: "6em" }} />
                        <Column field="status" header="Trạng thái" body={(e: any) => {
                            return (
                                <>
                                   <InputSwitch checked={Number(e.status) === 1} disabled />
                                </>
                            )
                        }}/>
                        <Column header="Ngày khấu hao" field="create_date" body={(e: any) => DateBody(e.create_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="code_number" header="Mã tài sản" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="name" header="Tên tài sản" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="number_code" header="Tên xe" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="original_cost" header="Nguyên giá" body={(e: any) => Helper.formatCurrency((e.original_cost || 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="useful_life" header="Thời gian sử dụng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="monthly_depreciation" header="Giá trị khấu hao tháng" body={(e: any) => Helper.formatCurrency((e.monthly_depreciation || 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="total_depreciation" header="Khấu hao lũy kế" body={(e: any) => Helper.formatCurrency((e.total_depreciation || 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="remaining_value" header="Giá trị còn lại" body={(e: any) => Helper.formatCurrency((e.remaining_value || 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="userName" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                    </DataTableClient>
                    </div>
                </SplitterPanel>
    
                {/* Panel 2 */}
                <SplitterPanel
                    size={65}
                    minSize={20}
                    style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                    }}
                >
                    <Splitter layout="vertical" style={{ height: '100%' }}>
                    {/* Panel 2.1 */}
                    <SplitterPanel
                        size={75}
                        minSize={10}
                        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <b>Phân bổ khấu hao tài sản</b>
                            <DataTableClient
                                rowHover
                                value={displayDataAllocation}
                                loading={loading}
                                dataKey="id"
                                title="Tài khoản"
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                onRowClick={(e: any) => {
                                    getDetail(e.data.id,e.data.cycle_name);
                                }}
                                tableStyle={{ minWidth: "1000px" }}
                            >
                                <Column
                                    header="Thao tác"
                                    body={(e: any) => {
                                          return ActionBody(
                                        e,
                                        null,
                                        { route: "/Depreciation/deleteAllocation", action: deleteDepreciationAllocation },
                                        paramsPaginator,
                                        setParamsPaginator
                                    );
                                    }}
                                />
                                <Column header="Ngày hạch toán" field="accounting_date" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="cycle_name" header="Kỳ khấu hao" body={(e: any) => e.cycle_name} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="note" header="Diễn giải" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="total_depreciation" header="Tổng tiền" body={(e: any) => Helper.formatCurrency((e.total_depreciation || 0).toString())} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="userName" header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                            </DataTableClient>
                        </div>
                    </SplitterPanel>
    
                    {/* Panel 2.2 */}
                    <SplitterPanel
                        size={25}
                        minSize={10}
                        style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <b>Chi tiết</b>
                            <DataTable rowHover value={detailAllocation}>
                                <Column field="cycleName" header="Kỳ khấu hao" />
                                <Column field="codeNumber" header="Mã tài sản" />
                                <Column field="name" header="Tên tài sản" />
                                <Column field="monthlyDepreciation" body={(row: any) => Helper.formatCurrency((row.monthlyDepreciation || 0).toString())} header="Giá trị khấu hao tháng" />
                            </DataTable>
                        </div>
                    </SplitterPanel>
                    </Splitter>
                </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}