// import { Checkbox } from "primereact/checkbox";
// import { useEffect, useState } from "react";

// const MulticheckBox = ({ title, categories, value, onChange }) => {
//     categories = categories || [];
//     const [selectAll, setSelectAll] = useState(false);

//     useEffect(() => {
//         if (value.length === 0) setSelectAll(false);
//         let newArr = [];
//         categories.forEach(c => {
//             newArr.push(title + ' - ' + c.action);
//         });
//         if (newArr.every(item => value.includes(item))) setSelectAll(true);
//         else setSelectAll(false);
//     }, [value])

//     const onCategoryChange = (e) => {
//         let _selectedCategories = [...value];
//         let newArray = [];
//         if (e.checked)
//             _selectedCategories.push(title + ' - ' + e.value.action);
//         else
//             _selectedCategories = _selectedCategories.filter(s => s !== title + ' - ' + e.value.action);
//         categories.forEach(c => newArray.push(title + ' - ' + c.action));
//         onChange(_selectedCategories);
//     };

//     const handleSelectAll = () => {
//         let _selectedCategories = [...value];
//         if (selectAll) categories.forEach(c => _selectedCategories = _selectedCategories.filter(s => s !== title + ' - ' + c.action));
//         else categories.forEach(c => { if (!_selectedCategories.includes(title + ' - ' + c.action)) _selectedCategories.push(title + ' - ' + c.action) });
//         onChange(_selectedCategories);
//         setSelectAll(!selectAll);
//     };

//     return (
//         <div className="w-full flex justify-content-between">
//             <div>
//                 <Checkbox inputId={title} onChange={handleSelectAll} checked={selectAll} />
//                 <label htmlFor={title} className="ml-2">
//                     {title}
//                 </label>
//             </div>
//             <div className="flex gap-3">
//                 {categories.map((c) => {
//                     return (
//                         <div key={title + ' - ' + c.action} className="flex align-items-center">
//                             <Checkbox inputId={title + ' - ' + c.action} name="c" value={c}
//                                 onChange={onCategoryChange} checked={value.some((item) => item === title + ' - ' + c.action)} />
//                             <label htmlFor={title + ' - ' + c.action} className="ml-2">
//                                 {c.action}
//                             </label>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     )
// };

// export const MultiSelect = ({ tree, permissionToolbar, setPermissionToolbar }) => {
//     tree = tree || [];
//     return (
//         <div className="card flex w-full flex-wrap">
//             {tree.map(t => {
//                 return (
//                     <div key={t.name} className="w-full mb-4">
//                         <h6>{t.name}</h6>
//                         <div className="card flex flex-column gap-3">
//                             {
//                                 t.children.map(c => {
//                                     return (
//                                         <MulticheckBox value={permissionToolbar} onChange={setPermissionToolbar} key={c.name} title={c.name} categories={c.children} />
//                                     )
//                                 })
//                             }
//                         </div>
//                     </div>
//                 )
//             })}
//         </div>
//     )
// };

export {}