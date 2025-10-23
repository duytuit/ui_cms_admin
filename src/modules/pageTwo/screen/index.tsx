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
    const { handleParamUrl} = useHandleParamUrl(); 
    return (
        <div className="card">
            Tính năng đang cập nhật
        </div>
    )
}
        