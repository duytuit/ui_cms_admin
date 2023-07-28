import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const DefaultPage = (props) => {
    const { title, subTitle, img } = props;
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center" style={{ borderRadius: '53px' }}>
                        <div className="flex justify-content-center align-items-center bg-pink-500 border-circle" style={{ height: '3.2rem', width: '3.2rem' }}>
                            <i className="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 className="text-900 font-bold text-5xl mb-2">{title}</h1>
                        <div className="text-600 mb-5">{subTitle}</div>
                        <img src={img} alt={title} className="mb-5" width="80%" />
                        <Button onClick={handleGoBack} icon="pi pi-arrow-left" label="Go back" text />
                    </div>
                </div>
            </div>
        </div>
    )
};

export const AccessDeniedPage = () => {
    return (
        <DefaultPage title='Access Denied' subTitle='Bạn không có quyền truy cập'
        img='/assets/img/permissionPage.svg' />
    );
};

export const ErrorPage = () => {
    return (
        <DefaultPage title='Error Occured' subTitle='Liên kết không tồn tại'
            img='/assets/img/errorPage.svg' />
    );
};

