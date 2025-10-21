import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { confirmDialog } from 'primereact/confirmdialog';
import moment from "moment"
import Columnz from 'components/uiCore/data/Column';
import DataTablez from 'components/uiCore/data/DataTable';
import { Button } from 'primereact/button';
import { InputSwitch } from 'primereact/inputswitch';
import { showToast } from 'redux/features/toast';
import { listToast } from 'utils';
import { Link } from 'react-router-dom';
import { Helper } from 'utils/helper';
import { Image } from 'components/uiCore';

export const RenderHeader = (props:any) => {
    const dispatch = useDispatch();
    const { title, add, imports, exports, moreOption } = props;
    const [loading, setLoading] = useState(false);

    async function fetchData() {
        if (exports.totalRecords >= 500) {
            dispatch(showToast({ ...listToast[2], detail: "Bạn đang export dữ liệu quá lớn, nên thời gian trả về sẽ lâu hơn" }));
        }
        const response = await exports.action();
        if (response) setLoading(false);
        if (response.status) {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(response.data);
            downloadLink.download = exports.file || 'data.xlsx';
            downloadLink.click();
            dispatch(showToast({ ...listToast[0], detail: "Export thành công!" }));
        }
        else dispatch(showToast({ ...listToast[1], detail: response.mess }));
    };

    const handleExport = () => {
        setLoading(true);
        fetchData();
    };

    return (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h4 className="m-0">{title}</h4>
            <div className="mt-2 lg:mt-0">
                {moreOption && <Button label="Thu hồi nhiều khách hàng" onClick={a => moreOption()} severity="info" size="small" raised /> }
                {add && <Link to={add} >
                    <Button icon='pi pi-plus' label="Thêm mới" className="ml-3" severity="info" size="small" raised />
                </Link>}
                {imports && <Button label="Import" icon='pi pi-upload'
                    onClick={imports.action} className="ml-3" severity="info" size="small" raised />}
                {exports &&
                    <Button label="Export" loading={loading} onClick={handleExport} icon='pi pi-download' className="ml-3" severity="warning" size="small" raised />
                }
            </div>
        </div>
    );
};

export const Body = (data:any, value:any) => {
    if (data && data?.rows) {
        const detail:any= data.rows.find((item:any)=>item.id === value);
       return <Fragment>{detail ? detail.name:''}</Fragment>;
    };
};

export const TimeBody = (value:any) => {
    if (value) return <Fragment >{moment(value).format("DD/MM/YY HH:mm:ss")}</Fragment>
};

export const PriceBody = (value:any) => {
    if (value) return <Fragment><div style={{float: "right"}}>{Helper.formatCurrencyV2(value.toString())}</div></Fragment>
};
export const BodyImage = (value:any) => {
    if (value) return <Fragment><div>  <Image src={process.env.REACT_APP_UPLOAD_CDN+value} alt="Image" width="150" height="120" preview /></div></Fragment>
};

export const StatusBody = (rowData:any, actions:any) => {
    const dispatch = useDispatch();
    const accept = () => {
        const params = { id: rowData?.postId || rowData?.id, status: checked ? 1 : 0, cb_status: checked ? 1 : 0 };
        actions.action(params);
        setChecked(!checked);
        dispatch(showToast({ ...listToast[0], detail: 'Đổi trạng thái thành công!' }));
    };

    const confirm = () => {
        confirmDialog({
            message: 'Bạn có muốn tiếp tục thay đổi trạng thái?',
            header: 'Quản trị dự án',
            icon: 'pi pi-info-circle',
            accept,
        });
    };

    const [checked, setChecked] = useState((rowData.status===0 || rowData.cb_status===0) ? true : false);
    return <InputSwitch checked={checked} onChange={confirm} />
};

export const ActionBody = (rowData:any, editRoute:any, actions?:any, paramsPaginator?:any, setParamsPaginator?:any, duplicated?:any, handleUndo?:any) => {
    const dispatch = useDispatch();
    
    async function accept() {
        const res = await actions.action({ id: rowData?.postId || rowData?.id });
        if (res.data.code ===200) {
            dispatch(showToast({ ...listToast[0], detail: 'Xóa dữ liệu thành công!' }));
            if (paramsPaginator && setParamsPaginator) {
                setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
            };
        } else {
            dispatch(showToast({ ...listToast[1], detail: res.data.mess }));
        }
    };

    const confirm = () => {
        confirmDialog({
            message: 'Bạn có muốn tiếp tục xóa?',
            header: 'Quản trị dự án',
            icon: 'pi pi-info-circle',
            accept,
        });
    };

    return (
        <React.Fragment>
            {editRoute && <Link to={editRoute + '/' + rowData?.id}>
                <Button icon="pi pi-eye" rounded outlined className="mr-2" />
            </Link>}
            {duplicated && <Button onClick={e => duplicated(rowData?.postId || rowData?.id)}
                icon="pi pi-clone" rounded outlined className="mr-2" />}
            {actions && <Button className="mr-2" type='button' icon="pi pi-trash"
                onClick={actions.options ? actions.options : confirm} rounded outlined severity="danger" />}
            {handleUndo && <Button type='button' icon="pi pi-undo" onClick={e => handleUndo(e)} rounded outlined />}
        </React.Fragment>
    );
};

export const Column = (props:any) => {
    const { ...prop } = props;
    return (
        <Columnz {...prop} />
    )
};

export const DataTable = (props: any) => {
    const { paramsPaginator, setParamsPaginator, totalRecords, title, key, ...prop } = props;

    const [loading, setLoading] = useState(false);
    const isServerSide = paramsPaginator && setParamsPaginator;

    const onPage = (event: any) => {
        if (isServerSide) {
            setParamsPaginator({
                ...paramsPaginator,
                first: event.first??1,
                pageSize: event.rows??20,
                pageNum: event.page + 1,
            });
        }
    };

    return (
        <DataTablez
            lazy={isServerSide}
            paginator
            loading={loading}
            paginatorClassName="custom-paginator"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            first={paramsPaginator.first} rows={paramsPaginator.pageSize} totalRecords={totalRecords}
            showGridlines
            rowsPerPageOptions={[20, 50, 100]} 
            dataKey={key ? key : "id"} 
            emptyMessage={`Không tìm thấy ${title}`}
            currentPageReportTemplate="Tổng số: {totalRecords} bản ghi"
            onPage={onPage} 
            {...prop}
        >
             <Column header="#" body={(data:any, options:any) => options.rowIndex + 1} style={{ width: '1rem' }} bodyStyle={{ textAlign: 'center' }} />
            {props.children}
        </DataTablez>
    );
};
export const DataTableClient = (props: any) => {
    const { title, key, ...prop } = props;
    return (
        <DataTablez
            paginatorClassName="custom-paginator"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            showGridlines
            rowsPerPageOptions={[20, 50, 100]} 
            dataKey={key ? key : "id"} 
            emptyMessage={`Không tìm thấy dữ liệu`}
            {...prop}
        >
             <Column header="#" body={(data:any, options:any) => options.rowIndex + 1} style={{ width: '1rem' }} bodyStyle={{ textAlign: 'center' }} />
            {props.children}
        </DataTablez>
    );
};
