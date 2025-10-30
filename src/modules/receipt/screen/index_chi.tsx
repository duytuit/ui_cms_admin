import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListReceipt } from "../service";
import { deleteReceipt } from "../api";

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
            add="/receipt/updateChi"
        >
        </GridForm>
    );
};

export default function ListReceiptChi() {
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
    const { data, loading, error, refresh } = useListReceipt({
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
                 tableStyle={{ minWidth: "2000px" }} 
            >
                <Column
                   header="Thao tác"
                   body={(row: any) => {
                        return ActionBody(
                            row,
                            "/receipt/detail",
                            { route: "/receipt/delete", action: deleteReceipt },
                            paramsPaginator,
                            setParamsPaginator
                        );
                    }}
                />
                <Column field="code" header="Số chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Ngày chứng từ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Người nhận" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Lý do chi" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Số hóa đơn" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Số tiền" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Quỹ" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Hình thức" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="STK" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Người tạo" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="name" header="Thời gian" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="note" header="Ghi chú" />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
               
            </DataTableClient>
        </div>
    );
}