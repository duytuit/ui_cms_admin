// import React, { useEffect, useState } from 'react';
// import { Chip } from 'primereact/chip';

// const SortableList = (props) => {
//     const { items, onChangeRemove, onChange } = props;
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         setData([...items]);
//       }, [items.length]);

//     const onDragEnd = (result) => {
//         if (!result.destination) {
//             return;
//         }
//         const updatedItems = [...data];
//         const [removed] = updatedItems.splice(result.source.index, 1);
//         updatedItems.splice(result.destination.index, 0, removed);
//         onChange([ ...getArrId(updatedItems)]);
//         setData(updatedItems)
//     };

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="sortable-list">
//                 {(provided) => (
//                     <div {...provided.droppableProps} ref={provided.innerRef} >
//                         {data.map((item, index) => (
//                             <Draggable key={item.id} draggableId={String(item.id)} index={index}>
//                                 {(provided) => (
//                                     <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                     >
//                                         <Chip label={item.full_name || item.name} removable className='mt-2' onRemove={e => onChangeRemove(item)} />
//                                     </div>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//         </DragDropContext>
//     );
// };

// export default SortableList;

export {}
