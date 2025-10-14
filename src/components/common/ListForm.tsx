// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { classNames } from 'primereact/utils';

import { Button, FormInput, InputText } from "components/uiCore";
import Calendarz from "components/uiCore/form/Calendar";
import Dropdownz from "components/uiCore/form/Dropdown";
import MultiSelectz from "components/uiCore/form/MultiSelect";
import { classNames } from "primereact/utils";
import { refreshObject } from "utils";

export const Calendar = (props:any) => {
    const { className, ...prop } = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <Calendarz dateFormat="dd/mm/yy" selectionMode="range" placeholder='Chọn khoảng thời gian' 
                showIcon readOnlyInput className='w-full' showButtonBar {...prop} />
        </div>
    )
};

export const MultiSelect = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <MultiSelectz optionLabel={optionLabel ? optionLabel : 'name'} filter display="chip"
                optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
        </div>
    )
};

export const Input = (props:any) => {
    const { id, placeholder, className, ...prop } = props;
    return (
        <div className={classNames("mb-2 col-12 md:col-6 lg:col-3", className)}>
            <InputText id={id} placeholder={placeholder ? placeholder : 'Tìm kiếm theo tên ...'}
                style={{ padding: '0.75rem' }} className="w-full" {...prop} />
        </div>
    )
};

export const Dropdown = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
            <Dropdownz optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
                optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
        </div>
    )
};

export const GridForm = (props:any) => {
    const { paramsPaginator, setParamsPaginator, filter, handleFilter ,defaultParam } = props;
    const handleClear = (e:any) => {
        setParamsPaginator(defaultParam);
        refreshObject(filter)
    };

    const handleSubmit = (e:any) => {
        let filters = filter;
        e.preventDefault();
        if (handleFilter) {
            filters = handleFilter(filter);
        };
        setParamsPaginator({ ...paramsPaginator, ...filters });
    };

    return (
       <form  id="form_search" onSubmit={handleSubmit} className="grid formgrid mb-2 aligin-items-center">
            {props.children}
            <div className="col">
                <div className="flex justify-content-end flex-wrap">
                   <Button type="button" label="Làm mới" onClick={handleClear} severity="secondary" size="small" outlined />
                   <Button type="submit" label="Lọc" className="ml-2" severity="info" size="small" raised />
                </div>
            </div>
        </form>
    )
};
