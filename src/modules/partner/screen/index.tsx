import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient, StatusPartnerBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";
import { useListPartner } from "../service";
import { deletePartner, updateStatusPartnerDetail } from "../api";

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
             add="/partner/add"
        >
        </GridForm>
    );
};

export default function ListPartner() {
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
    const { data, loading, error, refresh } = useListPartner({
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
                <Column field="name" header="Tên công ty" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="abbreviation" header="Tên viết tắt" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="tax_code" header="Mã số thuế" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="phone" header="Số điện thoại" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="email" header="Email" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column field="address" header="Địa chỉ" filter showFilterMenu={false} filterMatchMode="contains"/>
                <Column header="Là khách hàng" body={(e: any) =>  StatusPartnerBody(e.partner_details[0], {  action: updateStatusPartnerDetail },1)} />
                <Column header="Là nhà cung cấp" body={(e: any) =>  StatusPartnerBody(e.partner_details[1], { action: updateStatusPartnerDetail },2)} />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
                <Column
                    header="Thao tác"
                    body={(e: any) =>
                        ActionBody(
                            e,
                            "/partner/detail",
                            { route: "/partner/delete", action: deletePartner },
                            paramsPaginator,
                            setParamsPaginator
                        )
                    }
                    style={{width: '6em'}}
                />
            </DataTableClient>
        </div>
    );
}