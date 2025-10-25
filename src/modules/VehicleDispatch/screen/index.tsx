import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListVehicle } from "../service";
import { deleteVehicle } from "../api";
import { typeVehicle } from "utils";

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
            add="/vehicle/add"
        >
        </GridForm>
    );
};

export default function ListVehicle() {
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
    const { data, loading, error, refresh } = useListVehicle({
        params: paramsPaginator,
        debounce: 500,
    });
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
         const mapped = (data?.data || []).map((row: any) => {
                    const type = typeVehicle.find((x: any) => x.isExternalDriver === row.is_external_driver);
                    return {
                        ...row,
                        type:type?.name || "",
                    };
                });
        setDisplayData(mapped);
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
                filterDisplay="row"
                className={classNames("Custom-DataTableClient")}
            >
                <Column field="number_code" header="Biển số xe" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="type" header="Loại xe" />
                <Column field="note" header="Ghi chú" />
                <Column field="updated_by" header="Người cập nhật" />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                <Column
                   header="Thao tác"
                   body={(row: any) => {
                        return ActionBody(
                            row,
                            "/vehicle/detail",
                            { route: "/vehicle/delete", action: deleteVehicle },
                            paramsPaginator,
                            setParamsPaginator
                        );
                    }}
                />
            </DataTableClient>
        </div>
    );
}