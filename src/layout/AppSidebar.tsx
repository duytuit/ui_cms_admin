import React from 'react';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menuContext';
import { publicRoutes } from 'routes';

const AppSidebar = () => {
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {publicRoutes.map((item:any, i) => {
                    console.log(item);
                    return  <MenuSidebar item={item} root={true} index={i} key={i} />
                })}
            </ul>
        </MenuProvider>
    );

};

export default AppSidebar;
