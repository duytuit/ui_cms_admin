import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListStorage } from "../service";
import { deleteStorage, updateStorage } from "../api";

// ✅ Component Header lọc dữ liệu
const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
    const [filter, setFilter] = useState({ name: "" });

    useEffect(() => {
        // Mỗi khi filter thay đổi => cập nhật params
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
        }));
    }, [filter.name]);

    return (
        <GridForm
            paramsPaginator={_paramsPaginator}
            setParamsPaginator={_setParamsPaginator}
            filter={filter}
            setFilter={setFilter}
            className="lg:col-9"
            add="/storage/add"
        >
        </GridForm>
    );
};

export default function ListStorage() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any>([]);
    const [displayData, setDisplayData] = useState<any>();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListStorage({
        params: paramsPaginator,
        debounce: 500,
    });
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        setDisplayData(data?.data || []);
    }, [first, rows, data, paramsPaginator]);

    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />

            <DataTableClient
                rowHover
                value={displayData}
                paginator
                rows={rows}
                first={first}
                totalRecords={displayData?.length || 0}
                currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                onPage={(e: any) => {
                    setFirst(e.first);
                    setRows(e.rows);
                }}
                loading={loading}
                selectionMode="multiple"
                selection={selectedRows}
                onSelectionChange={(e: any) => setSelectedRows(e.value)}
                filterDisplay="row"
                className={classNames("Custom-DataTableClient")}
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
                <Column field="name" header="Dữ liệu" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="note" header="Ghi chú" />
                <Column field="updated_by" header="Người cập nhật" />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                <Column
                   header="Actions"
                   body={(row: any) => {
                        return ActionBody(
                            row,
                            "/storage/detail",
                            { route: "/storage/delete", action: deleteStorage },
                            paramsPaginator,
                            setParamsPaginator
                        );
                    }}
                />
            </DataTableClient>
        </div>
    );
}