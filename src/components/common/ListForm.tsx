

import { Button, FormInput, InputText } from "components/uiCore";
import Dropdownz from "components/uiCore/form/Dropdown";
import MultiSelectz from "components/uiCore/form/MultiSelect";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";
import { refreshObject } from "utils";
import { MyCalendar } from "./MyCalendar";
import Calendarz from "components/uiCore/form/Calendar";
import { Link } from "react-router-dom";

export const Calendar = (props:any) => {
    const { id,className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <Calendarz dateFormat="dd/mm/yy" readOnlyInput 
                 showIcon className={classNames("w-full", className)} {...prop} />
                <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
    )
};

export const MultiSelect = (props:any) => {
    const { className, ...prop } = props;
    return (
         <>
            <span className="p-float-label">
                <MultiSelectz  filter display="chip"
                  className={classNames("w-full", className)} {...prop} />
                <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
    )
};
export const CalendarY = (props:any) => {
    const { id, placeholder, className, ...prop } = props;
    return (
        <>
            <span className="p-float-label">
                <MyCalendar dateFormat="dd/mm/yy" className={classNames("w-full","p-inputtext","input-sm",className)}  {...prop} />
                <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
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
    const {className, ...prop } = props;
    return (
        <>
          <span className="p-float-label">
              <Dropdownz className={classNames("w-full", className)}  {...prop} />
              <label className={classNames("label-sm")} >{props.label}</label> 
            </span>
        </>
    )
};

export const GridForm = (props:any) => {
    const { paramsPaginator, setParamsPaginator, filter, handleFilter ,defaultParam, add , openDialogAdd, openDialogAddName} = props;
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
            <div className="col-8">
                 <div className="formgrid grid">
                    {props.children}
                 </div>
            </div>
            <div className="col-4">
                <div className="flex justify-content-end flex-wrap">
                   {/* <Button type="button" label="Làm mới" className="ml-2" onClick={handleClear} severity="secondary" size="small" outlined /> */}
                   {/* <Button type="submit" label="Xem" severity="info" size="small" raised /> */}
                    {add && <Link to={add} >
                        <Button icon='pi pi-plus' label="Thêm mới" className="ml-3" severity="success" size="small" raised />
                    </Link>}
                    {openDialogAdd &&
                        <Button
                            label={openDialogAddName??"Tạo hoàn ứng giao nhận"}
                            type="button"
                            icon="pi pi-plus"
                            severity="success"
                            size="small" 
                            raised 
                            onClick={() => openDialogAdd()}   // <<< thêm dòng này
                        />
                    }
                </div>
            </div>
        </form>
    )
};
