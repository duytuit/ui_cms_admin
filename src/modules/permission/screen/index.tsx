import { useEffect, useMemo, useState } from "react";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListDepartment } from "../service";
import { addDepartment, updateDepartment } from "../api";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { AddForm, InputForm, UpdateForm } from "components/common/AddForm";
import Panel from "components/uiCore/panel/Panel";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
import { listToast, refreshObject } from "utils";
import { Checkbox, Column, DataTable, TreeTable } from "components/uiCore";
import { useNavigate } from "react-router";
import { sidebarModel } from '../../../layout/AppSidebar';
import { ActionBody, DataTableClient, TimeBody } from "components/common/DataTable";
import { classNames } from "primereact/utils";
import { TreeNode } from "primereact/treenode";
export interface PermissionRow {
  name: string;
  permission: string;
  all: boolean;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export const mergePermissionTreeToArray = (
  nodes: TreeNode[]
): PermissionRow[] => {
  const result: PermissionRow[] = [];

  const walk = (list: TreeNode[]) => {
    list.forEach((n) => {
      const d: any = n.data;

      // chỉ lấy node có permission (node cha menu thường permission rỗng)
      if (d?.permission) {
        result.push({
          name: d.name,
          permission: d.permission,
          all: !!d.all,
          view: !!d.view,
          add: !!d.add,
          edit: !!d.edit,
          delete: !!d.delete,
        });
      }

      if (n.children?.length) walk(n.children);
    });
  };

  walk(nodes);

  return result;
};
export const buildPermissionTree = (sidebarModel: any[]): TreeNode[] => {
  const walk = (items: any[], parentKey = "0"): TreeNode[] => {
    return items.map((x, index) => {
      const key = `${parentKey}-${index}`;

      const permissionKey = x.name
        ? x.name
            .trim()
            .toLowerCase()
            .normalize("NFD") // tách dấu
            .replace(/[\u0300-\u036f]/g, "") // xoá dấu
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "_") // ký tự đặc biệt => _
            .replace(/^_+|_+$/g, "") // xoá _ đầu/cuối
        : "";

      const node: TreeNode = {
        key,
        data: {
          name: x.name,
          permission: permissionKey,
          all: false,
          view: false,
          add: false,
          edit: false,
          delete: false,
        } as PermissionRow,
      };

      if (x.items?.length) {
        node.children = walk(x.items, key);
      }

      return node;
    });
  };

  // sidebarModel có dạng [{items:[...]}]
  return sidebarModel.flatMap((g, idx) => walk(g.items, `${idx}`));
};

export default function ListPermission() {
     const [loading, setLoading] = useState(false);
        const [infos, setInfos] = useState<any>({});
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const handleSubmit = (e:any) => {
            e.preventDefault();
            let info = {
              ...infos, status: infos.status ? 0 : 1,
          };
          console.log('info',info);
          
        //   setLoading(true);
        //   fetchDataSubmit(info);
        };
         async function fetchDataSubmit(info:any) {
          if (info.id) {
              const response = await updateDepartment(info);
              if (response) setLoading(false);
              if (response.status === 200) {
                  if(response.data.status){
                    dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                    navigate('/department/list');
                  }else{
                    dispatch(showToast({ ...listToast[2], detail: response.data.message }))
                  }
              } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
          } else {
              const response = await addDepartment(info);
              if (response) setLoading(false);
              if (response.status === 200) {
                  if(response.data.status){
                    setInfos({ ...refreshObject(infos), status: true })
                    dispatch(showToast({ ...listToast[0], detail: response.data.message }));
                    navigate('/department/list');
                  }else{
                    dispatch(showToast({ ...listToast[2], detail: response.data.message }))
                  }
              } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
          }
      };
    const initialTree  = useMemo(
    () => buildPermissionTree(sidebarModel),
    [sidebarModel]
  );

  const [nodes, setNodes] = useState<TreeNode[]>(initialTree);

  // update node theo key
  const updateNodeByKey = (
    list: TreeNode[],
    key: string,
    updater: (node: TreeNode) => TreeNode
  ): TreeNode[] => {
    return list.map((n) => {
      if (n.key === key) return updater(n);

      if (n.children?.length) {
        return {
          ...n,
          children: updateNodeByKey(n.children, key, updater),
        };
      }

      return n;
    });
  };

  const setChildrenChecked = (node: TreeNode, checked: boolean): TreeNode => {
    const data = node.data as PermissionRow;

    const newNode: TreeNode = {
      ...node,
      data: {
        ...data,
        all: checked,
        view: checked,
        add: checked,
        edit: checked,
        delete: checked,
      },
    };

    if (node.children?.length) {
      newNode.children = node.children.map((c) =>
        setChildrenChecked(c, checked)
      );
    }

    return newNode;
  };

  const onChangeAll = (key: string, checked: boolean) => {
    setNodes((prev) =>
      updateNodeByKey(prev, key, (node) => setChildrenChecked(node, checked))
    );
  };

  const onChangeSingle = (
    key: string,
    field: "view" | "add" | "edit" | "delete",
    checked: boolean
  ) => {
    setNodes((prev) =>
      updateNodeByKey(prev, key, (node) => {
        const data = node.data as PermissionRow;

        const newData = { ...data, [field]: checked };

        const allChecked =
          newData.view && newData.add && newData.edit && newData.delete;

        newData.all = allChecked;

        return { ...node, data: newData };
      })
    );
  };

  const checkboxBody =
    (field: keyof PermissionRow) => (node: any) => {
      const data = node.data as PermissionRow;

      return (
        <Checkbox
          checked={data[field] as boolean}
          onChange={(e: any) => {
            if (field === "all") onChangeAll(node.key!, e.checked);
            else
              onChangeSingle(
                node.key!,
                field as "view" | "add" | "edit" | "delete",
                e.checked
              );
          }}
        />
      );
    };
    async function Capnhat() {
        const payload = mergePermissionTreeToArray(nodes);

       console.log(payload); // đúng format mảng để lưu db
        
    };
    return (
        <div className="card">
            <UpdateForm
                className="w-full"
                style={{ margin: "0 auto" }}
                checkId={infos.id}
                title="quyền"
                loading={loading}
                onSubmit={handleSubmit}
                Accept={{Name:"Cập nhật", Action: () => Capnhat()}}
            >
                <div className="field">
                    <Panel header="Thông tin">
                        <div className="grid">
                            <div className="col-12">
                                <div className="formgrid grid">
                                    <div className="field col-6">
                                        <InputForm className="w-full"
                                            id="note"
                                            value={infos.note}
                                            onChange={(e: any) =>
                                                setInfos({ ...infos, note: e.target.value })
                                            }
                                            label="Nhóm quyền"
                                            required
                                        />
                                    </div>
                                    <div className="field col-6">
                                        <InputForm className="w-full"
                                            id="note"
                                            value={infos.note}
                                            onChange={(e: any) =>
                                                setInfos({ ...infos, note: e.target.value })
                                            }
                                            label="Mô tả"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            </UpdateForm>
            <div style={{ height: 'calc(100vh - 8rem)' }}>
                <Splitter style={{ height: '100%', width: '100%' }}>
                    {/* Panel 1 */}
                    <SplitterPanel
                        size={70}
                        minSize={10}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <b>Danh sách quyền</b>
                             <TreeTable value={nodes}  
                                scrollable
                                scrollHeight="100%"
                                style={{ height: "100%" }}
                                >
                                <Column field="name" header="Tên quyền" expander />
                                <Column field="permission" header="Quyền" />
                                <Column header="All" body={checkboxBody("all")} style={{ width: 80 }} />
                                <Column header="Xem" body={checkboxBody("view")} style={{ width: 80 }} />
                                <Column header="Thêm" body={checkboxBody("add")} style={{ width: 80 }} />
                                <Column header="Sửa" body={checkboxBody("edit")} style={{ width: 80 }} />
                                <Column header="Xóa" body={checkboxBody("delete")} style={{ width: 80 }} />
                                </TreeTable>
                        </div>
                    </SplitterPanel>

                    {/* Panel 2 */}
                    <SplitterPanel
                        size={30}
                        minSize={20}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <b>Danh sách nhóm quyền</b>
                            <DataTableClient
                                rowHover
                                value={[]}
                                loading={loading}
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                            >
                                <Column field="name" header="Tên nhóm quyền"/>
                                <Column field="note" header="Ghi chú" />
                                <Column field="updated_by" header="Người cập nhật" />
                                {/* <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} /> */}
                                <Column
                                    header="Thao tác"
                                    body={(row: any) => {
                                        return ActionBody(
                                            row,
                                            "/department/detail",
                                            null
                                        );
                                    }}
                                />
                            </DataTableClient>
                        </div>
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}