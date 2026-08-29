import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, DateBody } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListWork } from "../service";
import { Splitter } from "primereact/splitter";
import { Helper } from "utils/helper";
import { Checkbox } from "components/uiCore";
import { deleteContractFile } from "modules/ContractFile/api";
import { FilterMatchMode } from "primereact/api";
import { MyCalendar } from "components/common/MyCalendar";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "" , fromDate: Helper.lastWeekString(),
    toDate: Helper.toDayString()});

    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
            fromDate: filter.fromDate,
            toDate: filter.toDate,
        }));

    }, [filter]);

    return (
        <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
            add="/work/add"
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
    );
};

export default function ListWork() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [filters, setFilters] = useState({
              global: { value: null, matchMode: FilterMatchMode.CONTAINS },});

    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListWork({
        params: paramsPaginator,
        debounce: 500,
    });
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
         const mapped = (data?.data || []).map((row: any) => {
                    return {
                        ...row,
                    };
                });
        setDisplayData(mapped);
    }, [first, rows, data, paramsPaginator]);

    return (
        <>
            <div className="card">
                <Header
                _paramsPaginator={paramsPaginator}
                _setParamsPaginator={setParamsPaginator}
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
                        tableStyle={{ minWidth: "2900px" }} // ép bảng rộng hơn để có scroll ngang
                    >
                        {/* Custom checkbox column */}
                        <Column
                        header={
                            <Checkbox
                            checked={
                                selectedRows.length === displayData.length &&
                                displayData.length > 0
                            }
                            onChange={(e: any) => {
                                if (e.checked) setSelectedRows(displayData.map((d) => d.id));
                                else setSelectedRows([]);
                            }}
                            />
                        }
                        body={(rowData: any) => (
                            <Checkbox
                            className="p-checkbox-sm"
                            checked={selectedRows.includes(rowData.id)}
                            onChange={(e: any) => {
                                if (e.checked)
                                setSelectedRows((prev) => [...prev, rowData.id]);
                                else
                                setSelectedRows((prev) =>
                                    prev.filter((id) => id !== rowData.id)
                                );
                            }}
                            onClick={(e: any) => e.stopPropagation()} // ⚡ chặn row click
                            />
                        )}
                        style={{ width: "3em" }}
                        />
                        <Column header="Thao tác" body={(e: any) => {
                        if (e.debits == null) {
                            return ActionBody(
                                e,
                                "/ContractFile/detail",
                                { route: "/ContractFile/delete", action: deleteContractFile },
                                paramsPaginator,
                                setParamsPaginator
                            );
                        } else {
                            return ActionBody(
                                e,
                                "/ContractFile/detail",
                                null,
                                paramsPaginator,
                                setParamsPaginator
                            );
                        }
                        }} style={{ width: "6em" }} />
                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="customerName" header="Khách hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="customerAbb" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="file_number" header="Số file" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="bill" header="Bill" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="declaration" header="Số tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="quantity" header="Số lượng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="container_code" header="Số cont" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="sales" header="Tên sales" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="listEmployee" header="Giao nhận" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="feature" header="Tính chất" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="type" header="Loại hàng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="declaration_quantity" header="Số lượng tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="declaration_type" header="Loại tờ khai" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="business" header="Nghiệp vụ" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="occurrence" header="Phát sinh" filter showFilterMenu={false} filterMatchMode="contains" />
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