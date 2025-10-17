import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { Calendar, Dropdown, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { deleteUser, listUser, updateStatusUser } from "../api";
import { useListUsers } from "../service";
import { classNames } from "primereact/utils";
import { MyCalendar } from "components/common/MyCalendar";

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
        >
            <div className="col-3">
                <Input
                    value={filter.name}
                    onChange={(e: any) => setFilter({ ...filter, name: e.target.value })}
                    label="Tìm kiếm"
                    size="small"
                    className={classNames("input-sm")}
                />
            </div>
            <div className="col-3">
                <MyCalendar dateFormat="dd/mm/yy" className={classNames("w-full",".p-inputtext","input-sm")}/>
            </div>
            <div className="col-3">
                <MyCalendar dateFormat="dd/mm/yy" className={classNames("w-full",".p-inputtext","input-sm")}/>
            </div>
            <div className="col-3">
                <Dropdown
                   size="small"
                   label="Danh mục"
                   className={classNames("dropdown-input-sm","p-dropdown-sm")}
                />
            </div>
        </GridForm>
    );
};

export default function User() {
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(2);

    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });

    // ✅ Gọi API server khi paramsPaginator thay đổi (debounce)
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await listUser(paramsPaginator);
                const list = res?.data?.data || [];
                setData(list);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        }, 500); // debounce 500ms

        return () => clearTimeout(timer);
    }, [JSON.stringify(paramsPaginator)]);

    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        setDisplayData(data?.data);
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
                dataKey="id"
                title="Tài khoản"
                filterDisplay="row"
                className={classNames("Custom-DataTableClient")}
            >
                <Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
                <Column field="username" header="Tên đăng nhập" filter showFilterMenu={false}     // 👈 Bỏ menu filter
    filterMatchMode="contains"/>
                <Column field="email" header="Email" />
                <Column field="first_name" header="Tên Quốc gia" />
                <Column field="last_name" header="Ghi chú" />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updateTime)} />
                <Column
                    field="status"
                    header="Hiển thị"
                    body={(e: any) =>
                        StatusBody(e, { route: "/categories/update/status", action: updateStatusUser })
                    }
                />
                <Column
                    header="Actions"
                    body={(e: any) =>
                        ActionBody(
                            e,
                            "/categories/detail",
                            { route: "/categories/delete", action: deleteUser },
                            paramsPaginator,
                            setParamsPaginator
                        )
                    }
                />
            </DataTableClient>
        </div>
    );
}