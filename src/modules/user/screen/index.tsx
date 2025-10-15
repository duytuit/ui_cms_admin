import { useEffect, useRef, useState } from "react";
import { RenderHeader, StatusBody, ActionBody, DataTable, Column, TimeBody } from "components/common/DataTable";
import { FormInput } from "components/uiCore";
import { Calendar, GridForm, Input } from "components/common/ListForm";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";
import { CategoryEnum } from "utils/type.enum";
import { deleteUser, updateStatusUser } from "../api";
import { useListUsers } from "../service";
import { classNames } from "primereact/utils";

const Header = ({ _setParamsPaginator, _paramsPaginator }: {_setParamsPaginator:any,_paramsPaginator:any}) => {
  
    const [filter, setFilter] = useState({ name: '' });
    return (
        <GridForm paramsPaginator={_paramsPaginator} setParamsPaginator={_setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-9">
            <div className="col-3">
                <Input label="Tìm kiếm" size="small" className={classNames("input-sm")}/>
            </div>
            <div className="col-3">
                <Calendar dateFormat="dd/mm/yy" id="FromDate" label="Từ ngày" size="small" className={classNames("button-icon-sm")}/>
            </div>
            <div className="col-3">
                <Calendar dateFormat="dd/mm/yy" id="ToDate" label="Đến ngày" size="small"  className={classNames("button-icon-sm")}/>
            </div>
        </GridForm>
    )
};
export default function User() {
    const [selectedRows, setSelectedRows] = useState([]);
    const { handleParamUrl} = useHandleParamUrl(); 
    const [paramsPaginator, setParamsPaginator] = useState({ pageNum: 1, pageSize: 20, first: 0, render: false,type:CategoryEnum.country });
    const Users:any = useListUsers({ ...paramsPaginator, status: undefined, first: undefined });
    useEffect(()=>{
        handleParamUrl(paramsPaginator)
    },[paramsPaginator])
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTable rowHover value={Users.data} header={""} 
                selectionMode="multiple"
                selection={selectedRows}
                onSelectionChange={(e : any) => setSelectedRows(e.value)}
                dataKey="id"
                title="Tài khoản" totalRecords={Users.total} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>
                <Column field="username" header="Tên đăng nhập" />
                <Column field="email" header="Email" />
                <Column field="first_name" header="Tên Quốc gia" />
                <Column field="last_name" header="Ghi chú"  footer="Tổng giá: 30000"/>
                <Column header="Cập nhật lúc" body={(e:any) => TimeBody(e.updateTime)}  bodyStyle={{ textAlign: 'center' }} style={{ width: '12%' }}/>
                <Column field="status" header="Hiển thị" body={(e:any) => StatusBody(e,
                    { route: '/categories/update/status', action: updateStatusUser })} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
                <Column header="Actions" body={(e:any) => ActionBody(e, '/categories/detail',  { route: '/categories/delete', action: deleteUser },
                    paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center'}} style={{ width: '10%' }}/>
            </DataTable>
        </div>
    )
}
        