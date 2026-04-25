import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, Column, TimeBody, DataTableClient, DateBody, ActionBodyWithIds } from "components/common/DataTable";
import { Calendar, CalendarY, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListDepreciation } from "../service";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { Button, Checkbox, DataTable } from "components/uiCore";
import { delMultiDebit } from "modules/Debit/api";
import { Helper } from "utils/helper";

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
            add="/department/add"
        >
        </GridForm>
    );
};

export default function ListDepreciation() {
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
        type: CategoryEnum.country,
        keyword: "",
    });
    const { data, loading, error, refresh } = useListDepreciation({
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
                        value={[]}
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
                        <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="file_number" header="Số chứng từ" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="customerAbb" header="Mã tài sản" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="customerName" header="Tên tài sản" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="employee" header="Nguyên giá" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="container_code" header="Thời gian sử dụng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="declaration" header="Giá trị khấu hao tháng" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="quantity" header="Khấu hao lũy kế" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="quantity" header="Giá trị còn lại" filter showFilterMenu={false} filterMatchMode="contains" />
                        <Column field="quantity" header="Ngày kết thúc" filter showFilterMenu={false} filterMatchMode="contains" />
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
                                value={[]}
                                loading={loading}
                                dataKey="id"
                                title="Tài khoản"
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                                scrollable
                                scrollHeight="flex"
                                style={{ flex: 1 }}
                                tableStyle={{ minWidth: "1000px" }}
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
                                        if (e.checked)
                                        setSelectedRows(displayData.map((d) => d.id));
                                        else
                                        setSelectedRows([]);
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
                                <Column
                                    header="Thao tác"
                                    body={(row: any) => {
                                        if(row.cf_status_confirm == 1){
                                                                                        
                                        }else{
                                        return ActionBodyWithIds(
                                            row.debit_ids,
                                            null,
                                            { route: "Debit/delete/multiDebit", action: delMultiDebit },
                                            paramsPaginator,
                                            setParamsPaginator
                                        );
                                        }
                                    }}
                                />
                                <Column field="accounting_date" header="Ngày lập" body={(e: any) => DateBody(e.accounting_date)} filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="file_number" header="Số chứng từ" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="container_code" header="Diễn giải" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="customerName" header="Tổng tiền" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column field="sumNH" body={(row: any) => Helper.formatCurrency(row.sumNH.toString())} header="Tổng phí nâng hạ" filter showFilterMenu={false} filterMatchMode="contains" />
                                <Column header="Người cập nhật" filter showFilterMenu={false} filterMatchMode="contains" />
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
                            <DataTable rowHover value={[]}>
                                <Column field="debit_name" header="Mã tài sản" />
                                <Column field="debit_name" header="Tên tài sản" />
                                <Column field="debit_purchase_price" body={(row: any) => Helper.formatCurrency(row.debit_purchase_price.toString())} header="Giá trị khấu hao tháng" />
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