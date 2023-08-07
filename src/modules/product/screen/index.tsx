import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, Body, PriceBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { deleteProduct, updateStatusProduct } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListCategories } from "modules/categories/service";
import { useListProduct } from "../service";
import { CategoryEnum } from "utils/type.enum";

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
export default function Product() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const _Product:any = useListProduct({ ...paramsPaginator, status: undefined, first: undefined });
    const _categories:any = useListCategories({type:CategoryEnum.country});
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_Product.rows} header={RenderHeader({ title: 'Danh sách sản phẩm', add: '/product/add' })}
                title="sản phẩm" totalRecords={_Product.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column header="Danh mục" body={(e:any)=> Body(_categories, e.categoryId)}/>
                <Column field="name" header="Tên" />
                <Column header="Giá" body={(e:any)=> PriceBody(e.price)}/>
                <Column header="Xuất cảnh" body={(e:any)=> (e.type === 1?'1 Lần':'Nhiều lần')}/>
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/product/update/status', action: updateStatusProduct })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/product/detail',  { route: '/product/delete', action: deleteProduct },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        