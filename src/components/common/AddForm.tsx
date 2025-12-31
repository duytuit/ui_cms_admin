import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useSelector } from "react-redux";
import { Calendar, Dialog, Dropdown, FormInput } from "components/uiCore";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { InputTextarea } from "primereact/inputtextarea";
import { useState, Fragment } from "react";

export const CalendarForm = (props:any) => {
    const { label, ...prop } = props;

    return (
        <div className="flex mb-3">
            <label className="block text-900 font-medium w-3 mr-5">{label}</label>
            <Calendar {...prop} showIcon className="w-9" showTime hourFormat="24" />
        </div>
    )
}

export const InputTextareaForm = (props:any) => {
    const { id, label, className, ...inputprop } = props;
    return (
        <div className="flex mb-6">
            <label htmlFor={id} className="block text-900 font-medium w-4 mr-2">{label ? label : 'Mô tả'}</label>
            <InputTextarea autoResize id={id} rows={6} cols={30} className={classNames("w-full", className)} {...inputprop} />
        </div>
    )
};

export const InputNumber = (props:any) => {
    const { value, handleChange, ...prop } = props;
    const onChange = (e:any) => {
        let value = e.target.value;
        let result = '';
        for (let i = 0; i < value.length; i++) {
            if (!isNaN(value[i])) {
                result += value[i];
            };
        };
        // if (Number(result) && Number(result) !== NaN) handleChange(result);
    };
    return <InputForm value={formatNumber(value) || ''} onChange={onChange} type='text' {...prop} />;
}

export const InputSwitchForm = (props:any) => {
    const { label, className, ...inputprop } = props;
    return (
        <div className="flex mb-3 change-disabled">
            <label className="block text-900 font-medium w-3 mr-2">{label ? label : 'Trạng thái'}</label>
            <InputSwitch className={classNames("text-left", className)} {...inputprop} />
        </div>
    )
};

export const InputForm = (props:any) => {
    const { label, id, placeholder, className, ...inputprop } = props;
    return (
        <span className="p-float-label">
            <FormInput id={id} label={label} placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
                className={classNames(className)} {...inputprop}/>
        </span>
    )
};

export const DropdownForm = (props:any) => {
    const { label, optionLabel, optionValue, placeholder, className, ...inputprop } = props;
    return (
        <div className="w-full flex align-items-center mb-3 change-disabled">
            <label className="block text-900 font-medium w-4 mr-2">{label}</label>
            <Dropdown filter className={classNames("w-full", className)}
                optionLabel={optionLabel ? optionLabel : 'name'} optionValue={optionValue ? optionValue : 'id'}
                placeholder={placeholder || `Chọn ${label.toLowerCase()}`} {...inputprop} />
        </div>
    )
};

export const AddForm = (props:any) => {
    const navigate = useNavigate();
    // const permissionTool = useSelector((state:any) => state.permission).permissionTool;
    const { checkId, title, loading, onSubmit, className, moreOptions, route,routeList, ...prop } = props;
    return (
        <div className={classNames("card", className)} {...prop}>
             <form onSubmit={onSubmit}>
                <div className="flex justify-content-between align-items-center mb-4">
                    <div>
                         {routeList &&<h4 className="m-0">{checkId ? 'Lưu' : 'Thêm mới'} {title}</h4>}
                        {moreOptions && moreOptions.id && <MoreOptions value={moreOptions} />}
                    </div>
                    <div>
                        {routeList &&  <Button type='button' onClick={() => navigate(routeList)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />}
                        {<Button type='submit' loading={loading} label={checkId ? "Lưu" : "Thêm mới"}
                            className="ml-2" severity="info" size="small" raised icon="pi pi-check"/>}
                    </div>
                </div>
                {props.children}
                <div className="w-full justify-content-end flex">
                    {routeList && <Button type='button' onClick={() => navigate(routeList)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />}
                    {<Button type='submit' loading={loading} label={checkId ? "Lưu" : "Thêm mới"}
                        className="ml-2" severity="info" size="small" raised icon="pi pi-check"/>}
                </div>
            </form>
        </div>
    )
};
export const AddFormCustom = (props:any) => {
    const navigate = useNavigate();
    // const permissionTool = useSelector((state:any) => state.permission).permissionTool;
    const { checkId, title, loading, onSubmit, className, moreOptions, route,routeList,AddName, ...prop } = props;
    return (
        <div className={classNames("card", className)} {...prop}>
             <form onSubmit={onSubmit}>
                <div className="flex justify-content-between align-items-center mb-4">
                     <div>
                         {routeList &&<h4 className="m-0">{title}</h4>}
                    </div>
                    <div>
                        {routeList &&  <Button type='button' onClick={() => navigate(routeList)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />}
                        {<Button type='submit' loading={loading} label={AddName??"Lưu"}
                            className="ml-2" severity="info" size="small" raised icon="pi pi-check"/>}
                    </div>
                </div>
                {props.children}
                <div className="w-full justify-content-end flex">
                    {routeList && <Button type='button' onClick={() => navigate(routeList)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />}
                    {<Button type='submit' loading={loading} label={AddName??"Lưu"}
                        className="ml-2" severity="info" size="small" raised icon="pi pi-check"/>}
                </div>
            </form>
        </div>
    )
};
export const UpdateForm = (props:any) => {
    const navigate = useNavigate();
    const { checkId, title, loading, onSubmit, className, moreOptions, route, routeList, ButtonName, AddName, Cancel, Accept,...prop } = props;
    return (
        <div className={classNames("card", className)} {...prop}>
             <form onSubmit={onSubmit}>
                {props.children}
                <div className="w-full justify-content-end flex">
                    {routeList && <Button type='button' onClick={() => navigate(routeList)} label="Trở về" className="ml-2" severity="secondary" size="small" outlined />}
                    {ButtonName && <Button type='submit' loading={loading} label={ButtonName}
                        className="ml-2" severity={ButtonName == "Duyệt" ?"info": "warning"} size="small" raised icon="pi pi-check"/>}
                    {Cancel &&
                        <Button  
                            type="button" 
                            label={Cancel.Name}
                            className="ml-2"
                            severity="warning"
                            size="small"
                            raised icon="pi pi-check"
                            onClick={() => Cancel.Action()}
                        />}
                    {Accept &&
                        <Button  
                            type="button"   
                            label={Accept.Name}
                            className="ml-2"
                            severity="info"
                            size="small"
                            raised icon="pi pi-check"
                            onClick={() => Accept.Action()}
                        />}
                    {AddName && <Button type='submit' loading={loading} label={AddName}
                        className="ml-2" severity="info" size="small" raised icon="pi pi-check"/>}
                </div>
            </form>
        </div>
    )
};
export const MoreOptions = (props:any) => {
    const navigate = useNavigate();
    const { value } = props;
    const [visible, setVisible] = useState(false);
    return (
        <Fragment>
            <Dialog header="Import bảng hàng" visible={visible} position='top' style={{ width: '50vw' }}
                onHide={() => setVisible(false)} draggable={false} resizable={false}>
            </Dialog>

            <div className="flex">
                {value && value.scope_type === "admin" && <Button type='button' onClick={() => setVisible(true)} icon='pi pi-upload' label="Import chia rổ" className="ml-2" severity="warning" size="small" raised />}
                <Button onClick={() => navigate(`/row_table?category_id=${value.category_id}&cart_id=${value.id}`)} type='button' label="Sản phẩm rổ hàng" className="ml-2" severity="info" size="small" raised />
            </div>
        </Fragment>
    )
};

export const formatNumber = (amount:any) => {
    if (amount) return new Intl.NumberFormat('en-US').format(amount);
};