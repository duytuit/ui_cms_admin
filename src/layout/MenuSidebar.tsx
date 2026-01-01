import { Link, useLocation } from 'react-router-dom';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { useEffect, useState } from 'react';

export default function MenuSidebar(props: any) {
  const employeeInfo = JSON.parse(localStorage.getItem('employeeInfo') || '{}');
  const isAdmin = [280].includes(employeeInfo?.user_id);

  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<string>('');

  const item = props.item;

  const key = props.parentKey
    ? `${props.parentKey}-${props.index}`
    : `${props.index}`;

  /* ===== active luôn là boolean ===== */
  const active: boolean =
    activeMenu === key ||
    (activeMenu.length > 0 && activeMenu.startsWith(key + '-'));

  /* =================================================
     CHỈ FILTER Ở MENU CHA
     ================================================= */
  const menuRender = Array.isArray(item.items)
    ? item.items
    : [];

  /* ===== click menu ===== */
  const itemClick = (event: any) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.command) {
      item.command({ originalEvent: event, item });
    }

    if (item.items) {
      setActiveMenu(active ? props.parentKey : key);
    } else {
      setActiveMenu(key);
    }
  };

  /* ===== auto mở menu theo route ===== */
  useEffect(() => {
    if (!Array.isArray(item.items)) return;

    const matched = item.items.some((i: any) =>
      location.pathname.startsWith(i.route)
    );

    if (matched) setActiveMenu(key);
  }, []);

  /* =================================================
     ẨN MENU CHA admin:true với USER THƯỜNG
     ================================================= */
  if (item.admin === true && !isAdmin) {
    return null;
  }

  /* ===== submenu ===== */
  const subMenu =
    menuRender.length > 0 && item.visible !== false && (
      <CSSTransition
        in={props.root ? true : active}
        timeout={{ enter: 300, exit: 200 }}
        classNames="layout-submenu"
        unmountOnExit
      >
        <ul>
          {menuRender.map((child: any, i: number) => (
            <MenuSidebar
              key={(child.name || 'menu') + '-' + i}
              item={child}
              index={i}
              parentKey={key}
            />
          ))}
        </ul>
      </CSSTransition>
    );

  return (
    <li
      className={classNames({
        'layout-root-menuitem': props.root,
        'active-menuitem': active
      })}
    >
      {/* ===== menu cha ===== */}
      {(!item.route || item.items) && item.visible !== false && (
        <Link
          to=""
          onClick={itemClick}
          className={classNames(item.class, 'p-ripple')}
        >
          <i className={classNames('layout-menuitem-icon', item.icon)} />
          <span className="layout-menuitem-text">{item.name}</span>
          {item.items && (
            <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />
          )}
          <Ripple />
        </Link>
      )}

      {/* ===== menu lá ===== */}
      {item.route && !item.items && item.visible !== false && (
        <Link
          to={item.route}
          onClick={itemClick}
          className={classNames(item.class, 'p-ripple', {
            'active-item':
              location.pathname === item.route ||
              location.pathname.startsWith(item.route + '/')
          })}
        >
          <i className={classNames('layout-menuitem-icon', item.icon)} />
          <span className="layout-menuitem-text">{item.name}</span>
          <Ripple />
        </Link>
      )}

      {subMenu}
    </li>
  );
}