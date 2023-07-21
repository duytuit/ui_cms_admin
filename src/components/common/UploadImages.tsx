// import { Button } from "primereact/button";
// import React, { useEffect } from "react";

// export const UploadImages = (props) => {
//     const { images, setImages, title, view } = props;
//     const onChange = (e) => {
//         const files = e.target.files;
//         const imagesArray = [];
//         for (let i = 0; i < files.length; i++) {
//             files[i].preview = URL.createObjectURL(files[i]);
//             imagesArray.push(files[i]);
//             if (imagesArray.length === files.length) {
//                 setImages([...images, ...imagesArray]);
//             };
//         };
//     };

//     const removeImg = (i, item) => {
//         const files = images;
//         setImages(files.filter(f => f !== item));
//     };

//     const removeAll = () => {
//         setImages([]);
//     };

//     return (
//         <div className="w-full card mt-2">
//             <div className="flex justify-content-between align-items-center mb-2">
//                 <h6 style={{ margin: '0' }}>{title}</h6>
//                 <div className="flex align-items-center">
//                     {!view && <Button onClick={removeAll} type='button' style={{ width: '40px', height: '40px', padding: '0', margin: '0 16px' }}>
//                         <i className="pi pi-times" style={{ margin: '0 auto' }} ></i>
//                     </Button>}
//                     {!view && <label className="p-button p-fileupload-choose p-component" style={{ padding: '0.6rem 1rem' }}>
//                         <i className="pi pi-fw pi-images" style={{ marginRight: '0.25rem' }} ></i>
//                         <span className="p-button-text p-clickable">Choose</span>
//                         <input type="file" onChange={onChange} multiple accept="image/jpeg, image/png, image/gif" className="p-inputtext p-component" />
//                     </label>}
//                 </div>
//             </div>

//             <div style={{ height: '200px', overflowX: 'scroll' }} className="card flex gap-4" >
//                 {images.map((item, index) => {
//                     return (
//                         <div key={index} className="flex flex-column" >
//                             <Image src={item.preview} alt="Image" width="150" height="120" preview />
//                             {!view && <Button onClick={i => removeImg(i, item)} type='button' style={{ width: '30px', height: '30px', padding: '0', margin: '0 auto' }}>
//                                 <i className="pi pi-times" style={{ margin: '0 auto' }} ></i>
//                             </Button>}
//                         </div>
//                     )
//                 })}
//             </div>
//         </div>
//     )
// };

// export const UploadImg = (props) => {
//     const { image, setImage, title } = props;

//     useEffect(() => {
//         return () => {
//             image && URL.revokeObjectURL(image.preview);
//         }
//     }, [image]);

//     const handleAvatar = (e) => {
//         const file = e.target.files[0];
//         file.preview = URL.createObjectURL(file);
//         setImage(file);
//     };

//     const clearImg = () => {
//         setImage('');
//     };

//     return (
//         <div className="w-full flex flex-column justify-content-center" style={{ textAlign: 'center' }}>
//             <h5 className="mb-2 ml-2" style={{ textAlign: 'center' }}>{title}</h5>
//             <div className="ml-2" >
//             </div>
//             <div className="flex align-items-center justify-content-center">
//                 {clearImg && <Button onClick={clearImg} type='button' style={{ width: '40px', height: '40px', padding: '0', margin: '0 8px' }}>
//                     <i className="pi pi-times" style={{ margin: '0 auto' }} ></i>
//                 </Button>}
//                 <label className="p-button p-fileupload-choose p-component" style={{ padding: '0.6rem 1rem' }}>
//                     <span className="p-button-text p-clickable">Choose</span>
//                     <input type="file" onChange={handleAvatar} multiple accept="image/jpeg, image/png, image/gif" className="p-inputtext p-component" />
//                 </label>
//             </div>
//         </div>
//     )
// };

export {}