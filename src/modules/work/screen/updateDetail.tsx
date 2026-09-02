
import { AddForm, InputForm, InputTextareaForm } from "components/common/AddForm";
import { Dropdown, MultiSelect } from "components/common/ListForm";
import { DateTimeField } from "components/common/DateTimeField";
import { useNavigate, useParams } from "react-router-dom";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject, typeWork } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "components/uiCore";
import { addWork, showWork, updateWork } from "../api";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { uploadFile } from "lib/request";

const createEmptyChecklist = () => [""];

const createEmptyFileItem = () => ({
  fileName: "",
  externalLink: "",
});

const createEmptyDetail = () => ({
  tencongviec: "",
  motacongviec: "",
  nguoiphutrach: [],
  hanhoanthanh: "",
  checklist: createEmptyChecklist(),
});

const createEmptyWork = () => ({
  tieude: "",
  loaicongviec: 0,
  thoigianlap: "",
  thoigianketthuclap: "",
  fileList: [createEmptyFileItem()],
  chitiet: [createEmptyDetail()],
});

const createEmptyWorkList = () => ({ congviec: [createEmptyWork()] });

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const sampleWorkDetail = {
  id: Date.now(),
  title: randomFrom([
    "Thiết kế phần mềm asa",
    "Thiết kế phần mềm quản lý",
    "Thiết kế phần mềm CRM",
    "Thiết kế hệ thống nội bộ",
  ]),
  customerName: randomFrom(["Công ty A", "Công ty B", "Công ty C", "Công ty D"]),
  congviec: [
    {
      name: "Thiết kế giao diện công việc",
      status: "Đang thực hiện",
      accounting_date: "2026-08-30",
      hanHoanThanh: "2026-09-10",
      progress: 70,
      assignees: [
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
      ],
      checklist: [
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
      ],
    },
    {
      name: "Thiết kế giao diện công việc",
      status: "Đang thực hiện",
      accounting_date: "2026-08-30",
      hanHoanThanh: "2026-09-10",
      progress: 70,
      assignees: [
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
      ],
      checklist: [
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
      ],
    },
    {
      name: "Thiết kế giao diện công việc",
      status: "Đang thực hiện",
      accounting_date: "2026-08-30",
      hanHoanThanh: "2026-09-10",
      progress: 70,
      assignees: [
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
      ],
      checklist: [
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
      ],
    },
     {
      name: "Thiết kế giao diện công việc",
      status: "Đang thực hiện",
      accounting_date: "2026-08-30",
      hanHoanThanh: "2026-09-10",
      progress: 70,
      assignees: [
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
        { name: randomFrom(["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"]) },
      ],
      checklist: [
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
        "Lên wireframe",
        "Thiết kế form",
        "Review nội dung",
      ],
    },
  ],
};

export default function UpdateDetailWork() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({
    ...createEmptyWorkList(),
    title: sampleWorkDetail.title,
    customerName: sampleWorkDetail.customerName,
    congviec: sampleWorkDetail.congviec,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"comments" | "history">("comments");
  const [newChecklist, setNewChecklist] = useState("");
  const [commentText, setCommentText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [checklist, setChecklist] = useState(
    (sampleWorkDetail.congviec?.[0]?.checklist || []).map((item, index) => ({
      id: index + 1,
      label: item,
      done: index < 2,
      status: index < 2 ? "COMPLETED" : "PENDING",
    }))
  );

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Admin System",
      time: "2 hours ago",
      message: `Bản đầu tiên của dự án "${sampleWorkDetail.title}" đã được tạo và đang được kiểm tra bởi đội thiết kế UI.`,
      replies: [] as Array<{ id: number; author: string; time: string; message: string }>,
    },
  ]);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const [history, setHistory] = useState([
    { id: 1, title: "Task created", detail: `Tạo công việc: ${sampleWorkDetail.title}`, time: "Today 09:20" },
    { id: 2, title: "Checklist updated", detail: "Đã hoàn thành bước lên wireframe và thiết kế form", time: "Today 10:10" },
    { id: 3, title: "Assignee changed", detail: "Owner assigned to Nguyễn Văn A", time: "Today 11:05" },
  ]);

  const [attachments, setAttachments] = useState([
    { id: 1, name: `${sampleWorkDetail.title}.pdf`, meta: "2.4 MB • Today 09:41 AM" },
    { id: 2, name: "Wireframe_Design.fig", meta: "1.3 MB • Yesterday" },
  ]);

  const workflow =
    sampleWorkDetail.congviec?.map((item: any, index: number) => ({
      id: index + 1,
      label: `Giai đoạn ${index + 1}: ${item.name || "Công việc"}`,
      owner: item.assignees?.[0]?.name || "Nguyễn Văn A",
      status: index === 0 ? "COMPLETED" : index === 1 ? "IN PROGRESS" : "PENDING",
    })) ?? [];

  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercent = checklist.length ? (completedCount / checklist.length) * 100 : 0;

  const toggleChecklist = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const isDone = !item.done;
        return {
          ...item,
          done: isDone,
          status: isDone ? "COMPLETED" : "PENDING",
        };
      })
    );
  };

  const addChecklistItem = () => {
    if (!newChecklist.trim()) return;
    setChecklist((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: newChecklist.trim(),
        done: false,
        status: "PENDING",
      },
    ]);
    setNewChecklist("");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: Date.now(),
        author: "Huyen Phan",
        time: "Just now",
        message: commentText.trim(),
        replies: [],
      },
      ...prev,
    ]);
    setCommentText("");
  };

  const handleAddReply = (commentId: number) => {
    const value = (replyText[commentId] || "").trim();
    if (!value) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: Date.now(),
                  author: "Huyen Phan",
                  time: "Just now",
                  message: value,
                },
              ],
            }
          : comment
      )
    );
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
  };

  const removeChecklistItem = (id: number) => {
    setChecklist((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length ? next : [];
    });
  };

  const removeComment = (commentId: number) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
  };

  const removeReply = (commentId: number, replyId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: (comment.replies || []).filter((reply) => reply.id !== replyId),
            }
          : comment
      )
    );
  };

  const removeAttachment = (attachmentId: number) => {
    setAttachments((prev) => prev.filter((file) => file.id !== attachmentId));
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length) return;

    const uploaded = Array.from(files).map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      meta: `${(file.size / 1024 / 1024).toFixed(1)} MB • Just now`,
    }));

    setAttachments((prev) => [...uploaded, ...prev]);
    event.target.value = "";
  };

  const updateFileList = (workIndex: number, fileIndex: number, field: string, value: any) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, workPos: number) => {
        if (workPos !== workIndex) return work;
        const nextFileList = (work.fileList || [createEmptyFileItem()]).map((fileItem: any, idx: number) =>
          idx === fileIndex ? { ...fileItem, [field]: value } : fileItem
        );
        return { ...work, fileList: nextFileList };
      }),
    }));
  };

  const addFileListItem = (workIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, workPos: number) =>
        workPos === workIndex ? { ...work, fileList: [...(work.fileList || []), createEmptyFileItem()] } : work
      ),
    }));
  };

  const removeFileListItem = (workIndex: number, fileIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, workPos: number) => {
        if (workPos !== workIndex) return work;
        const nextFileList = (work.fileList || []).filter((_: any, idx: number) => idx !== fileIndex);
        return { ...work, fileList: nextFileList.length ? nextFileList : [createEmptyFileItem()] };
      }),
    }));
  };

  const uploadWorkFile = async (workIndex: number, fileIndex: number, file: File) => {
    try {
      updateFileList(workIndex, fileIndex, "fileName", file.name);
      updateFileList(workIndex, fileIndex, "externalLink", 'https://example.com/' + encodeURIComponent(file.name));
      addFileListItem(workIndex);
    } catch (error) {
      dispatch(showToast({ ...listToast[2], detail: "Tải file thất bại" }));
    }
  };

  useEffect(() => {
    if (id) {
    }
  }, [id]);

  return (
    <div>
      <div className="surface-card border-round-xl border-1 border-200 p-3 p-md-4 shadow-1">
        <div className="flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="text-3xl font-bold text-900">{sampleWorkDetail.title}</div>
          <div className="flex align-items-center gap-2">
            <span className="px-2 py-1 border-round-md text-xs font-medium bg-blue-50 text-blue-700 border-1 border-blue-200">{sampleWorkDetail.congviec?.[0]?.status || "IN PROGRESS"}</span>
            <button className="p-button p-button-sm p-button-outlined">Edit</button>
            <button
              className="p-button p-button-sm p-button-outlined p-button-secondary"
              onClick={() => navigate("/work/list")}
            >
              Trở về
            </button>
          </div>
        </div>

        <div className="grid">
          <div className="col-12 lg:col-8">
            <div className="flex flex-column gap-3">
              <section className="surface-50 border-round-xl border-1 border-200 p-3">
                <div className="text-lg font-semibold mb-3">Mô tả</div>
                <div className="surface-card border-round-lg border-1 border-200 p-3 text-700 line-height-3">
                  <p className="mt-0 mb-3">{sampleWorkDetail.title} cho khách hàng {sampleWorkDetail.customerName}. Nhiệm vụ hiện đang được thực hiện theo checklist đã chia nhỏ để dễ kiểm soát tiến độ và review.</p>
                  <p className="mt-0 mb-2">Các bước chính:</p>
                  <ul className="mt-0 mb-0 pl-4">
                    {(sampleWorkDetail.congviec?.[0]?.checklist || []).map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <div className="text-400 text-xs font-semibold mb-2">Người phụ trách</div>
                    <div className="flex flex-column gap-2">
                      {(sampleWorkDetail.congviec?.[0]?.assignees || []).map((assignee: any, index: number) => (
                        <div key={`${assignee?.name || "assignee"}-${index}`} className="flex align-items-center gap-2">
                          <div className="w-2rem h-2rem border-circle bg-blue-100 text-blue-700 flex align-items-center justify-content-center font-bold text-xs">
                            {(assignee?.name || "A").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-semibold">{assignee?.name || "Nguyễn Văn A"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-12 md:col-6">
                    <div className="flex flex-column gap-3">
                      <div>
                        <div className="text-400 text-xs font-semibold mb-2">Người tạo</div>
                        <div className="flex align-items-center gap-2">
                          <div className="w-2rem h-2rem border-circle bg-yellow-100 text-yellow-700 flex align-items-center justify-content-center font-bold text-xs">AD</div>
                          <span className="font-semibold">Admin System</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-400 text-xs font-semibold mb-2">Dự án</div>
                        <div className="font-semibold">{sampleWorkDetail.customerName}</div>
                      </div>

                      <div>
                        <div className="text-400 text-xs font-semibold mb-2">Hạn hoàn thành</div>
                        <div className="font-semibold">{sampleWorkDetail.congviec?.[0]?.hanHoanThanh || "2026-09-10"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="text-xl font-bold mb-3">Quy trình công việc</div>
                <div className="flex flex-column gap-3">
                  {workflow.map((step, index) => (
                    <div key={step.id} className="flex align-items-center gap-3">
                      <div className="flex flex-column align-items-center" style={{ width: "22px" }}>
                        <div
                          className="border-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            background:
                              step.status === "COMPLETED"
                                ? "#22c55e"
                                : step.status === "IN PROGRESS"
                                  ? "#3b82f6"
                                  : "#d1d5db",
                            boxShadow: "0 0 0 3px #fff, 0 0 0 4px #e5e7eb",
                          }}
                        />
                        {index < workflow.length - 1 && <div className="mt-2" style={{ width: "2px", height: "26px", background: "#d1d5db" }} />}
                      </div>

                      <div
                        className="flex-1 flex justify-content-between align-items-center gap-3 px-3 py-2 border-1 border-round-lg"
                        style={{
                          background: step.status === "COMPLETED" ? "#f0fdf4" : step.status === "IN PROGRESS" ? "#eff6ff" : "#f8fafc",
                          borderColor: "#e5e7eb",
                        }}
                      >
                        <div>
                          <div className="font-bold text-900">{step.label}</div>
                          <div className="text-500 text-xs">Người xử lý: {step.owner}</div>
                        </div>
                        <span
                          className="px-2 py-1 border-round-xl text-xs font-bold"
                          style={{
                            background: step.status === "COMPLETED" ? "#dcfce7" : step.status === "IN PROGRESS" ? "#dbeafe" : "#f3f4f6",
                            color: step.status === "COMPLETED" ? "#166534" : step.status === "IN PROGRESS" ? "#1d4ed8" : "#4b5563",
                          }}
                        >
                          {step.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="flex align-items-center gap-3 border-bottom-1 border-200 pb-2 mb-3">
                  {[
                    { key: "comments", label: "Bình luận" },
                    { key: "history", label: "Lịch sử" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className="p-2 border-none bg-transparent text-sm font-semibold"
                      style={{
                        borderBottom:
                          activeTab === tab.key ? "2px solid #22c55e" : "2px solid transparent",
                        color: activeTab === tab.key ? "#111827" : "#6b7280",
                      }}
                      onClick={() => setActiveTab(tab.key as "comments" | "history")}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "comments" ? (
                  <>
                    <div className="flex align-items-center gap-2 mb-3">
                      <div className="w-2rem h-2rem border-circle bg-blue-100 text-blue-700 flex align-items-center justify-content-center font-bold text-xs">HP</div>
                      <input
                        className="flex-1 p-inputtext"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Viết bình luận..."
                      />
                      <button className="p-button p-button-sm p-button-primary" onClick={handleAddComment}>Save</button>
                    </div>

                    <div className="flex flex-column gap-2">
                      {comments.map((comment) => (
                        <div key={comment.id} className="surface-50 border-1 border-200 border-round-lg p-3">
                          <div className="flex gap-2">
                            <div className="w-2rem h-2rem flex-shrink-0 border-circle bg-blue-100 text-blue-700 flex align-items-center justify-content-center font-bold text-xs">
                              {comment.author.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex align-items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.author}</span>
                                <span className="text-500 text-xs">{comment.time}</span>
                              </div>
                              <div className="text-700 line-height-3">{comment.message}</div>
                            </div>
                            <button
                              type="button"
                              className="p-button p-button-icon p-button-text p-button-danger p-button-sm"
                              onClick={() => removeComment(comment.id)}
                              aria-label="Xóa bình luận"
                              title="Xóa bình luận"
                            >
                              <i className="pi pi-trash" />
                            </button>
                          </div>

                          {(comment.replies || []).length > 0 && (
                            <div className="mt-3 ml-5 flex flex-column gap-2">
                              {(comment.replies || []).map((reply) => (
                                <div key={reply.id} className="flex gap-2 p-2 border-1 border-200 border-round-md bg-white">
                                  <div className="w-2rem h-2rem flex-shrink-0 border-circle bg-green-100 text-green-700 flex align-items-center justify-content-center font-bold text-xs">
                                    {reply.author.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex align-items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">{reply.author}</span>
                                      <span className="text-500 text-xs">{reply.time}</span>
                                    </div>
                                    <div className="text-700 text-sm line-height-3">{reply.message}</div>
                                  </div>
                                  <button
                                    type="button"
                                    className="p-button p-button-icon p-button-text p-button-danger p-button-sm"
                                    onClick={() => removeReply(comment.id, reply.id)}
                                    aria-label="Xóa phản hồi"
                                    title="Xóa phản hồi"
                                  >
                                    <i className="pi pi-trash" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 ml-5 flex align-items-center gap-2">
                            <input
                              className="flex-1 p-inputtext p-inputtext-sm"
                              value={replyText[comment.id] || ""}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment.id]: e.target.value,
                                }))
                              }
                              placeholder="Trả lời bình luận..."
                            />
                            <button
                              type="button"
                              className="p-button p-button-sm p-button-primary"
                              onClick={() => handleAddReply(comment.id)}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-column gap-2">
                    {history.map((item) => (
                      <div key={item.id} className="flex gap-2 surface-50 border-1 border-200 border-round-lg p-3">
                        <div className="w-2rem h-2rem border-circle bg-green-100 text-green-700 flex align-items-center justify-content-center font-bold text-xs">✓</div>
                        <div>
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-500 text-sm">{item.detail}</div>
                          <div className="text-400 text-xs mt-1">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>

          <div className="col-12 lg:col-4">
            <div className="flex flex-column gap-3">
              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="flex justify-content-between align-items-center mb-3">
                  <div className="font-bold">Checklist</div>
                  <div className="text-500 text-xs">{completedCount}/{checklist.length}</div>
                </div>

                <div className="w-full h-2rem border-round-xl bg-gray-200 overflow-hidden mb-3">
                  <div
                    className="h-full border-round-xl"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    }}
                  />
                </div>

                <div className="flex flex-column gap-2">
                  {checklist.map((item) => (
                    <div key={item.id} className="flex align-items-center gap-2">
                      <label
                        className="flex align-items-center gap-2 p-2 border-1 border-round-lg flex-1"
                        style={{
                          background: item.done ? "#f0fdf4" : "#fff",
                          borderColor: "#e5e7eb",
                        }}
                      >
                        <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(item.id)} style={{ accentColor: "#22c55e" }} />
                        <span className="flex-1" style={{ textDecoration: item.done ? "line-through" : "none", color: item.done ? "#166534" : "#374151" }}>
                          {item.label}
                        </span>
                        {item.done ? (
                          <span className="px-2 py-1 border-round-xl text-xs font-bold bg-green-100 text-green-700">COMPLETED</span>
                        ) : (
                          <span className="px-2 py-1 border-round-xl text-xs font-bold bg-blue-100 text-blue-700">PENDING</span>
                        )}
                      </label>
                      <button
                        type="button"
                        className="p-button p-button-icon p-button-text p-button-danger p-button-sm"
                        onClick={() => removeChecklistItem(item.id)}
                        aria-label="Xóa checklist"
                        title="Xóa checklist"
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <input
                    className="flex-1 p-inputtext"
                    value={newChecklist}
                    onChange={(e) => setNewChecklist(e.target.value)}
                    placeholder="Thêm checklist mới"
                  />
                  <button className="p-button p-button-sm p-button-success" onClick={addChecklistItem}>Add</button>
                </div>
              </section>

              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="flex justify-content-between align-items-center mb-3">
                  <div className="font-bold">Tệp đính kèm</div>
                  <button className="p-button p-button-text p-button-sm" onClick={() => fileInputRef.current?.click()}>+</button>
                </div>

                <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileUpload} />

                <div className="flex flex-column gap-2">
                  {attachments.map((file) => (
                    <div key={file.id} className="flex align-items-center gap-2 surface-50 border-1 border-200 border-round-lg p-2">
                      <div className="w-2rem h-2rem border-round-md bg-gray-200 flex align-items-center justify-content-center">📄</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm white-space-nowrap overflow-hidden text-overflow-ellipsis">{file.name}</div>
                        <div className="text-500 text-xs">{file.meta}</div>
                      </div>
                      <button
                        type="button"
                        className="p-button p-button-icon p-button-text p-button-danger p-button-sm"
                        onClick={() => removeAttachment(file.id)}
                        aria-label="Xóa file"
                        title="Xóa file"
                      >
                        <i className="pi pi-trash" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-3 border-1 border-dashed border-300 border-round-lg text-center p-3 text-500 bg-gray-50">
                  Kéo tệp vào đây hoặc nhấn để tải lên
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
