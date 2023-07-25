import { Dropdown } from 'primereact/dropdown';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menuContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const AppSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
    const model = [{ items:[
        {
            id: 5,
            name: 'Trang Chủ',
            sort: 1,
            status: 1,
            created_at: '2023-06-01 10:04:39',
            deleted_at: null,
            updated_at: null,
            icon: 'pi pi-home',
            route: '/'
          },
          {
            id: 1,
            name: 'Info Page',
            sort: 2,
            status: 1,
            created_at: '2023-05-29 14:13:14',
            deleted_at: null,
            updated_at: null,
            icon: 'pi pi-user',
            items: [
              {
                id: 1,
                name: 'Page one',
                route: '/page-one',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
                actions: '[{"action":"import"},{"action":"export"},{"action":"delete"},{"action":"update"},{"action":"add"},{"action":"detail"},{"action":"view"}]'
              },
              {
                id: 2,
                name: 'Page two',
                route: '/page-two',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 2,
                actions: '[{"action":"delete"},{"action":"update"},{"action":"add"},{"action":"detail"},{"action":"view"}]'
              }
            ]
          },
    ]}];
    const [selectedCity, setSelectedCity] = useState<any>();
    const project = localStorage.getItem('project');
    useEffect(()=>{
         if(project){
           const _project =JSON.parse(project) 
          setSelectedCity(_project);
         }
    },[]);
    const cities = [
        { name: 'New York', projectId: 'NY' },
        { name: 'Rome', projectId: 'RM' },
        { name: 'London', projectId: 'LDN' },
        { name: 'Istanbul', projectId: 'IST' },
        { name: 'Paris', projectId: 'PRS' }
    ];
    const onChange=(event:any)=>{
      setSelectedCity(event.value);
      localStorage.setItem('project',JSON.stringify(event.value)) 
      setSearchParams({"projectId": event.value.projectId})     
    }
    return (
        <MenuProvider>
          <Dropdown value={selectedCity} onChange={onChange} options={cities} optionLabel='name' 
                placeholder="Select a City" className="w-full md:w-14rem p-inputtext-sm" />
            <ul className="layout-menu">
                {model.map((item:any, i) => {
                    return  <MenuSidebar item={item} root={true} index={i} key={i} />
                })}
            </ul>
        </MenuProvider>
    );

};

export default AppSidebar;
