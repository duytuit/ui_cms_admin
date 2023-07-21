// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';
// import { classNames } from 'primereact/utils';

// export const Calendar = (props) => {
//     const { className, ...prop } = props;
//     return (
//         <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
//             <Calendarz dateFormat="dd/mm/yy" selectionMode="range" placeholder='Chọn khoảng thời gian' 
//                 showIcon readOnlyInput className='w-full' showButtonBar {...prop} />
//         </div>
//     )
// };

// export const MultiSelect = (props) => {
//     const { optionLabel, optionValue, className, ...prop } = props;
//     return (
//         <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
//             <MultiSelectz optionLabel={optionLabel ? optionLabel : 'name'} filter display="chip"
//                 optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
//         </div>
//     )
// };

// export const Input = (props) => {
//     const { id, placeholder, className, ...prop } = props;
//     return (
//         <div className={classNames("mb-2 col-12 md:col-6 lg:col-3", className)}>
//             <InputText id={id} placeholder={placeholder ? placeholder : 'Tìm kiếm theo tên ...'}
//                 style={{ padding: '0.75rem' }} className="w-full" {...prop} />
//         </div>
//     )
// };

// export const Dropdown = (props) => {
//     const { optionLabel, optionValue, className, ...prop } = props;
//     return (
//         <div className={classNames("col-12 mb-2 md:col-6 lg:col-3", className)}>
//             <Dropdownz optionLabel={optionLabel ? optionLabel : 'name'} filter appendTo="self"
//                 optionValue={optionValue ? optionValue : 'id'} className='w-full' {...prop} />
//         </div>
//     )
// };

// export const GridForm = (props) => {
//     const { className, paramsPaginator, setParamsPaginator, filter, setFilter, handleFilter } = props;
//     const handleClear = () => {
//         setFilter(refreshObject(filter));
//         setParamsPaginator({
//             page: paramsPaginator.page, limit: paramsPaginator.limit,
//             first: paramsPaginator.first, render: paramsPaginator.render
//         });
//     };

//     const handleSubmit = (e) => {
//         let filters = filter;
//         e.preventDefault();
//         if (handleFilter) {
//             filters = handleFilter(filter);
//         };
//         setParamsPaginator({ ...paramsPaginator, ...filters });
//     };

//     return (
//         <form onSubmit={handleSubmit} className="grid formgrid mb-2 aligin-items-center">
//             {props.children}
//             <div className={classNames("mb-2 col-12 md:col-12 lg:col-3 flex justify-content-end", className)}>
//                 <Button type="button" label="Làm mới" onClick={handleClear} severity="secondary" style={{ minWidth: '96px', height: '40px' }} size="small" outlined />
//                 <Button type="submit" label="Lọc" className="ml-2" severity="info" size="small" raised style={{ minWidth: '96px', height: '40px' }} />
//             </div>
//         </form>
//     )
// };

export {}