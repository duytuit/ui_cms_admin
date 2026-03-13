import { useEffect, useState } from "react";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { Splitter } from "primereact/splitter";
import { Column, TreeTable } from "components/uiCore";
import { useDispatch } from "react-redux";
import { useListIncomeExpense } from "../service";
function buildTree(data: any[]) {
    const map: any = {};
    const roots: any[] = [];

    // Tạo map trước
    data.forEach(item => {
        map[item.id] = {
            key: item.id.toString(),
            data: {
                id: item.id,
                name: item.name,
                parent_id: item.parent_id
            },
            children: []
        };
    });

    // Build cây
    data.forEach(item => {
        if (item.parent_id && map[item.parent_id]) {
            map[item.parent_id].children.push(map[item.id]);
        } else {
            roots.push(map[item.id]);
        }
    });

    return roots;
}
export default function ListDanhMucThu() {
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
        type:0
  });
    async function ClearForm() {
      setInfos({ id:'', name:'',note:'' });
    }
    const { data,loading:loadingRole, error, refresh } = useListIncomeExpense({
        params: paramsPaginator,
        debounce: 500,
    });
         // ✅ Client-side pagination
    useEffect(() => {
        if (!data?.data) return;
        handleParamUrl(paramsPaginator);
        const treeData = buildTree(data.data);
        setDisplayData(treeData);
    }, [ data]);
    return (
        <div className="card">
            <div style={{ height: 'calc(100vh - 6rem)' }}>
                <Splitter style={{ height: '100%', width: '100%' }}>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <b>Danh mục chi</b>
                             <TreeTable value={displayData}  
                                scrollable
                                scrollHeight="100%"
                                style={{ height: "100%" }}
                                >
                                <Column field="id" header="ID" />
                                <Column field="name" header="Tên danh mục" expander />
                                </TreeTable>
                        </div>
                </Splitter>
            </div>
        </div>
    );
}