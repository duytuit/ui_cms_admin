import { useEffect, useState } from "react";
import { Column, DataTableClient } from "components/common/DataTable";
import { GridForm, Dropdown, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { classNames } from "primereact/utils";
import { useListWork } from "../service";
import { Splitter } from "primereact/splitter";
import { Helper } from "utils/helper";
import { Checkbox, ProgressBar } from "components/uiCore";
import { FilterMatchMode } from "primereact/api";
import { MyCalendar } from "components/common/MyCalendar";
import { useNavigate } from "react-router-dom";

const getProgressValue = (row: any) => {
    const rawValue = Number(row?.progress ?? row?.tiendo ?? row?.completion ?? row?.progressPercent ?? row?.percent ?? 0);
    if (Number.isFinite(rawValue)) return Math.max(0, Math.min(100, rawValue));

    const total = Array.isArray(row?.congviec) ? row.congviec.length : 0;
    const done = Array.isArray(row?.congviec)
        ? row.congviec.filter((item: any) => {
            const value = Number(item?.progress ?? item?.tiendo ?? item?.completion ?? item?.percent ?? 0);
            const status = String(item?.status ?? item?.trangthai ?? "").toLowerCase();
            return value >= 100 || status.includes("hoan") || status.includes("done") || status.includes("complete");
        }).length
        : 0;

    return total ? Math.round((done / total) * 100) : 0;
};

const getStatusInfo = (row: any, progress: number) => {
    const statusValue = String(row?.status ?? row?.trangthai ?? row?.statusName ?? row?.state ?? "").toLowerCase();

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

const getWorkAssignees = (row: any) => {
    const assignees = [
        ...(Array.isArray(row?.assignees) ? row.assignees : []),
        ...((row?.congviec || []).flatMap((item: any) => (Array.isArray(item?.assignees) ? item.assignees : []))),
    ];

    const unique: any[] = [];
    assignees.forEach((person: any) => {
        const key = person?.name || person?.ten || person?.id;
        if (!key || unique.some((item) => (item?.name || item?.ten || item?.id) === key)) return;
        unique.push(person);
    });

    return unique;
};

const getWorkDeadline = (row: any) => {
    const values = [
        row?.hanHoanThanh,
        row?.deadline,
        row?.hanhoanthanh,
        ...(row?.congviec || []).map((item: any) => item?.hanHoanThanh || item?.deadline || item?.hanhoanthanh),
    ];

    return values.find((value) => Boolean(value)) || "-";
};

const getChecklistPreview = (row: any) => {
    const items = (row?.congviec || []).flatMap((item: any) => Array.isArray(item?.checklist) ? item.checklist : []);
    return items.length ? items : ["Chưa có checklist"];
};

const sampleWorks = [
  {
    id: 1,
    title: "Thiết kế phần mềm asa",
    customerName: "Công ty A",
    congviec: [
      {
        name: "Thiết kế giao diện công việc",
        status: "Đang thực hiện",
        accounting_date: "2026-08-30",
        hanHoanThanh: "2026-09-10",
        progress: 70,
        assignees: [
          { name: "Nguyễn Văn A" },
          { name: "Trần Thị B" },
          { name: "Lê Văn C" },
        ],
        checklist: ["Lên wireframe", "Thiết kế form", "Review nội dung"],
      },
    ],
  },
  {
    id: 2,
    title: "Cập nhật tài liệu hợp đồng",
    customerName: "Công ty B",
    congviec: [
      {
        name: "Kiểm tra hợp đồng",
        status: "Hoàn thành",
        accounting_date: "2026-08-26",
        hanHoanThanh: "2026-08-30",
        progress: 100,
        assignees: [{ name: "Phạm Thị D" }, { name: "Hoàng Văn E" }],
        checklist: ["Đọc hợp đồng", "Kiểm tra điều khoản", "Phê duyệt"],
      },
      {
        name: "Đính kèm file",
        status: "Hoàn thành",
        accounting_date: "2026-08-27",
        hanHoanThanh: "2026-08-31",
        progress: 100,
        assignees: [{ name: "Phạm Thị D" }],
        checklist: ["Tải file", "Xác minh tài liệu", "Lưu trữ"],
      },
    ],
  },
  {
    id: 3,
    title: "Phân tích yêu cầu khách hàng",
    customerName: "Công ty C",
    congviec: [
      {
        name: "Thu thập yêu cầu",
        status: "Chưa bắt đầu",
        accounting_date: "2026-08-27",
        hanHoanThanh: "2026-09-12",
        progress: 0,
        assignees: [{ name: "Vũ Thị F" }, { name: "Đặng Văn G" }],
        checklist: ["Gặp khách hàng", "Ghi nhận yêu cầu", "Xác nhận scope"],
      },
      {
        name: "Phân loại dữ liệu",
        status: "Chưa bắt đầu",
        accounting_date: "2026-08-28",
        hanHoanThanh: "2026-09-14",
        progress: 0,
        assignees: [{ name: "Ngô Thị H" }],
        checklist: ["Nhóm dữ liệu", "Phân nhóm chức năng", "Đánh giá ưu tiên"],
      },
    ],
  },
  {
    id: 4,
    title: "Kiểm thử và deploy",
    customerName: "Công ty D",
    congviec: [
      {
        name: "Test chức năng",
        status: "Hoàn thành",
        accounting_date: "2026-08-28",
        hanHoanThanh: "2026-09-01",
        progress: 100,
        assignees: [{ name: "Mai Văn K" }],
        checklist: ["Kiểm tra login", "Test form", "Gửi báo cáo"],
      },
      {
        name: "Deploy QA",
        status: "Đang thực hiện",
        accounting_date: "2026-08-30",
        hanHoanThanh: "2026-09-02",
        progress: 80,
        assignees: [{ name: "Lý Thị M" }, { name: "Mai Văn K" }],
        checklist: ["Build ứng dụng", "Deploy môi trường QA", "Kiểm tra lỗi"],
      },
      {
        name: "Backup dữ liệu",
        status: "Đang thực hiện",
        accounting_date: "2026-08-29",
        hanHoanThanh: "2026-09-03",
        progress: 60,
        assignees: [{ name: "Lý Thị M" }],
        checklist: ["Lấy snapshot", "Nén dữ liệu", "Xác nhận backup"],
      },
    ],
  },
];

const Header = ({ _setParamsPaginator, _paramsPaginator }: any) => {
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
            options={[]}
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
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(20);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        type: CategoryEnum.country,
        keyword: "",
    });

    const { data, loading } = useListWork({
        params: paramsPaginator,
        debounce: 500,
    });

    useEffect(() => {
        handleParamUrl(paramsPaginator);
        const source = Array.isArray(data?.data) && data.data.length > 0 ? data.data : sampleWorks;
        setDisplayData(source.map((row: any) => ({ ...row })));
    }, [first, rows, data, paramsPaginator]);

    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
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
                                    const checklist = getChecklistPreview(row);

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
                                                        const detailProgress = Number(item?.progress ?? item?.tiendo ?? item?.completion ?? 0);
                                                        const normalizedProgress = Number.isFinite(detailProgress)
                                                            ? Math.max(0, Math.min(100, detailProgress))
                                                            : 0;
                                                        const detailStatus = getStatusInfo(item, normalizedProgress);
                                                        const detailAssignees = Array.isArray(item?.assignees) ? item.assignees : [];

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
                                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
                                                                    <div style={{ fontWeight: 700, color: "#0f172a" }}>
                                                                        {item.name || item.tencongviec || `Chi tiết ${index + 1}`}
                                                                    </div>
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
                                                                            <span style={{ fontSize: "11px", color: "#0f172a", fontWeight: 700 }}>{normalizedProgress}%</span>
                                                                        </div>
                                                                        <ProgressBar value={normalizedProgress} showValue={false} style={{ height: "8px", borderRadius: "999px" }} />
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

                                                                {Array.isArray(item?.checklist) && item.checklist.length > 0 && (
                                                                    <div style={{ marginTop: "8px", fontSize: "11px", color: "#475569" }}>
                                                                        <span style={{ fontWeight: 700, color: "#334155" }}>Checklist:</span> {item.checklist.slice(0, 3).join(" • ")}
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
                                style={{ width: "700px" }}
                            />

                            <Column
                                header="Xem chi tiết"
                                body={(row: any) => (
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/work/detail/${row.id}`)}
                                        style={{
                                            border: "none",
                                            background: "#2563eb",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Xem chi tiết
                                    </button>
                                )}
                                style={{ width: "70px" }}
                            />
                        </DataTableClient>
                    </div>
                </Splitter>
            </div>
        </div>
    );
}