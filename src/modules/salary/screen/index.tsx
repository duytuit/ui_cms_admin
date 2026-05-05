import { useEffect, useState } from "react";
import { ActionBody, Column, TimeBody, DataTableClient } from "components/common/DataTable";
import { GridForm } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListPayrollPeriod } from "../service";
import { useListEmployeeWithState } from "modules/employee/service";
import { useListDepartmentWithState } from "modules/department/service";
import { Helper } from "utils/helper";
import { create } from "domain";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

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
            add="/salary/add"
        >
        </GridForm>
    );
};

export default function ListSalary() {
    const { handleParamUrl } = useHandleParamUrl();
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
    const { data, loading, error, refresh } = useListPayrollPeriod({
        params: paramsPaginator,
        debounce: 500,
    });
     const { data: employees } = useListEmployeeWithState({});
     const { data: departments } = useListDepartmentWithState({});
    // ✅ Client-side pagination
    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
         const mapped = (data?.data || []).map((row: any) => {
                const emp = employees.find((e: any) => e.id === row.employee_id);
                const user = employees.find((e: any) => e.user_id === row.created_by);
                let dept = null;
                if(emp) {
                    const  employee_departments = emp?.employee_departments || [];
                    const emp_dept = employee_departments[0]; // Giả sử lấy department đầu tiên 
                    dept = departments.find((d: any) => d.id === emp_dept?.department_id);
                }
                    return {
                        ...row,
                         userName: `${emp?.last_name ?? ""} ${emp?.first_name ?? ""}`.trim(),
                         departmentName: dept?.name || "",
                         createdBy: user ? `${user.last_name} ${user.first_name}` : "",
                    };
                });
        setDisplayData(mapped);
        
    }, [first, rows, data,employees, departments,paramsPaginator]);

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
                <Column field="cycle_name" header="Kỳ lương" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="userName" header="Nhân viên" filter showFilterMenu={false}  filterMatchMode="contains"/>
                {/* <Column field="luongthucnhan" header="Lương thực nhận" 
                body={(e: any) => Helper.formatCurrency((e.luongthucnhan || 0).toString())} 
                filter showFilterMenu={false}  filterMatchMode="contains"/> */}
                <Column field="departmentName" header="Bộ phận" filter showFilterMenu={false}  filterMatchMode="contains"/>
                <Column field="ghichu" header="Ghi chú" />
                <Column body={(e: any) =>{
                    return (
                        <>
                            <a href={`/salary/SalaryByCycleName?cycleName=${e.cycle_name}&employeeId=${e.employee_id}`} target="_blank" rel="noopener noreferrer">
                                <Button label="chi tiết" rounded icon="pi pi-eye" severity="info" size="small" text />
                            </a>
                        </>
                    )
                }}
                 header="Xem lương"/>
                <Column field="createdBy" header="Người cập nhật" />
                <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} />
            </DataTableClient>
        </div>
    );
}