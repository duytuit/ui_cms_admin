import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';

type ChildContainerProps = {
    children: ReactNode;
};
export interface MenuContextProps {
    activeMenu: string;
    setActiveMenu: Dispatch<SetStateAction<string>>;
}
export const MenuContext = createContext({}as MenuContextProps);

export const MenuProvider = ({children}:ChildContainerProps) => {
    const [activeMenu, setActiveMenu] = useState('');

    const value = {
        activeMenu,
        setActiveMenu,
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};