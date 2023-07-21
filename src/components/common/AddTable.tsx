// import { Button, Column, DataTable, Dropdown } from "@/uiCore";
// import { InputText } from "primereact/inputtext";
// import { Fragment, useState } from "react";
// import { from_types, type_bonus } from "@/modules/sales_manager/sales_policy/util";

// export const cellEditor = (options, handleSetData) => {
//     if (options.field === 'total' || options.field === 'expired_time_paid') return numberEditor(options, handleSetData);
//     if (options.field === 'type_payment' || options.field === 'type_bonus') return dropdownEditor(options, handleSetData);
//     if (options.field === 'from_type') return dropdownEditorV2(options, handleSetData);
//     else return textEditor(options, handleSetData);
// };

// const numberEditor = (options, handleSetData) => {
//     return <InputText className="w-full" type="number" value={options.value}
//         onChange={(e) => handleSetData(options.rowData.idz, options.field, Number(e.target.value))} />;
// };

// const textEditor = (options, handleSetData) => {
//     return <InputText className="w-full" type="text" value={options.value}
//         onChange={(e) => handleSetData(options.rowData.idz, options.field, e.target.value)} />;
// };

// const dropdownEditor = (options, handleSetData) => {
//     return <Dropdown className="w-full" options={type_bonus} optionLabel="name" optionValue="id"
//         value={options.value} onChange={(e) => handleSetData(options.rowData.idz, options.field, e.target.value)} />;
// };

// const dropdownEditorV2 = (options, handleSetData) => {
//     return <Dropdown className="w-full" options={from_types} optionLabel="name" optionValue="id"
//         value={options.value} onChange={(e) => handleSetData(options.rowData.idz, options.field, e.target.value)} />;
// };

// export const onCellEditComplete = (e) => {
//     let { rowData, newValue, field, originalEvent: event } = e;
//     if (newValue) rowData[field] = Number(newValue) || newValue;
//     else event.preventDefault();
// };

// const AddTable = (props) => {
//     const { data, setData, index, disabled, ...prop } = props;

//     const actionBody = (e) => {
//         const handleDelete = () => {
//             setData(data.filter(d => d !== e), index);
//         };
//         return (
//             <Button type='button' icon="pi pi-trash" onClick={handleDelete} rounded outlined severity="danger" />
//         )
//     };

//     const handleAddRow = () => {
//         const newRow = { idz: (data && data[0]) ? data[data.length - 1].idz + 1 : 1 };
//         setData([...data, newRow], index);
//     };

//     return (
//         <Fragment>
//             <DataTable value={data} dataKey="idz" editMode="cell" showGridlines emptyMessage=" ">
//                 {props.children}
//                 {!disabled && <Column header="" body={actionBody} />}
//             </DataTable>
//             {!disabled && <Button type='button' onClick={handleAddRow} label='Thêm hàng' size="small" className="mt-3" />}
//         </Fragment>

//     )
// };

// export default AddTable;

export {}