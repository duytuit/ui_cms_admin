
import { AddForm, InputForm, InputTextareaForm } from "components/common/AddForm";
import { MultiSelect } from "components/common/ListForm";
import { DateTimeField } from "components/common/DateTimeField";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { CategoryEnum } from "utils/type.enum";
import { Panel } from "components/uiCore";
import { addWork, showWork, updateWork } from "../api";
import { Helper } from "utils/helper";
import { MyCalendar } from "components/common/MyCalendar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { uploadFile } from "lib/request";

const assigneeOptions = [
  { label: "Nguyễn Văn A", value: 1 },
  { label: "Trần Thị B", value: 2 },
  { label: "Lê Văn C", value: 3 },
  { label: "Phạm Thị D", value: 4 },
  { label: "Hoàng Văn E", value: 5 },
];

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
  laplai: 1,
  thoigianlap: "",
  thoigianketthuclap: "",
  fileList: [createEmptyFileItem()],
  chitiet: [createEmptyDetail()],
});

const createEmptyWorkList = () => ({ congviec: [createEmptyWork()] });

export default function UpdateWork() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>(createEmptyWorkList());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateWorkInfo = (workIndex: number, field: string, value: any) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((item: any, index: number) =>
        index === workIndex ? { ...item, [field]: value } : item
      ),
    }));
  };

  const renderWorkFileList = (workItem: any, workIndex: number) => (
    <div className="surface-100 border-round-xl p-3">
      <div className="flex justify-content-between align-items-center mb-3">
        <span className="font-medium text-900">Tài liệu đính kèm</span>
        <Button
          type="button"
          label="Thêm file"
          icon="pi pi-plus"
          severity="secondary"
          size="small"
          outlined
          onClick={() => addFileListItem(workIndex)}
        />
      </div>

      {(workItem.fileList || [createEmptyFileItem()]).map((fileItem: any, fileIndex: number) => (
        <div key={fileIndex} className="flex align-items-center gap-2 mb-2"> 
          <input
            type="file"
            className="w-full p-2 border-1 border-300 border-round-md bg-white"
            onChange={async (e: any) => {
              const selectedFile = e.target.files?.[0];
              if (!selectedFile) return;
              await uploadWorkFile(workIndex, fileIndex, selectedFile);
              e.target.value = "";
            }}
          />

          {fileItem.externalLink && (
            <>
              <span className="text-sm text-600 max-w-20rem white-space-nowrap overflow-hidden text-overflow-ellipsis">
                {fileItem.fileName || "file"}
              </span>
              <Button
                type="button"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                onClick={() => removeFileListItem(workIndex, fileIndex)}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );

  const addWorkItem = () => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: [...prev.congviec, createEmptyWork()],
    }));
  };

  const removeWorkItem = (workIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.filter((_: any, index: number) => index !== workIndex),
    }));
  };

  const updateDetail = (workIndex: number, detailIndex: number, field: string, value: any) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) => {
        if (idx !== workIndex) return work;
        return {
          ...work,
          chitiet: work.chitiet.map((item: any, index: number) =>
            index === detailIndex ? { ...item, [field]: value } : item
          ),
        };
      }),
    }));
  };

  const addDetail = (workIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) =>
        idx === workIndex ? { ...work, chitiet: [...work.chitiet, createEmptyDetail()] } : work
      ),
    }));
  };

  const removeDetail = (workIndex: number, detailIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) => {
        if (idx !== workIndex) return work;
        return {
          ...work,
          chitiet: work.chitiet.filter((_: any, index: number) => index !== detailIndex),
        };
      }),
    }));
  };

  const updateChecklistItem = (workIndex: number, detailIndex: number, checklistIndex: number, value: string) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) => {
        if (idx !== workIndex) return work;
        return {
          ...work,
          chitiet: work.chitiet.map((item: any, detailPos: number) => {
            if (detailPos !== detailIndex) return item;
            return {
              ...item,
              checklist: item.checklist.map((check: string, checkPos: number) =>
                checkPos === checklistIndex ? value : check
              ),
            };
          }),
        };
      }),
    }));
  };

  const addChecklistItem = (workIndex: number, detailIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) => {
        if (idx !== workIndex) return work;
        return {
          ...work,
          chitiet: work.chitiet.map((item: any, detailPos: number) =>
            detailPos === detailIndex ? { ...item, checklist: [...item.checklist, ""] } : item
          ),
        };
      }),
    }));
  };

  const removeChecklistItem = (workIndex: number, detailIndex: number, checklistIndex: number) => {
    setInfos((prev: any) => ({
      ...prev,
      congviec: prev.congviec.map((work: any, idx: number) => {
        if (idx !== workIndex) return work;
        return {
          ...work,
          chitiet: work.chitiet.map((item: any, detailPos: number) => {
            if (detailPos !== detailIndex) return item;
            const nextChecklist = item.checklist.filter((_: string, idx: number) => idx !== checklistIndex);
            return { ...item, checklist: nextChecklist.length ? nextChecklist : [""] };
          }),
        };
      }),
    }));
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
      const response = await uploadFile("system/upload/create", { files: [file] });
      const uploaded = response?.data?.data?.[0];
      if (!uploaded) return;

      const externalLink = uploaded.externalLink || uploaded.url || "";
      updateFileList(workIndex, fileIndex, "fileName", file.name);
      updateFileList(workIndex, fileIndex, "externalLink", externalLink);
      addFileListItem(workIndex);
    } catch (error) {
      dispatch(showToast({ ...listToast[2], detail: "Tải file thất bại" }));
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const info = { ...infos };
    console.log("jobForm", info);
    setLoading(true);
    fetchDataSubmit(info);
  };

  async function fetchDataSubmit(info: any) {
    if (info.id) {
      const response = await updateWork(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate("/work/list");
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }));
        }
      } else {
        dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
    } else {
      const response = await addWork(info);
      if (response) setLoading(false);
      if (response.status === 200) {
        if (response.data.status) {
          setInfos({ ...refreshObject(infos), status: true });
          dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          navigate("/work/list");
        } else {
          dispatch(showToast({ ...listToast[2], detail: response.data.message }));
        }
      } else {
        dispatch(showToast({ ...listToast[1], detail: response.data.message }));
      }
    }
  }

  useEffect(() => {
    if (id) {
      showWork({ id: id, type: CategoryEnum.country })
        .then((res) => {
          const detail = res.data.data;
          if (detail) {
            const source = Array.isArray(detail.congviec) && detail.congviec.length
              ? detail.congviec
              : detail.tieude
                ? [detail]
                : [createEmptyWork()];

            const mapped = {
              congviec: source.map((item: any) => ({
                ...createEmptyWork(),
                ...item,
                fileList: Array.isArray(item.fileList) && item.fileList.length ? item.fileList : [createEmptyFileItem()],
                chitiet: Array.isArray(item.chitiet) && item.chitiet.length
                  ? item.chitiet.map((child: any) => ({
                      ...createEmptyDetail(),
                      ...child,
                      checklist: Array.isArray(child.checklist) && child.checklist.length ? child.checklist : [""],
                    }))
                  : [createEmptyDetail()],
              })),
            };
            setInfos(mapped);
          }
        })
        .catch(() => {
          setInfos(createEmptyWorkList());
        });
    }
  }, [id]);

  return (
    <>
      <AddForm
        className="w-full"
        style={{ margin: "0 auto" }}
        checkId={infos.id}
        title="công việc"
        loading={loading}
        onSubmit={handleSubmit}
        routeList="/work/list"
        route={Number(id) ? "/work/update" : "/work/create"}
      >
        <div className="field">
          <div className="flex justify-content-end align-items-center mb-3">
            <Button
              type="button"
              label="Thêm công việc"
              icon="pi pi-plus"
              severity="success"
              size="small"
              raised
              onClick={addWorkItem}
            />
          </div>

          {infos.congviec?.map((workItem: any, workIndex: number) => (
            <div
              key={workIndex}
              className="surface-card border-1 border-200 border-round-xl p-3 p-md-4 mb-3 shadow-1"
            >
              <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center gap-2 mb-3">
                <div>
                  <div className="text-xs text-500 uppercase font-medium mb-1">
                    Nhóm công việc
                  </div>
                  <h5 className="m-0">Công việc {workIndex + 1}</h5>
                </div>

                {infos.congviec.length > 1 && (
                  <Button
                    type="button"
                    label="Xóa công việc"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    text
                    onClick={() => removeWorkItem(workIndex)}
                  />
                )}
              </div>
              <div className="grid">
                <div className="col-8">
                  <div className="formgrid grid">
                    <div className="field col-12">
                      <InputForm
                        className="w-full"
                        id={`tieude-${workIndex}`}
                        value={workItem.tieude || ""}
                        onChange={(e: any) =>
                          updateWorkInfo(workIndex, "tieude", e.target.value)
                        }
                        label="Tiêu đề công việc"
                        required
                      />
                    </div>
                    <div className="field col-4">
                      <InputForm
                        className="w-full"
                        id={`laplai-${workIndex}`}
                        value={workItem.laplai ?? 1}
                        onChange={(e: any) =>
                          updateWorkInfo(
                            workIndex,
                            "laplai",
                            Number(e.target.value || 1),
                          )
                        }
                        label="Lặp lại"
                        type="number"
                      />
                    </div>

                    <div className="field col-4">
                      <DateTimeField
                        label="Thời gian lặp"
                        value={workItem.thoigianlap || ""}
                        onChange={(value) =>
                          updateWorkInfo(workIndex, "thoigianlap", value)
                        }
                      />
                    </div>

                    <div className="field col-4">
                      <DateTimeField
                        label="Kết thúc"
                        value={workItem.thoigianketthuclap || ""}
                        onChange={(value) =>
                          updateWorkInfo(workIndex, "thoigianketthuclap", value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="field col-12">
                    {renderWorkFileList(workItem, workIndex)}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0">Chi tiết công việc</h5>
                  <Button
                    type="button"
                    label="Thêm chi tiết"
                    icon="pi pi-plus"
                    severity="success"
                    size="small"
                    raised
                    onClick={() => addDetail(workIndex)}
                  />
                </div>

                <div
                  className="overflow-x-auto pb-2"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <div
                    className="flex gap-3 align-items-stretch"
                    style={{ minWidth: "max-content" }}
                  >
                    {workItem.chitiet?.map(
                      (detail: any, detailIndex: number) => (
                        <div
                          key={detailIndex}
                          className="surface-50 border-round-xl p-3 border-1 border-200"
                          style={{
                            width: "420px",
                            minWidth: "420px",
                            flexShrink: 0,
                          }}
                        >
                          <div className="flex justify-content-between align-items-center mb-3">
                            <div className="font-medium text-900">
                              Chi tiết {detailIndex + 1}
                            </div>
                            {workItem.chitiet.length > 1 && (
                              <Button
                                type="button"
                                label="Xóa chi tiết"
                                icon="pi pi-trash"
                                severity="danger"
                                size="small"
                                text
                                onClick={() =>
                                  removeDetail(workIndex, detailIndex)
                                }
                              />
                            )}
                          </div>

                          <div className="formgrid grid gap-3">
                            <div className="field col-12 mb-0">
                              <InputForm
                                className="w-full"
                                id={`tencongviec-${workIndex}-${detailIndex}`}
                                value={detail.tencongviec || ""}
                                onChange={(e: any) =>
                                  updateDetail(
                                    workIndex,
                                    detailIndex,
                                    "tencongviec",
                                    e.target.value,
                                  )
                                }
                                label="Tên công việc"
                                required
                              />
                            </div>

                            <div className="field col-12 mb-0">
                              <DateTimeField
                                label="Hạn hoàn thành"
                                value={detail.hanhoanthanh || ""}
                                onChange={(value) =>
                                  updateDetail(
                                    workIndex,
                                    detailIndex,
                                    "hanhoanthanh",
                                    value,
                                  )
                                }
                              />
                            </div>

                            <div className="field col-12 mb-0">
                              <InputTextareaForm
                                id={`motacongviec-${workIndex}-${detailIndex}`}
                                value={detail.motacongviec || ""}
                                onChange={(e: any) =>
                                  updateDetail(
                                    workIndex,
                                    detailIndex,
                                    "motacongviec",
                                    e.target.value,
                                  )
                                }
                                label="Mô tả công việc"
                                className="w-full"
                              />
                            </div>

                            <div className="field col-12 mb-0">
                              <label className="block text-900 font-medium mb-2">
                                Người phụ trách
                              </label>
                              <MultiSelect
                                value={detail.nguoiphutrach || []}
                                onChange={(e: any) =>
                                  updateDetail(
                                    workIndex,
                                    detailIndex,
                                    "nguoiphutrach",
                                    e.value,
                                  )
                                }
                                options={assigneeOptions}
                                optionLabel="label"
                                optionValue="value"
                                label="Người phụ trách"
                                className="w-full"
                              />
                            </div>

                            <div className="field col-12 mb-0">
                              <div className="flex justify-content-between align-items-center mb-2">
                                <label className="block text-900 font-medium">
                                  Checklist
                                </label>
                                <Button
                                  type="button"
                                  label="Thêm mục"
                                  icon="pi pi-plus"
                                  severity="secondary"
                                  size="small"
                                  outlined
                                  onClick={() =>
                                    addChecklistItem(workIndex, detailIndex)
                                  }
                                />
                              </div>

                              {(detail.checklist || [""]).map(
                                (item: string, checklistIndex: number) => (
                                  <div
                                    key={checklistIndex}
                                    className="flex align-items-center gap-2 mb-2 w-full"
                                  >
                                    <div style={{ flex: "0 0 90%" }}>
                                      <InputForm
                                        className="w-full"
                                        id={`checklist-${workIndex}-${detailIndex}-${checklistIndex}`}
                                        value={item}
                                        onChange={(e: any) =>
                                          updateChecklistItem(
                                            workIndex,
                                            detailIndex,
                                            checklistIndex,
                                            e.target.value,
                                          )
                                        }
                                        label={`Checklist ${checklistIndex + 1}`}
                                      />
                                    </div>

                                    {detail.checklist.length > 1 && (
                                      <div style={{ flex: "1" }}>
                                        <Button
                                          type="button"
                                          icon="pi pi-trash"
                                          severity="danger"
                                          text
                                          rounded
                                          onClick={() =>
                                            removeChecklistItem(
                                              workIndex,
                                              detailIndex,
                                              checklistIndex,
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AddForm>
    </>
  );
}
