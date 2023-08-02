import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { useListCategories } from "../service";
import { deleteCategories, updateCategories, updateStatusCategories } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";

const Header = ({ _setParamsPaginator, _paramsPaginator }: {_setParamsPaginator:any,_paramsPaginator:any}) => {
    const [filter, setFilter] = useState({ name: '' });

    return (
        <GridForm paramsPaginator={_paramsPaginator} setParamsPaginator={_setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <div className="field col">
                <FormInput value={filter.name} onChange={(e:any) => setFilter({ ...filter, name: e.target.value })} label="Tìm kiếm theo tên" size="small" />
            </div>
        </GridForm>
    )
};


export default function Categories() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const categories:any = useListCategories({ ...paramsPaginator, status: undefined, first: undefined });
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={categories.rows} header={RenderHeader({ title: 'Danh sách Quốc gia', add: '/categories/add' })}
                title="quốc gia" totalRecords={categories.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column field="name" header="Tên Quốc gia" />
                <Column field="remark" header="Ghi chú" />
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/categories/update/status', action: updateStatusCategories })} bodyStyle={{ textAlign: 'center' }} />
                <Column header="Actions" body={(e:any) => ActionBody(e, '/categories/detail', null,
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTable>
        </div>
    )
}
        