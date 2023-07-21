// import { Chip } from "primereact/chip";
// import SortableList from "./SortableList";
// import { MultiSelect } from "primereact/multiselect";
// import { TreeSelect } from "primereact/treeselect";
// import { Fragment, useEffect, useState } from "react";
// import { getArrIdFromTreeSelect } from "utils";

// const MultiSelectList = (props) => {
//     const { value, setValue, data, minHeight, title, sort, tree } = props;
//     const [valueList, setValueList] = useState([]);

//     useEffect(() => {
//         setValueList([...getObjectFromIds(data, value)]);
//     }, [value, data])

//     const onChange = (e) => {
//         if (tree) {
//             setValue([...getArrIdFromTreeSelect(e.value)]);
//         } else {
//             setValue([...e.value]);
//         }
//     };

//     const onRemove = (d) => {
//         if (d.user_id) {
//             setValue([...value.filter(v => v !== d.user_id)])
//         }
//         else {
//             setValue([...value.filter(v => v !== d.id)])
//         }
//     };

//     return (
//         <Fragment>
//             <div className="flex justify-content-center mb-3">
//                 <label className="block text-900 font-medium w-3 mt-2 mr-2">{title}</label>
//                 {tree ? <TreeSelect value={value} filter onChange={onChange} options={data}
//                     metaKeySelection={false} className="w-9" selectionMode="checkbox"
//                     display="chip" placeholder={"Chọn " + title.toLowerCase()} style={{ minHeight: '3rem' }} />
//                     : <MultiSelect value={value} filter options={data} onChange={onChange} optionLabel={(data && data[0] && data[0].name) ? "name" : "cb_title"} optionValue="id"
//                         placeholder={"Chọn " + title.toLowerCase()} className='w-9' style={{ minHeight: '3rem' }} display="none" />
//                 }
//             </div>
//             <div className="flex justify-content-center mb-3">
//                 <label className="block text-900 font-medium w-4 mr-2"></label>
//                 <div className="card flex flex-wrap gap-2 w-full" style={{ minHeight: '8rem' }}>
//                     {sort ? <SortableList items={valueList} onChangeRemove={onRemove} onChange={e => onChange(e)} />
//                         : valueList.map(d => {
//                             return <Chip key={d.id} label={d.full_name || d.name || d.title || d.cb_title} removable onRemove={(e) => onRemove(d)}
//                                 style={{ maxHeight: '2.5rem', margin: '0' }} />
//                         })}
//                 </div>
//             </div>
//         </Fragment>
//     )
// };

// export default MultiSelectList;

export {}