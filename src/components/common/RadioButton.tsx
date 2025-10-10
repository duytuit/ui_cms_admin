// import { InputTextarea } from "primereact/inputtextarea";
// import { classNames } from "primereact/utils";

// export const RadioButton = (props) => {
//     const { data, className, value, onChange, ...prop } = props;

//     return (
//         <div className={classNames("flex gap-3", className)}>
//             {data.map(d => (
//                 <div key={d.id} className="flex align-items-center">
//                     <RadioButtonz
//                         inputId={`${d.name || d.title || d.cb_title}_${d.id}`}
//                         name={`${d.name || d.title || d.cb_title}`}
//                         value={`${d.name || d.title || d.cb_title}_${d.id}`}
//                         onChange={() => onChange(d.id)}
//                         checked={value === (d.id)}
//                         {...prop}
//                     />
//                     <label htmlFor={`${d.name || d.title || d.cb_title}_${d.id}`} className="ml-2">{d.name}</label>
//                 </div>
//             ))}
//         </div>
//     )
// };

export {}