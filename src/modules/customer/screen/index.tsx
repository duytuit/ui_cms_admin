import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, Body, PriceBody, BodyImage } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { deleteCustomer, updateStatusCustomer } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListCategories } from "modules/categories/service";
import { useListCustomer } from "../service";

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
export default function Customer() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const _Customer:any = useListCustomer({ ...paramsPaginator, status: undefined, first: undefined });
    const _categories:any = useListCategories();
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_Customer.rows} header={RenderHeader({ title: 'Danh sách khách hàng', add: '/customer/add' })}
                title="khách hàng" totalRecords={_Customer.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column header="Danh mục" body={(e:any)=> Body(_categories, e.countryId)}/>
                <Column field="full_name" header="Tên" />
                <Column field="email" header="Email" />
                <Column header="Ảnh"  body={(e:any)=> BodyImage(e.avatar)}/>
                <Column header="Hộ chiếu" body={(e:any)=> BodyImage(e.passportImage)}/>
                <Column field="travelDate" header="Ngày xuất cảnh" style={{ width: '12%' }}/>
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/customer/update/status', action: updateStatusCustomer })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/customer/detail',  { route: '/customer/delete', action: deleteCustomer },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        