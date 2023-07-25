import { Link } from 'react-router-dom';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { LayoutContext } from './context/layoutContext';
import { AppTopbarRef } from 'types/layout';
import { Image } from 'primereact/image';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <span>CMS ADMIN</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>
            <div className="layout-topbar-menu">
                    <span>abc</span>
                    <div className="p-link layout-topbar-button">
                    <Image src='/assets/images/avatarIcon.jpg' height='35px' width='35px' />
                        <div className='menu-topbar'>
                            <div className="p-link">
                               abc
                            </div>
                            <Link to='/auth/changepassword'>
                                <div className="p-link" >
                                    Change password
                                </div>
                            </Link>
                            <div className="p-link flex align-items-center gap-4">
                                <i className='pi pi-sign-out' style={{ fontSize: '16px' }} /> Logout
                            </div>
                        </div>
                    </div>
                </div>
            {/* <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button> */}

            {/* <div className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': true })}>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link to="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
              
            </div> */}
           
        </div>
    );
});

export default AppTopbar;
