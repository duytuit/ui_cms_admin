import { useEffect, useMemo, useState } from "react";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { InputForm, UpdateForm } from "components/common/AddForm";
import Panel from "components/uiCore/panel/Panel";
import { Checkbox, Column, TreeTable } from "components/uiCore";
import { sidebarModel } from '../../../layout/AppSidebar';
import { ActionBody, DataTableClient } from "components/common/DataTable";
import { classNames } from "primereact/utils";
import { TreeNode } from "primereact/treenode";
import { addOrUpdate, delRole, showRole } from "../api";
import { useListRole } from "../service";
import { listToast, refreshObject } from "utils";
import { useDispatch } from "react-redux";
import { showToast } from "redux/features/toast";
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
const applyPermissionsToTree = (
  tree: TreeNode[],
  rolePermissions: any[]
): TreeNode[] => {
  // Tạo map nhanh: permissionName -> permission object
  const map = new Map<string, any>();
  (rolePermissions || []).forEach((rp: any) => {
    map.set(rp.permissionName, rp);
  });

  const walk = (nodes: TreeNode[]): TreeNode[] => {
    return nodes.map((node) => {
      const data = node.data as PermissionRow;

      // permission key trong tree (ví dụ: data.permission = "ke_toan")
      const key = data?.permission;

      const rp = key ? map.get(key) : null;

      let newNode: TreeNode = { ...node };

      // Nếu permissionName match thì set checkbox
      if (rp) {
        newNode = {
          ...newNode,
          data: {
            ...data,
            all: rp.all,
            view: rp.view,
            add: rp.add,
            edit: rp.edit,
            delete: rp.delete,
          },
        };
      }

      // Đệ quy children
      if (node.children?.length) {
        newNode.children = walk(node.children);
      }

      return newNode;
    });
  };

  return walk(tree);
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
  const { handleParamUrl } = useHandleParamUrl();
  const [displayData, setDisplayData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [infos, setInfos] = useState<any>({});
  const dispatch = useDispatch();
  const [paramsPaginator, setParamsPaginator] = useState({
        pageNum: 1,
        pageSize: 20,
        first: 0,
        render: false,
        keyword: "",
  });
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
      setLoading(true);
      const payload = mergePermissionTreeToArray(nodes);
      infos.PermissionDetail = payload;
      const response = await addOrUpdate(infos);
      if (response) setLoading(false);
      if (response.status === 200) {
          if(response.data.status){
            setInfos({ ...refreshObject(infos), status: true })
            refresh?.();
            dispatch(showToast({ ...listToast[0], detail: response.data.message }));
          }else{
            dispatch(showToast({ ...listToast[2], detail: response.data.message }))
          }
      } else dispatch(showToast({ ...listToast[1], detail: response.data.message }));
    };
    async function ClearForm() {
      setInfos({ id:'', name:'',note:'' });
      const newTree = buildPermissionTree(sidebarModel);
      setNodes(newTree); // ✅ reset nodes về mặc định
    }
    function getDetail(id:any){
        showRole({ id: id}).then(res => {
            const detail = res.data.data
            if (detail) {
               console.log("detail",detail);
                let info = {
                  ...detail
                };
                setInfos(info)
                // ✅ Map permissions vào nodes theo permissionName
                if (detail.rolePermissions) {
                  setNodes((prev) =>
                    applyPermissionsToTree(prev, detail.rolePermissions)
                  );
                }
            }
        }).catch(err => {
        //setHasError(true)
        }).finally();
    }
    const { data,loading:loadingRole, error, refresh } = useListRole({
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
    }, [ data, paramsPaginator]);
    return (
        <div className="card">
            <UpdateForm
                className="w-full"
                style={{ margin: "0 auto" }}
                checkId={infos.id}
                title="quyền"
                loading={loading}
                Accept={{Name:"Cập nhật", Action: () => Capnhat()}}
                Cancel={{Name:"Xóa làm lại", Action: () => ClearForm()}}
            >
                <div className="field">
                    <Panel header="Thông tin">
                        <div className="grid">
                            <div className="col-12">
                                <div className="formgrid grid">
                                    <div className="field col-6">
                                        <InputForm className="w-full"
                                            id="name"
                                            value={infos.name}
                                            onChange={(e: any) =>
                                                setInfos({ ...infos, name: e.target.value })
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
                                value={displayData}
                                loading={loading}
                                filterDisplay="row"
                                className={classNames("Custom-DataTableClient")}
                                onRowClick={(e: any) => {
                                    getDetail(e.data.id);
                                }}
                            >
                                <Column field="name" header="Tên nhóm quyền"/>
                                <Column field="note" header="Ghi chú" />
                                <Column field="updatedAt" header="Người cập nhật" />
                                {/* <Column header="Cập nhật lúc" body={(e: any) => TimeBody(e.updated_at)} /> */}
                                <Column
                                    header="Thao tác"
                                    body={(e: any) =>
                                        {
                                            return ActionBody(
                                                e,
                                                null,
                                                { route: "Permission/delete", action: delRole },
                                                paramsPaginator,
                                                setParamsPaginator
                                            )
                                        }
                                    }
                                />
                            </DataTableClient>
                        </div>
                    </SplitterPanel>
                </Splitter>
            </div>
        </div>
    );
}