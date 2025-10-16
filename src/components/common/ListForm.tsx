

import { Button, FormInput, InputText } from "components/uiCore";
import Dropdownz from "components/uiCore/form/Dropdown";
import MultiSelectz from "components/uiCore/form/MultiSelect";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { refreshObject } from "utils";
import { MyCalendar } from "./MyCalendar";
import Calendarz from "components/uiCore/form/Calendar";

export const Calendar = (props:any) => {
    const { id,className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <Calendarz id={id} dateFormat="dd/mm/yy" readOnlyInput 
                 showIcon className={classNames("w-full", className)} {...prop} />
            </span>
        </>
    )
};

export const MultiSelect = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <MultiSelectz optionLabel={optionLabel ? optionLabel : 'name'} filter display="chip"
            optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
    )
};

export const Input = (props:any) => {
    const { id, placeholder, className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <InputText  className={classNames("w-full", className)} {...prop} />
                <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
    )
};

export const Dropdown = (props:any) => {
    const { optionLabel, optionValue, className, ...prop } = props;
    return (
        <Dropdownz optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
            optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
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
            <div className="col">
                 <div className="formgrid grid">
                    {props.children}
                 </div>
            </div>
            <div className="col">
                <div className="flex justify-content-end flex-wrap">
                   <Button type="button" label="Thêm mới" severity="success" size="small" outlined />
                   <Button type="button" label="Làm mới" className="ml-2" onClick={handleClear} severity="secondary" size="small" outlined />
                   <Button type="submit" label="Lọc" className="ml-2" severity="info" size="small" raised />
                </div>
            </div>
        </form>
    )
};
