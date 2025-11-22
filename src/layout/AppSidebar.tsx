import { Dropdown } from 'primereact/dropdown';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menuContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listStorage } from 'modules/storage/api';
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
        route: '/page-two',
        items: [
          {
            id: 1,
            name: 'Theo dõi số file',
            route: '/ContractFile/list',
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
            route: '/ContractFile/list-create-nangha',
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
            route: '/ContractFile/list-create-filegia',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
           {
            id: 1,
            name: 'Debit KH các lô hàng không lập file',
            route: '/page-two',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
           {
            id: 1,
            name: 'Debit NCC các lô hàng không lập file',
            route: '/page-two',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Số dư đầu kỳ',
            route: '/page-two',
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
                route: '/debit/ListDauKyKh',
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
                route: '/debit/ListDauKyNcc',
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
        route: '/page-two',
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
            route: '/ContractFile/list-create-bangke',
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
            route: '/debit/listCuoc',
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
            route: '/debit/listTamThu',
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
        route: '/page-two',
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
            route: '/ContractFile/list-create-dispatch',
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
            route: '/page-two',
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
        name: 'Mua-Bán hàng',
        route: '/page-two',
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
            name: 'Chứng từ mua-bán',
            route: '/debit/ListMuaBan',
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
        route: '/page-two',
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
            route: '/page-two',
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
            route: '/page-two',
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
            route: '/page-two',
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
            route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
            route: '/page-two',
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
                route: '/receipt/listReceiptChi',
                created_at: '2023-05-29 14:14:02',
                updated_at: null,
                deleted_at: null,
                status: 1,
                category_id: 1,
                sort: 1,
              },
              {
                id: 1,
                name: 'Phiếu chi giao nhận',
                route: '/receipt/listReceiptChiGiaoNhan',
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
                route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
            name: 'Hoàn ứng giao nhận',
            route: '/receipt/listChiPhiGiaoNhan',
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
        name: 'Danh mục',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        route: '/page-two',
        items: [
          {
            id: 1,
            name: 'Đối tác',
            route: '/partner/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Quản lý xe',
            route: '/vehicle/list',
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
            route: '/page-two',
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
                route: '/page-two',
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
                route: '/page-two',
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
            route: '/page-two',
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
            route: '/page-two',
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
            route: '/page-two',
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
            route: '/department/list',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Nhân viên',
            route: '/employee/list',
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
        route: '/page-two',
        items: [
          {
            id: 1,
            name: 'Duyệt file giá',
            route: '/ContractFile/list-confirm-filegia',
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
            name: 'Danh sách dữ liệu',
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
            id: 1,
            name: 'Import đối tác',
            route: '/user/inportExcelPartner',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
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
export default function AppSidebar(){
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<any>();
  const [activeMenu, setActiveMenu] = useState('');
  const [data, setData] = useState<any>([]);
  const project = localStorage.getItem('project');
  const fetchProject = async () => {
          try {
              const res = await listStorage({ });
               if(res?.data?.data?.data){
                   let  _data =  res.data.data.data.map((item:any)=>({ name: item.name, projectId: item.id }))
                   setData(_data);
               }
          } catch (err) {
          } finally {
          }
      };
  useEffect(() => {
    fetchProject();
    if (project) {
      const _project = JSON.parse(project)
      setSelectedCity(_project);
    } else {
      setSelectedCity(null);
    }
  }, []);
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
          options={data}
          optionLabel="name"
          placeholder="Chọn dữ liệu"
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
