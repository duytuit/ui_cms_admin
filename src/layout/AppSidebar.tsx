import { Dropdown } from 'primereact/dropdown';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menuContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const AppSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const model = [{
    items: [
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
        id: 5,
        name: 'Kế toán',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        route: '/product/list',
        items: [
          {
            id: 1,
            name: 'Theo dõi số file',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Theo dõi file nâng hạ',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Theo dõi file giá',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Debit khách hàng',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Debit KH các lô hàng không lập file',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Debit KH các lô hàng có lập file',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
            ]
          },
          {
            id: 1,
            name: 'Debit nhà cung cấp',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Debit NCC các lô hàng không lập file',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Debit NCC các lô hàng có lập file',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
            ]
          },
          {
            id: 1,
            name: 'Số dư đầu kỳ',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Số dư đầu kỳ KH',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Số dư đầu kỳ NCC',
                route: '/category/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
            ]
          },
        ]
      },
      {
        id: 1,
        name: 'Giao nhận',
        route: '/category/post/list',
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            name: 'Bảng liệt kê chi phí',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Danh sách cược',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Bảng tạm thu',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
        ]
      },
      {
        id: 1,
        name: 'Bảng điều xe',
        route: '/category/post/list',
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            name: 'Nhật ký hàng ngày',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Bảng tổng hợp điều xe',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
        ]
      },
      {
        id: 1,
        name: 'Công nợ',
        route: '/category/post/list',
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            name: 'Công nợ khách hàng',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Công nợ nhà cung cấp',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Bù trừ công nợ',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          }
        ]
      },
      {
        id: 5,
        name: 'Sổ quỹ',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            name: 'Danh mục thu',
            route: '/category/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Phiếu thu',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Thu tiền hoàn cước giao nhận',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Thu hoàn ứng lái xe',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Thu nội bộ',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Thu tạm ứng bảng phơi',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              }
            ]
          },
          {
            id: 1,
            name: 'Danh mục chi',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Phiếu chi',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Trả tiền nhà cung cấp',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Chi tạm ứng lái xe',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Chi nội bộ',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              }
            ]
          }
        ]
      },
      {
        id: 5,
        name: 'Danh mục',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        route: '/service/list',
        items: [
          {
            id: 1,
            name: 'Khách hàng',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Nhà cung cấp',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Danh mục thu chi',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
            items: [
              {
                id: 1,
                name: 'Thu',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Chi',
                route: '/post/list',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
            ]
          },
          {
            id: 1,
            name: 'Danh sách tài khoản NH',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Danh sách quỹ',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Danh sách xe công trình',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Bộ phận',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
        ]
      },
      {
        id: 5,
        name: 'Quản lý',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        route: '/service/list',
        items: [
          {
            id: 1,
            name: 'Duyệt bảng kê chi phí',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Duyệt file giá',
            route: '/post/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          }
        ]
      },
      {
        id: 1,
        name: 'Quản lý dữ liệu',
        sort: 2,
        status: 1,
        created_at: '2023-05-29 14:13:14',
        deleted_at: null,
        updated_at: null,
        route: '/storage/list',
        icon: 'pi pi-home',
        items: [
          {
            id: 1,
            name: 'Người dùng',
            route: '/storage/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
        ]
      },
      {
        id: 1,
        name: 'Hệ thống',
        sort: 2,
        status: 1,
        created_at: '2023-05-29 14:13:14',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-user',
        items: [
          {
            id: 1,
            name: 'Người dùng',
            route: '/user/list',
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
          },
          {
            id: 2,
            name: 'Cấu hình email',
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
      }
    ]
  }];
  const [selectedCity, setSelectedCity] = useState<any>();
  const project = localStorage.getItem('project');
  useEffect(() => {
    if (project) {
      const _project = JSON.parse(project)
      setSelectedCity(_project);
    } else {
      setSelectedCity({ name: 'Vudaco', projectId: '2' });
      localStorage.setItem('project', JSON.stringify({ name: 'Vudaco', projectId: '2' }))
      setSearchParams({ "projectId": "2" })
    }
  }, []);
  const cities = [
    { name: 'Vudaco', projectId: '2' },
    { name: 'Vudaco1', projectId: '3' },
  ];
  const onChange = (event: any) => {
    setSelectedCity(event.value);
    localStorage.setItem('project', JSON.stringify(event.value))
    setSearchParams({ "projectId": event.value.projectId })
    window.location.reload()
  }
  return (
    <MenuProvider>
      <span className="p-float-label">
        <Dropdown
          value={selectedCity}
          onChange={onChange}
          options={cities}
          optionLabel="name"
          placeholder="Select a City"
          className="w-full md:w-14rem p-inputtext-sm"
        />
        <label htmlFor="dropdown">Dữ liệu</label>
      </span>
      <ul className="layout-menu">
        {model.map((item: any, i) => {
          return <MenuSidebar item={item} root={true} index={i} key={i} />;
        })}
      </ul>
    </MenuProvider>
  );

};

export default AppSidebar;
