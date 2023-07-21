import AppTopbar from "./AppTopbar";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import { classNames } from "primereact/utils";

import React, { useState, useRef } from 'react';

const Layout = (props:any) => {
    const sidebarRef = useRef(null);
    const [hideSidebar, setHideSidebar] = useState(false);
    const [layoutState, setLayoutState] = useState({
        profileSidebarVisible: false,
    });

    const onMenuToggle = () => {
        setHideSidebar(!hideSidebar);
    }

    const showProfileSidebar = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
    };

    return (
        <React.Fragment>
            <div className={`layout-wrapper layout-theme-light layout-static p-ripple-disabled ${hideSidebar ? 'layout-static-inactive':''}`}> 
                <AppTopbar onMenuToggle={onMenuToggle} showProfileSidebar={showProfileSidebar} layoutState={layoutState} />
                <div ref={sidebarRef} className={classNames("layout-sidebar", { "hide-menu": hideSidebar })}>
                    <AppSidebar />
                </div>
                <div className={classNames("layout-main-container", { "hide-sidebar": hideSidebar })}>
                    <div className="layout-main">{props.children}</div>
                    <AppFooter />
                </div>
                <div className={classNames({ "layout-mask": !hideSidebar })} onClick={onMenuToggle}></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;