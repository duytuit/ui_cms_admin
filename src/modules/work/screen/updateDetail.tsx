
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { CategoryEnum } from "utils/type.enum";
import { uploadFile } from "lib/request";
import {
  addWorkComment,
  addWorkDetail,
  ChangeStatusWorkDetail,
  deleteWorkComment,
  deleteWorkDetail,
  updateWork,
  showWork,
  updateAttachment,
} from "../api";
import { useListEmployeeWithState } from "modules/employee/service";

const parseJson = <T,>(value: T | string | null | undefined, fallback: T): T => {
  if (typeof value !== "string") return value ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleString("vi-VN") : "Chưa cập nhật";

const getWorkStatus = (status: number | undefined) => {
  if (status === 1) return "COMPLETED";
  if (status === 2) return "IN PROGRESS";
  return "PENDING";
};


const getEmployeeName = (employee: any) => {
  const fullName = [employee?.first_name, employee?.last_name].filter(Boolean).join(" ");
  return fullName || employee?.name || employee?.code || (employee?.id != null ? `ID ${employee.id}` : "");
};

type ChecklistItem = { id: number; label: string; done: boolean; status: string };
type ReplyItem = { id: number; author: string; authorId?: number | string; time: string; message: string };
type CommentItem = { id: number; author: string; authorId?: number | string; time: string; message: string; replies: ReplyItem[] };
type HistoryItem = { id: number; title: string; detail: string; time: string };
type AttachmentItem = { id: number; name: string; meta: string; externalLink?: string };

const mapChecklist = (work: any): ChecklistItem[] =>
  (work?.workDetails || []).map((item: any) => ({
    id: item.id,
    label: item.name,
    done: Boolean(item.checked),
    status: item.checked ? "COMPLETED" : "PENDING",
  }));

export default function UpdateDetailWork() {
  const employeeInfo = localStorage.getItem('employeeInfo') ? JSON.parse(localStorage.getItem('employeeInfo') || '{}') : null;
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [workData, setWorkData] = useState<any>(null);
  const [activeWork, setActiveWork] = useState<any>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"comments" | "history">("comments");
  const [newChecklist, setNewChecklist] = useState("");
  const [commentText, setCommentText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: employees } = useListEmployeeWithState({});
  const employeeById = (Array.isArray(employees) ? employees : []).reduce(
    (result: Record<string, any>, employee: any) => {
      if (employee?.id != null) result[String(employee.id)] = employee;
      if (employee?.user_id != null) result[String(employee.user_id)] = employee;
      return result;
    },
  {});
  const employeeNameById = (employeeId: number | string | null | undefined) =>
    employeeId == null
      ? "Chưa xác định"
      : employeeById[String(employeeId)]
        ? getEmployeeName(employeeById[String(employeeId)])
        : `ID ${employeeId}`;
  const currentEmployeeId = employeeInfo?.id ?? employeeInfo?.user_id;
  const currentEmployeeName = currentEmployeeId != null
    ? employeeNameById(currentEmployeeId)
    : getEmployeeName(employeeInfo) || "Người dùng hiện tại";
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  const childWorkId = searchParams.get("childId") || searchParams.get("childWorkId");
  const routeWork =
    (childWorkId && workData?.childWorks?.find((work: any) => String(work.id) === childWorkId)) || workData || null;
  const selectedWork = activeWork || routeWork;
  const selectedWorkName = selectedWork?.name || "Chi tiết công việc";
  const selectedWorkStatus = getWorkStatus(selectedWork?.status);
  const selectedWorkDetails =
    selectedWork?.workDetails?.length || childWorkId
      ? selectedWork?.workDetails || []
      : (workData?.childWorks || []).flatMap((work: any) => work.workDetails || []);
  const selectedAssignees = parseJson<number[]>(selectedWork?.assigneeIds, []).map((assigneeId) => ({
    id: assigneeId,
    name: employeeNameById(assigneeId),
  }));

  const workflow: Array<{ id: number; label: string; owner: string; status: string; work: any }> =
    (workData?.childWorks || []).map((item: any, index: number) => ({
      id: item.id,
      label: `Giai đoạn ${index + 1}: ${item.name || "Công việc"}`,
      owner: parseJson<number[]>(item.assigneeIds, [])
        .map((assigneeId) => employeeNameById(assigneeId))
        .join(", ") || "Chưa phân công",
      status: getWorkStatus(item.status),
      work: item,
    })) ?? [];

  const selectWork = (work: any) => {
    setActiveWork(work);
    setChecklist(mapChecklist(work));
  };

  const updateSelectedWorkDetails = (details: any[]) => {
    setChecklist(mapChecklist({ workDetails: details }));
    setActiveWork((prev: any) => (prev ? { ...prev, workDetails: details } : prev));
    setWorkData((prev: any) => {
      if (!prev) return prev;
      if (!childWorkId) return { ...prev, workDetails: details };
      return {
        ...prev,
        childWorks: (prev.childWorks || []).map((work: any) =>
          String(work.id) === childWorkId ? { ...work, workDetails: details } : work
        ),
      };
    });
  };

  const completedCount = checklist.filter((item) => item.done).length;
  const progressPercent = checklist.length ? (completedCount / checklist.length) * 100 : 0;

  const toggleChecklist = async (item: ChecklistItem) => {
    const checked = !item.done;
    try {
      await ChangeStatusWorkDetail({
        id: item.id,
        checked,
        status: checked ? 1 : 0,
      });
      const details = (selectedWork?.workDetails || []).map((detail: any) =>
        detail.id === item.id ? { ...detail, checked } : detail
      );
      updateSelectedWorkDetails(details);
    } catch {
      return;
    }
  };

  const addChecklistItem = async () => {
    if (!newChecklist.trim()) return;
    try {
      const name = newChecklist.trim();
      const response = await addWorkDetail({
        workId: selectedWork?.id || id,
        name,
        description: null,
        storageId: selectedWork?.storageId || workData?.storageId,
        checked: false,
      });
      const createdDetail = response?.data?.data || {};
      const details = [
        ...(selectedWork?.workDetails || []),
        {
          ...createdDetail,
          id: createdDetail.id || Date.now(),
          name: createdDetail.name || name,
          checked: Boolean(createdDetail.checked),
        },
      ];
      updateSelectedWorkDetails(details);
      setNewChecklist("");
    } catch {
      return;
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const content = commentText.trim();
      const response = await addWorkComment({
        type: 0,
        model: "work",
        modelId: Number(id),
        parentId: null,
        storageId: workData?.storageId,
        content,
      });
      const createdComment = response?.data?.data || {};

      setComments((prev) => [
        {
          id: createdComment.id || Date.now(),
          author: currentEmployeeName,
          authorId: currentEmployeeId,
          time: formatDate(createdComment.createdAt) === "Chưa cập nhật" ? "Vừa xong" : formatDate(createdComment.createdAt),
          message: createdComment.content || content,
          replies: [],
        },
        ...prev,
      ]);
      setCommentText("");
    } catch {
      return;
    }
  };

  const handleAddReply = async (commentId: number) => {
    const value = (replyText[commentId] || "").trim();
    if (!value) return;

    try {
      const response = await addWorkComment({
        type: 0,
        model: "work",
        modelId: Number(id),
        parentId: commentId,
        storageId: workData?.storageId,
        content: value,
      });
      const createdReply = response?.data?.data || {};

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...(comment.replies || []),
                  {
                    id: createdReply.id || Date.now(),
                    author: currentEmployeeName,
                    authorId: currentEmployeeId,
                    time: formatDate(createdReply.createdAt) === "Chưa cập nhật" ? "Vừa xong" : formatDate(createdReply.createdAt),
                    message: createdReply.content || value,
                  },
                ],
              }
            : comment
        )
      );
      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    } catch {
      return;
    }
  };

  const removeChecklistItem = async (detailId: number) => {
    try {
      await deleteWorkDetail({ id: detailId });
      updateSelectedWorkDetails((selectedWork?.workDetails || []).filter((item: any) => item.id !== detailId));
    } catch {
      return;
    }
  };

  const removeComment = async (commentId: number) => {
    try {
      await deleteWorkComment({ id: commentId });
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch {
      return;
    }
  };

  const removeReply = async (commentId: number, replyId: number) => {
    try {
      await deleteWorkComment({ id: replyId });
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
    } catch {
      return;
    }
  };

  const removeAttachment = (attachmentId: number) => {
    const nextAttachments = attachments.filter((file) => file.id !== attachmentId);
    updateAttachments(nextAttachments);
  };

  const updateAttachments = async (nextAttachments: AttachmentItem[]) => {
    if (!workData?.id) return;
    try {
      await updateAttachment({
        id: workData.id,
        attachments: 
          nextAttachments.map((file) => ({
            FileName: file.name,
            ExternalLink: file.externalLink || file.meta || "",
          }))
      });
      setAttachments(nextAttachments);
      setActiveWork((prev: any) => (prev ? { ...prev, attachments: JSON.stringify(nextAttachments) } : prev));
    } catch {
      return;
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files.length) return;

    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const response = await uploadFile("upload/single", { files: file });
          const uploaded = response?.data || {};
          const externalLink = uploaded.fullPath || uploaded.url || uploaded.path || uploaded.filePath || "";
          return {
            id: Date.now() + file.lastModified,
            name: uploaded.fileName || file.name,
            meta: `${(file.size / 1024 / 1024).toFixed(1)} MB • Vừa tải lên`,
            externalLink,
          };
        })
      );
      await updateAttachments([...uploadedFiles, ...attachments]);
    } catch {
      return;
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      showWork({ id, type: CategoryEnum.country })
        .then((res) => {
          const detail = res.data.data;
          if (!detail) return;

          setWorkData(detail);
          const selected =
            (childWorkId && detail.childWorks?.find((work: any) => String(work.id) === childWorkId)) || detail;
          setActiveWork(selected);

          setChecklist(mapChecklist(selected));

          const apiComments = detail.comments || [];
          setComments(
            apiComments
              .filter((comment: any) => !comment.parentId)
              .map((comment: any) => ({
                id: comment.id,
                author: `ID ${comment.createdBy}`,
                authorId: comment.createdBy,
                time: formatDate(comment.createdAt),
                message: comment.content,
                replies: apiComments
                  .filter((reply: any) => reply.parentId === comment.id)
                  .map((reply: any) => ({
                    id: reply.id,
                    author: `ID ${reply.createdBy}`,
                    authorId: reply.createdBy,
                    time: formatDate(reply.createdAt),
                    message: reply.content,
                  })),
              }))
          );
          setHistory(
            (detail.histories || []).map((item: any) => ({
              id: item.id,
              title: item.content,
              detail: item.action ? `Thao tác #${item.action}` : "",
              time: formatDate(item.createdAt),
            }))
          );
          const apiAttachments = parseJson<Array<{ FileName?: string; ExternalLink?: string }>>(detail.attachments, []);
          setAttachments(
            apiAttachments
              .filter((file) => file.FileName || file.ExternalLink)
              .map((file, index) => ({
                id: index + 1,
                name: file.FileName || file.ExternalLink || "Tệp đính kèm",
                meta: file.ExternalLink || "",
                externalLink: file.ExternalLink || "",
              }))
          );
        })
        .catch(() => undefined)
        .finally(() => setLoading(false));
    }
  }, [id, childWorkId]);

  return (
    <div>
      <div className="surface-card border-round-xl border-1 border-200 p-3 p-md-4 shadow-1">
        <div className="flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="text-3xl font-bold text-900">{loading ? "Đang tải..." : selectedWorkName}</div>
          <div className="flex align-items-center gap-2">
            <span className="px-2 py-1 border-round-md text-xs font-medium bg-blue-50 text-blue-700 border-1 border-blue-200">{selectedWorkStatus}</span>
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
                  <p className="mt-0 mb-3">{selectedWork?.description || "Chưa có mô tả cho công việc này."}</p>
                  <p className="mt-0 mb-2">Các bước chính:</p>
                  <ul className="mt-0 mb-0 pl-4">
                    {selectedWorkDetails.map((item: any) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="surface-card border-round-xl border-1 border-200 p-3">
                <div className="grid">
                  <div className="col-12 md:col-6">
                    <div className="text-400 text-xs font-semibold mb-2">Người phụ trách</div>
                    <div className="flex flex-column gap-2">
                      {selectedAssignees.map((assignee: any, index: number) => (
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
                        <div className="font-semibold">{workData?.name}</div>
                      </div>

                      <div>
                        <div className="text-400 text-xs font-semibold mb-2">Hạn hoàn thành</div>
                        <div className="font-semibold">{formatDate(selectedWork?.dueDate)}</div>
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
                        role="button"
                        tabIndex={0}
                        onClick={() => selectWork(step.work)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") selectWork(step.work);
                        }}
                        className="flex-1 flex justify-content-between align-items-center gap-3 px-3 py-2 border-1 border-round-lg"
                        style={{
                          background: step.status === "COMPLETED" ? "#f0fdf4" : step.status === "IN PROGRESS" ? "#eff6ff" : "#f8fafc",
                          borderColor: "#e5e7eb",
                          cursor: "pointer",
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
                              {(comment.authorId ? employeeNameById(comment.authorId) : comment.author).slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex align-items-center gap-2 mb-1">
                                <span className="font-semibold">{comment.authorId ? employeeNameById(comment.authorId) : comment.author}</span>
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
                                    {(reply.authorId ? employeeNameById(reply.authorId) : reply.author).slice(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex align-items-center gap-2 mb-1">
                                      <span className="font-semibold text-sm">{reply.authorId ? employeeNameById(reply.authorId) : reply.author}</span>
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
                        <input type="checkbox" checked={item.done} onChange={() => toggleChecklist(item)} style={{ accentColor: "#22c55e" }} />
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
                      {file.externalLink && (
                        <a
                          href={file.externalLink}
                          target="_blank"
                          rel="noreferrer"
                          className="p-button p-button-icon p-button-text p-button-sm"
                          aria-label={`Tải ${file.name}`}
                          title="Tải file"
                        >
                          <i className="pi pi-download" />
                        </a>
                      )}
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
