import { BreadCrumb } from 'primereact/breadcrumb';
import { useLocation, Link } from 'react-router-dom';
import { Helper } from 'utils/helper';
import { sidebarModel } from './AppSidebar';
export default function AppBreadcrumb() {
  const location = useLocation();

  const breadcrumbItems =
    Helper.findBreadcrumb(sidebarModel[0].items, location.pathname) || [];
   console.log('breadcrumbItems', breadcrumbItems);
   
  const model = breadcrumbItems.map((item) => ({
    label: item.name,
    template: () =>
      item.route ? <Link to={item.route}>{item.name}</Link> : item.name
  }));

  return (
    <BreadCrumb
      model={model}
      home={{ icon: 'pi pi-home', url: '/' }}
    />
  );
}

