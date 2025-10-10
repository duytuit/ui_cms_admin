import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { deletePost, updateStatusPost } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListCategories } from "modules/categories/service";
import { useListPost } from "../service";
import { CategoryEnum } from "utils/type.enum";

const Header = ({ _setParamsPaginator, _paramsPaginator , _defaultParam }: {_setParamsPaginator:any,_paramsPaginator:any,_defaultParam:any}) => {
    const [filter, setFilter] = useState({ name: '' });
    return (
        <GridForm paramsPaginator={_paramsPaginator} setParamsPaginator={_setParamsPaginator} defaultParam={_defaultParam}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <div className="field col">
                <FormInput value={filter.name} onChange={(e:any) => setFilter({ ...filter, name: e.target.value })} label="Tìm kiếm theo tên" size="small" />
            </div>
        </GridForm>
    )
};
export default function Post() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const defaultParam={ pageNum: 1, pageSize: 20, first: 0, render: false };
    const [paramsPaginator, setParamsPaginator] = useState(defaultParam);
    const _Post:any = useListPost({ ...paramsPaginator, status: undefined, first: undefined });
    const _categories:any = useListCategories({type:CategoryEnum.post});
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _defaultParam={defaultParam} _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_Post.rows} header={RenderHeader({ title: 'Danh sách bài viết', add: '/post/add' })}
                title="bài viết" totalRecords={_Post.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column field="name" header="Tên" />
                <Column header="Danh mục" />
                <Column header="Hình thức" />
                <Column field="Post_type" header="Loại" />
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/post/update/status', action: updateStatusPost })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/post/detail',  { route: '/post/delete', action: deletePost },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        