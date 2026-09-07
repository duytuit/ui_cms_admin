import { useEffect, useState } from "react";
import { Column, DataTableClient } from "components/common/DataTable";
import { GridForm, Dropdown, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { classNames } from "primereact/utils";
import { deleteWork } from "../api";
import { useListWork } from "../service";
import { Splitter } from "primereact/splitter";
import { Helper } from "utils/helper";
import { FilterMatchMode } from "primereact/api";
import { MyCalendar } from "components/common/MyCalendar";
import { useNavigate } from "react-router-dom";
import { useListEmployeeWithState } from "modules/employee/service";

const getStatusInfo = (row: any, progress: number) => {
    const statusValue = String(row?.status ?? row?.trangthai ?? row?.statusName ?? row?.state ?? "").toLowerCase();

    if (Number(row?.status) === 1) {
        return { label: "Đang thực hiện", color: "#2563eb", bg: "#dbeafe", text: "#1d4ed8" };
    }

    if (Number(row?.status) === 0) {
        return { label: "Chưa bắt đầu", color: "#f59e0b", bg: "#fef3c7", text: "#92400e" };
    }

    if (progress >= 100 || statusValue.includes("hoan") || statusValue.includes("done") || statusValue.includes("complete")) {
        return { label: "Hoàn thành", color: "#16a34a", bg: "#dcfce7", text: "#166534" };
    }

    if (statusValue.includes("dang") || statusValue.includes("process") || statusValue.includes("active") || statusValue.includes("thuc")) {
        return { label: "Đang thực hiện", color: "#2563eb", bg: "#dbeafe", text: "#1d4ed8" };
    }

    if (statusValue.includes("chua") || statusValue.includes("new") || statusValue.includes("pending") || statusValue.includes("tam")) {
        return { label: "Chưa bắt đầu", color: "#f59e0b", bg: "#fef3c7", text: "#92400e" };
    }

    return { label: "Đang thực hiện", color: "#2563eb", bg: "#dbeafe", text: "#1d4ed8" };
};

const getInitials = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(/\s+/).filter(Boolean);
    const initials = words.slice(0, 2).map((word) => word.charAt(0).toUpperCase());
    return initials.join("") || "A";
};

const parseJsonArray = (value: any) => {
    if (Array.isArray(value)) return value;
    if (typeof value !== "string" || !value.trim()) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const normalizeChecklist = (details: any[]) => details.map((item: any) => ({
    ...item,
    label: item?.name || item?.label || "Checklist",
    checked: Boolean(item?.checked),
}));

const getEmployeeName = (employee: any) => {
    const fullName = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ");
    return fullName || employee?.code || `ID ${employee?.id}`;
};

const mapWorkTree = (items: any[], employees: any[] = []) => {
    const employeeById = employees.reduce((result: Record<string, any>, employee: any) => {
        result[String(employee?.id)] = employee;
        return result;
    }, {});
    const byParent = items.reduce((result: Record<string, any[]>, item: any) => {
        const parentId = item?.parent_id == null ? "root" : String(item.parent_id);
        result[parentId] = [...(result[parentId] || []), item];
        return result;
    }, {});

    const toDetail = (item: any): any => {
        const checklist = normalizeChecklist(Array.isArray(item?.work_details) ? item.work_details : []);
        const assigneeIds = parseJsonArray(item?.assignee_ids);

        return {
            ...item,
            name: item?.name || "Công việc",
            deadline: Helper.formatDate(item?.due_date),
            checklist,
            assignees: assigneeIds.map((id: any) => {
                const employee = employeeById[String(id)];
                return {
                    id,
                    name: employee ? getEmployeeName(employee) : `ID ${id}`,
                    code: employee?.code,
                };
            }),
            children: (byParent[String(item?.id)] || []).map(toDetail),
        };
    };

    return (byParent.root || []).map((item: any) => ({
        ...item,
        title: item?.name || "Công việc",
        congviec: (byParent[String(item?.id)] || []).map(toDetail),
    }));
};

const Header = ({ _setParamsPaginator, _paramsPaginator, employeeOptions }: any) => {
    const [filter, setFilter] = useState({ name: "", customerDetailId: "", fromDate: Helper.lastWeekString(), toDate: Helper.toDayString() });

    useEffect(() => {
        _setParamsPaginator((prev: any) => ({
            ...prev,
            keyword: filter.name,
            fromDate: filter.fromDate,
            toDate: filter.toDate,
            customerDetailId: filter.customerDetailId,
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
          <Input
            value={filter.name}
            onChange={(e: any) =>
              setFilter({ ...filter, name: e.target.value })
            }
            label="Tìm kiếm"
            size="small"
            className={classNames("input-sm")}
          />
        </div>
        <div className="col-2">
          <MyCalendar
            dateFormat="dd/mm/yy"
            value={filter.fromDate}
            label="Từ ngày"
            onChange={(e: any) => setFilter({ ...filter, fromDate: e })}
            className={classNames("w-full", "p-inputtext", "input-sm")}
          />
        </div>
        <div className="col-2">
          <MyCalendar
            dateFormat="dd/mm/yy"
            value={filter.toDate}
            label="Đến ngày"
            onChange={(e: any) => setFilter({ ...filter, toDate: e })}
            className={classNames("w-full", "p-inputtext", "input-sm")}
          />
        </div>
        <div className="col-6">
          <Dropdown
            filter
            showClear
            value={filter.customerDetailId}
            options={employeeOptions}
            onChange={(e: any) =>
              setFilter({ ...filter, customerDetailId: e.target.value })
            }
            label="Người phụ trách"
            className={classNames("dropdown-input-sm", "p-dropdown-sm")}
          />
        </div>
      </GridForm>
    );
};

export default function ListWork() {
    const navigate = useNavigate();
    const { handleParamUrl } = useHandleParamUrl();
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const { data: employees } = useListEmployeeWithState({
        params: { keyword: "abc" },
        debounce: 500,
    });
    const employeeOptions = (Array.isArray(employees) ? employees : []).map((employee: any) => ({
        label: `${getEmployeeName(employee)}${employee?.code ? ` - ${employee.code}` : ""}`,
        value: employee?.id,
    }));
    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        keyword: "",
    });

    const { data, loading, refresh } = useListWork({
        params: paramsPaginator,
        debounce: 500,
    });

    const handleDeleteWork = async (workId: number | string | undefined) => {
        if (workId == null || !window.confirm("Bạn có chắc muốn xóa công việc này không?")) return;

        try {
            await deleteWork({ id: workId });
            await refresh();
        } catch {
            return;
        }
    };

    useEffect(() => {
        if (!data) return;
        handleParamUrl(paramsPaginator);
        setDisplayData(mapWorkTree(Array.isArray(data) ? data : data?.data || [], employees));
    }, [data, employees, paramsPaginator]);

    return (
        <div className="card">
            <Header
                _paramsPaginator={paramsPaginator}
                _setParamsPaginator={setParamsPaginator}
                employeeOptions={employeeOptions}
            />
            <div style={{ height: "calc(100vh - 8rem)" }}>
                <Splitter style={{ height: "100%", width: "100%" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                        <DataTableClient
                            rowHover
                            value={displayData}
                            currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
                            loading={loading}
                            dataKey="id"
                            title="Công việc"
                            filterDisplay="row"
                            filters={filters}
                            onFilter={(e: any) => setFilters(e.filters)}
                            className={classNames("Custom-DataTableClient")}
                            scrollable
                            scrollHeight="flex"
                            style={{ flex: 1 }}
                            tableStyle={{ minWidth: "1400px" }}
                        >

                            <Column
                                header="Nội dung công việc"
                                body={(row: any) => {
                                    const details = row?.congviec || [];

                                    return (
                                        <div style={{ minWidth: "520px" }}>
                                            <div className="font-medium text-900 mb-2">{row.title || row.tieude || "Công việc"}</div>
                                            <div
                                                style={{
                                                    background: "#f8fafc",
                                                    border: "1px solid #e2e8f0",
                                                    borderRadius: "12px",
                                                    padding: "10px",
                                                }}
                                            >
                                                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 700, marginBottom: "8px" }}>
                                                    Chi tiết công việc
                                                </div>

                                                <div style={{ display: "grid", gap: "8px" }}>
                                                    {details.map((item: any, index: number) => {
                                                        const checklistItems = Array.isArray(item?.checklist) ? item.checklist : [];
                                                        const checkedCount = checklistItems.filter((check: any) => check?.checked).length;
                                                        const detailProgress = checklistItems.length
                                                            ? (checkedCount / checklistItems.length) * 100
                                                            : Number(item?.progress ?? item?.tiendo ?? item?.completion ?? 0);
                                                        const normalizedProgress = Number.isFinite(detailProgress)
                                                            ? Math.max(0, Math.min(100, detailProgress))
                                                            : 0;
                                                        const detailStatus = getStatusInfo(item, normalizedProgress);
                                                        const detailAssignees = Array.isArray(item?.assignees) ? item.assignees : [];
                                                        const checklistCount = checklistItems.length;
                                                        const checklistDone = checklistCount ? checkedCount : 0;
                                                        const progressSteps = checklistCount > 0 ? Array.from({ length: checklistCount }, (_, idx) => idx < checklistDone) : Array.from({ length: 4 }, (_, idx) => idx < Math.round(normalizedProgress / 25));

                                                        return (
                                                            <div
                                                                key={index}
                                                                style={{
                                                                    background: "#fff",
                                                                    border: "1px solid #e2e8f0",
                                                                    borderRadius: "10px",
                                                                    padding: "10px",
                                                                }}
                                                            >
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "8px" }}>
                                                                    <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                                                        {item.name || item.tencongviec || `Chi tiết ${index + 1}`}
                                                                    </div>
                                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                                        <span
                                                                            className="px-2 py-1 border-round-md text-xs font-medium"
                                                                            style={{
                                                                                background: detailStatus.bg,
                                                                                color: detailStatus.text,
                                                                                border: `1px solid ${detailStatus.color}33`,
                                                                                whiteSpace: "nowrap",
                                                                            }}
                                                                        >
                                                                            {detailStatus.label}
                                                                        </span>
                                                                         <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteWork(item?.id)}
                                                                            style={{
                                                                                border: "none",
                                                                                background: "#f87171",
                                                                                color: "#fff",
                                                                                borderRadius: "8px",
                                                                                padding: "6px 10px",
                                                                                cursor: "pointer",
                                                                                fontWeight: 600,
                                                                                fontSize: "11px",
                                                                                lineHeight: 1.2,
                                                                            }}
                                                                        >
                                                                            Xóa
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => navigate(`/work/updateDetail/${row?.id}?childId=${item?.id}`)}
                                                                            style={{
                                                                                border: "none",
                                                                                background: "#2563eb",
                                                                                color: "#fff",
                                                                                borderRadius: "8px",
                                                                                padding: "6px 10px",
                                                                                cursor: "pointer",
                                                                                fontWeight: 600,
                                                                                fontSize: "11px",
                                                                                lineHeight: 1.2,
                                                                            }}
                                                                        >
                                                                            Xem chi tiết
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1fr", gap: "10px" }}>
                                                                    <div>
                                                                        <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
                                                                            Hạn hoàn thành
                                                                        </div>
                                                                        <div style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                                                                            {item.hanHoanThanh || item.deadline || item.hanhoanthanh || "-"}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                                                            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 600 }}>Tiến độ</span>
                                                                        </div>
                                                                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, progressSteps.length)}, minmax(0, 1fr))`, gap: "4px", marginBottom: "4px" }}>
                                                                            {progressSteps.map((active, stepIndex) => (
                                                                                <div
                                                                                    key={`${item.name || item.tencongviec || index}-${stepIndex}`}
                                                                                    style={{
                                                                                        height: "8px",
                                                                                        borderRadius: "999px",
                                                                                        background: active ? ["#93c5fd", "#60a5fa", "#3b82f6", "#2563eb"][stepIndex % 4] : "#e2e8f0",
                                                                                        border: "1px solid rgba(148, 163, 184, 0.25)",
                                                                                    }}
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                        <div style={{ display: "grid", gridTemplateColumns: `repeat(${progressSteps.length}, minmax(0, 1fr))`, fontSize: "9px", color: "#64748b", textAlign: "center" }}>
                                                                            {progressSteps.map((_, stepIndex) => (
                                                                                <span key={`label-${stepIndex}`}>{stepIndex + 1}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <div style={{ fontSize: "10px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
                                                                            Người phụ trách
                                                                        </div>
                                                                        <div className="flex align-items-center gap-2" style={{ minHeight: "30px" }}>
                                                                            {detailAssignees.slice(0, 3).map((person: any, personIndex: number) => (
                                                                                <div
                                                                                    key={personIndex}
                                                                                    title={person.name || person.ten || "Người phụ trách"}
                                                                                    style={{
                                                                                        width: "26px",
                                                                                        height: "26px",
                                                                                        borderRadius: "50%",
                                                                                        background: ["#dbeafe", "#dcfce7", "#fef3c7", "#fce7f3", "#ede9fe"][personIndex % 5],
                                                                                        color: "#1f2937",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "center",
                                                                                        fontSize: "10px",
                                                                                        fontWeight: 700,
                                                                                        border: "2px solid #fff",
                                                                                        boxShadow: "0 0 0 1px #e2e8f0",
                                                                                    }}
                                                                                >
                                                                                    {getInitials(person.name || person.ten || "A")}
                                                                                </div>
                                                                            ))}
                                                                            {detailAssignees.length > 3 && (
                                                                                <div
                                                                                    style={{
                                                                                        width: "26px",
                                                                                        height: "26px",
                                                                                        borderRadius: "50%",
                                                                                        background: "#e2e8f0",
                                                                                        color: "#334155",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "center",
                                                                                        fontSize: "10px",
                                                                                        fontWeight: 700,
                                                                                    }}
                                                                                >
                                                                                    +{detailAssignees.length - 3}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>

                                                                {checklistItems.length > 0 && (
                                                                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#475569" }}>
                                                                        <span style={{ fontWeight: 700, color: "#334155" }}>Checklist ({checkedCount}/{checklistCount}):</span>{" "}
                                                                        {checklistItems.map((check: any, checkIndex: number) => (
                                                                            <span key={check?.id ?? checkIndex} style={{ marginRight: "8px", color: check?.checked ? "#16a34a" : "#475569" }}>
                                                                                {check?.checked ? "✓" : "○"} {check?.label || check?.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                        </DataTableClient>
                    </div>
                </Splitter>
            </div>
        </div>
    );
}