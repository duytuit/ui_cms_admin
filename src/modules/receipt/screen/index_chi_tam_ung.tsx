import { useEffect, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody, Body, PriceBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { GridForm } from "components/common/ListForm";
import { deleteReceipt, updateStatusReceipt } from "../api";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { useListReceipt } from "../service";
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
export default function Receipt() {
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false });
    const _Receipt:any = useListReceipt({ ...paramsPaginator, status: undefined, first: undefined });
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable value={_Receipt.rows} header={RenderHeader({ title: 'Danh sách phiếu thu', add: '/receipt/add' })}
                title="phiếu thu" totalRecords={_Receipt.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
               <Column field="receiptCode" header="Mã phiếu thu" />
                <Column field="cycleName" header="Kỳ phiếu thu" />
                <Column field="customerName" header="Khách hàng" />
                <Column field="email" header="Email" />
                <Column header="Giá" body={(e:any)=> PriceBody(e.cost)}/>
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/receipt/update/status', action: updateStatusReceipt })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/receipt/detail',  { route: '/receipt/delete', action: deleteReceipt },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        