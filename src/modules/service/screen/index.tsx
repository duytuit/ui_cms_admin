import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, Body, PriceBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { useListService } from "../service";
import { deleteService, updateStatusService } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListCategories } from "modules/categories/service";

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
export default function Service() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const _service:any = useListService({ ...paramsPaginator, status: undefined, first: undefined });
    const _categories:any = useListCategories();
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_service.rows} header={RenderHeader({ title: 'Danh sách dịch vụ', add: '/service/add' })}
                title="quốc gia" totalRecords={_service.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column header="Danh mục" body={(e:any)=> Body(_categories, e.categoryId)}/>
                <Column field="name" header="Tên" />
                <Column header="Giá" body={(e:any)=> PriceBody(e.price)}/>
                <Column field="desc_detail" header="Mô tả" />
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/service/update/status', action: updateStatusService })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/service/detail',  { route: '/service/delete', action: deleteService },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        