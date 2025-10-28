import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, Body, PriceBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { deleteBill, updateStatusBill } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListBill } from "../service";
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
export default function Bill() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const _Bill:any = useListBill({ ...paramsPaginator, status: undefined, first: undefined });
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_Bill.rows} header={RenderHeader({ title: 'Danh sách hóa đơn', add: '/bill/add' })}
                title="hóa đơn" totalRecords={_Bill.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column field="billCode" header="Mã hóa đơn" />
                <Column field="cycleName" header="Kỳ hóa đơn" />
                <Column field="customerName" header="Khách hàng" />
                <Column field="email" header="Email" />
                <Column header="Giá" body={(e:any)=> PriceBody(e.cost)}/>
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/bill/update/status', action: updateStatusBill })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/bill/detail',  { route: '/bill/delete', action: deleteBill },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        