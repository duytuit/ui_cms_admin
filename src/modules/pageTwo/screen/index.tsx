import { Column } from "primereact/column";
import { useState } from "react";
import { updateCampaign, deleteCampaign } from "../api";
import { useListCampaign } from "../service";
import { Dropdown, GridForm, Input, MultiSelect } from "components/common/ListForm";
import { ActionBody, RenderHeader, StatusBody, TimeBody } from "components/common/DataTable";
import DataTablez from "components/uiCore/data/DataTable";
import { useHandleParamUrl } from "hooks/useHandleParamUrl";

const Header = ({ _setParamsPaginator, _paramsPaginator }: {_setParamsPaginator:any,_paramsPaginator:any}) => {
    const [filter, setFilter] = useState({ name: '',user_id_manager:'',source_id:'' ,category_id:''});

    return (
        <GridForm paramsPaginator={_paramsPaginator} setParamsPaginator={_setParamsPaginator}
            filter={filter} setFilter={setFilter} className="lg:col-12">
            <Input value={filter.name} onChange={(e:any) => setFilter({ ...filter, name: e.target.value })} />
            <MultiSelect value={filter.user_id_manager} options={[]}
                onChange={(e:any) => setFilter({ ...filter, user_id_manager: e.target.value })}
                optionLabel="full_name" placeholder="Chọn người quản lý chiến dịch" />
            <Dropdown value={filter.source_id} options={[]} placeholder="Chọn nguồn"
                onChange={(e:any) => setFilter({ ...filter, source_id: e.target.value })} />
            <Dropdown value={filter.category_id}
                onChange={(e:any) => setFilter({ ...filter, category_id: e.target.value })}
                options={[]} optionLabel="cb_title" placeholder="Chọn dự án" />
        </GridForm>
    )
};

export default function PageTwo() {
    const [paramsPaginator, setParamsPaginator] = useState({ page: 1, limit: 20, first: 0, render: false });
    const customers = useListCampaign({ ...paramsPaginator, status: undefined, first: undefined, render: undefined });
    const { handleParamUrl} = useHandleParamUrl(); 
    return (
        <div className="card">
            <Header _paramsPaginator={paramsPaginator} _setParamsPaginator={setParamsPaginator} />
            <DataTablez value={customers} header={RenderHeader({ title: 'Danh sách chiến dịch', add: '/campaign/add' })}
                title="chiến dịch" totalRecords={0} paramsPaginator={paramsPaginator} setParamsPaginator={setParamsPaginator} >
                <Column field="name" header="Tên chiến dịch" />
                <Column header="Dự án" body={''} />
                <Column header="Nguồn" body={''} />
                <Column field="rule_time" header="Thời gian chăm sóc (phút)" bodyStyle={{ textAlign: 'center' }} />
                <Column field="penalty" header="Quy định phạt (tour)" bodyStyle={{ textAlign: 'center' }} />
                <Column header="Thời gian tạo" body={e => TimeBody(e.created_at)} bodyStyle={{ textAlign: 'center' }} />
                <Column header="Thời gian cập nhật" body={e => TimeBody(e.updated_at)} bodyStyle={{ textAlign: 'center' }} />
                <Column header="Trạng thái" body={e => StatusBody(e,{ route: '/campaign/update', action: updateCampaign })} bodyStyle={{ textAlign: 'center' }} />
                <Column header="Actions" body={e => ActionBody(e, '/campaign/detail', { route: '/campaign/delete', action: deleteCampaign }, paramsPaginator, setParamsPaginator)} bodyStyle={{ textAlign: 'center' }} />
            </DataTablez>
        </div>
    )
}
        