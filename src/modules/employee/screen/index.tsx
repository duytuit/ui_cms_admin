import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { useListEmployee } from "../service";
import { deleteEmployee } from "../api";

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
             add="/employee/add"
        >
        </GridForm>
    );
};

export default function ListEmployee() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [paramsPaginator, setParamsPaginator] = useState({
           pageNum: 1,
           pageSize: 20,
           first: 0,
           render: false,
           keyword: "",
       });
    const { data, loading, error, refresh } = useListEmployee({
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
                totalRecords={ data?.total}
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
                <Column field="phone" header="Tên đăng nhập" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="email" header="Email" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="first_name" header="Tên đầu" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="last_name" header="Tên cuối" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                <Column
                    header="Thao tác"
                    body={(e: any) =>
                        {
                            return ActionBody(
                                e,
                                "/employee/detail",
                                { route: "/employee/delete", action: deleteEmployee },
                                paramsPaginator,
                                setParamsPaginator
                            )
                        }
                    }
                />
            </DataTableClient>
        </div>
    );
}