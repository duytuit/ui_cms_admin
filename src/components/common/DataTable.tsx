// import React, { useState, Fragment, useEffect, useRef } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { confirmDialog } from 'primereact/confirmdialog';
// import moment from "moment"
// import { Button } from 'primereact/button';
// import { InputSwitch } from 'primereact/inputswitch';
// import { showToast } from 'redux/features/toast';
// import { listToast } from 'utils';

// export const RenderHeader = (props) => {
//     const dispatch = useDispatch();
//     const permissionTool = useSelector(state => state.permission).permissionTool;
//     const { title, add, imports, exports, moreOption } = props;
//     const [loading, setLoading] = useState(false);

//     async function fetchData() {
//         if (exports.totalRecords >= 500) {
//             dispatch(showToast({ ...listToast[2], detail: "Bạn đang export dữ liệu quá lớn, nên thời gian trả về sẽ lâu hơn" }));
//         }
//         const response = await exports.action();
//         if (response) setLoading(false);
//         if (response.status) {
//             const downloadLink = document.createElement('a');
//             downloadLink.href = URL.createObjectURL(response.data);
//             downloadLink.download = exports.file || 'data.xlsx';
//             downloadLink.click();
//             dispatch(showToast({ ...listToast[0], detail: response.mess }));
//         }
//         else dispatch(showToast({ ...listToast[1], detail: response.mess }));
//     };

//     const handleExport = () => {
//         setLoading(true);
//         fetchData();
//     };

//     return (
//         <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
//             <h4 className="m-0">{title}</h4>
//             <div className="mt-2 lg:mt-0">
//                 {moreOption && <Button label="Thu hồi nhiều khách hàng" onClick={a => moreOption()} severity="info" size="small" raised /> }
//                 {add && permissionTool.includes(add) && <Link to={add} >
//                     <Button icon='pi pi-plus' label="Thêm mới" className="ml-3" severity="info" size="small" raised />
//                 </Link>}
//                 {imports && permissionTool.includes(imports.route) && <Button label="Import" icon='pi pi-upload'
//                     onClick={imports.action} className="ml-3" severity="info" size="small" raised />}
//                 {exports && permissionTool.includes(exports.route) &&
//                     <Button label="Export" loading={loading} onClick={handleExport} icon='pi pi-download' className="ml-3" severity="warning" size="small" raised />
//                 }
//             </div>
//         </div>
//     );
// };

// export const Body = (data, value) => {
//     let name = '';
//     if (data && data[0] && value) {
//         data.forEach(d => {
//             if (d.id === value) name = d.name || d.title || d.cb_title || d.full_name;
//         });
//     };
//     return <Fragment>{name}</Fragment>;
// };

// export const TimeBody = (value) => {
//     if (value) return <Fragment >{moment(value).format("DD/MM/YYYY HH:mm:ss")}</Fragment>
// };

// export const StatusBody = (rowData, actions) => {
//     const dispatch = useDispatch();
//     const permissionTool = useSelector(state => state.permission).permissionTool;

//     const accept = () => {
//         const params = { id: rowData.id, status: checked ? 0 : 1, cb_status: checked ? 0 : 1 };
//         actions.action(params);
//         setChecked(!checked);
//         dispatch(showToast({ ...listToast[0], detail: 'Đổi trạng thái thành công!' }));
//     };

//     const confirm = () => {
//         confirmDialog({
//             message: 'Bạn có muốn tiếp tục thay đổi trạng thái?',
//             header: 'BO quản trị dự án',
//             icon: 'pi pi-info-circle',
//             accept,
//         });
//     };

//     const [checked, setChecked] = useState((rowData.status || rowData.cb_status) ? true : false);
//     return <InputSwitch disabled={!permissionTool.includes(actions.route)} checked={checked} onChange={confirm} />
// };

// export const ActionBody = (rowData, editRoute, actions, paramsPaginator, setParamsPaginator, duplicated, handleUndo) => {
//     const permissionTool = useSelector(state => state.permission).permissionTool;
//     const dispatch = useDispatch();
    
//     async function accept() {
//         const res = await actions.action({ id: rowData.id });
//         if (res.data.status) {
//             dispatch(showToast({ ...listToast[0], detail: 'Xóa dữ liệu thành công!' }));
//             if (paramsPaginator && setParamsPaginator) {
//                 setParamsPaginator({ ...paramsPaginator, render: !paramsPaginator.render });
//             };
//         } else {
//             dispatch(showToast({ ...listToast[1], detail: res.data.mess }));
//         }
//     };

//     const confirm = () => {
//         confirmDialog({
//             message: 'Bạn có muốn tiếp tục xóa?',
//             header: 'BO quản trị dự án',
//             icon: 'pi pi-info-circle',
//             accept,
//         });
//     };

//     return (
//         <React.Fragment>
//             {editRoute && permissionTool.includes(editRoute) && <Link to={editRoute + '/' + rowData.id}>
//                 <Button icon="pi pi-eye" rounded outlined className="mr-2" />
//             </Link>}
//             {duplicated && permissionTool.includes(editRoute) && <Button onClick={e => duplicated(rowData.id)}
//                 icon="pi pi-clone" rounded outlined className="mr-2" />}
//             {actions && permissionTool.includes(actions.route) && <Button className="mr-2" type='button' icon="pi pi-trash"
//                 onClick={actions.options ? actions.options : confirm} rounded outlined severity="danger" />}
//             {handleUndo && <Button type='button' icon="pi pi-undo" onClick={e => handleUndo(e)} rounded outlined />}
//         </React.Fragment>
//     );
// };

// export const Column = (props) => {
//     const { ...prop } = props;
//     return (
//         <Columnz {...prop} />
//     )
// };

// export const DataTable = (props) => {
//     const { paramsPaginator, setParamsPaginator, totalRecords, title, key, ...prop } = props;
//     const [loading, setLoading] = useState(false);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);

//     const onPage = (event) => {
//         setParamsPaginator({
//             ...paramsPaginator,
//             first: event.first,
//             limit: event.rows,
//             page: event.page !== 0 ? event.page + 1 : 1,
//         });
//     };

//     const timeoutRef = useRef();
//     useEffect(() => {
//         loadLazyData();
//     }, [paramsPaginator]);

//     const loadLazyData = () => {
//         setLoading(true);
//         timeoutRef.current = setTimeout(() => {
//             setLoading(false);
//         }, 1000);

//         return () => {
//             clearTimeout(timeoutRef.current);
//         };
//     };

//     useEffect(() => {
//         const params = {};
//         for (let [key, value] of queryParams.entries()) {
//             params[key] = Number(value) || value;
//         };
//         params.render = false;
//         params.first = (params.page - 1) * params.limit;
//         if (params.page && params.limit && params.first) setParamsPaginator(params);
//     }, []);

//     useEffect(() => {
//         const params = {};
//         for (let key in paramsPaginator) {
//             if (paramsPaginator.hasOwnProperty(key)) {
//                 const value = paramsPaginator[key];
//                 if (value !== undefined && value !== null) {
//                     if (key === 'page' || key === 'limit') params[key] = value;
//                 };
//             };
//         };
//         navigate(location.pathname + '?' + new URLSearchParams(params).toString());
//     }, [paramsPaginator]);

//     return (
//         <DataTablez lazy
//             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//             paginator first={paramsPaginator.first} rows={paramsPaginator.limit} totalRecords={totalRecords} onPage={onPage}
//             rowsPerPageOptions={[20, 50, 100]} dataKey={key ? key : "id"} loading={loading} showGridlines
//             emptyMessage={"Không tìm thấy " + title} currentPageReportTemplate="Tổng số: {totalRecords} bản ghi" {...prop} >
//             <Column header="#" body={(data, options) => options.rowIndex + 1} style={{ width: '1rem' }} bodyStyle={{ textAlign: 'center' }} />
//             {props.children}
//         </DataTablez>
//     )
// };

export {}