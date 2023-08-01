import { Link, useLocation } from 'react-router-dom';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { useState, useEffect } from 'react';

const MenuSidebar = (props:any) => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const active = activeMenu === key || (activeMenu && activeMenu.startsWith(key + '-')) || false;
    // const permissionTool = useSelector((state:any) => state.permission).permissionTool;
    const permissionTool = ['/','/page-one','/page-two','/auth/login','/categories/list'];
    const itemClick = (event:any) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }
        // toggle active state
        if (item.items) setActiveMenu(active ? props.parentKey : key);
        else setActiveMenu(key);
    };

    useEffect(() => {
        let isShow = false;
        if (item.items) {
            item.items.forEach((i:any) => {
                if (location.pathname.includes(i.route)) {
                    isShow = true;
                }
            })
        };
        if (isShow) setActiveMenu(key);
    }, []);

    if (item.name && !item.route && item.items) {
        let isDisabled = true;
        item.items.forEach((item:any) => {
            if (item.route && permissionTool.includes(item.route)) {
                isDisabled = false;
            }
        });
        if (isDisabled) return <li key={props.index}></li>;
    };
    if (item.route && !permissionTool.includes(item.route)) return <li key={props.index}></li>;
    const subMenu = item.items && item.visible !== false && (
        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item.name}>
            <ul>
                {item.items.map((child:any, i:number) => {
                    return <MenuSidebar item={child} index={i} className={child.badgeClass} parentKey={key} key={child.name + '-' + i} />;
                })}
            </ul>
        </CSSTransition>
    );

    return (
        <li className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
            {/* {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.name}</div>} */}

            {(!item.route || item.items) && item.visible !== false ? (
                <Link to={''} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple')} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className="layout-menuitem-text">{item.name}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {item.route && !item.items && item.visible !== false ? (
                <Link to={item.route} replace={item.replaceUrl} onClick={(e) => itemClick(e)}
                    className={classNames(item.class, 'p-ripple', { 'active-item': location.pathname.includes(item.route + '/') || location.pathname === item.route })} tabIndex={0}>
                    <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                    <span className={classNames('layout-menuitem-text', { 'submenu-text': !item.icon })}>{item.name}</span>
                    {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </Link>
            ) : null}

            {subMenu}
        </li>
    );
};

export default MenuSidebar;
