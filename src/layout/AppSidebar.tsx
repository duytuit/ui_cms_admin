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
            route: '/debit/ListDebitNoFileKH',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Debit các lô hàng NCC',
            route: '/debit/ListDebitNCC',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1
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
          {
            id: 1,
            name: 'Yêu cầu hoàn ứng',
            route: '/receipt/listViewChiPhiGiaoNhan',
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
            name: 'Mua hàng',
            route: '/debit/ListMuaHang',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Bán hàng',
            route: '/debit/ListBanHang',
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
            name: 'Khách hàng',
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
                  name: 'Công nợ tổng hợp KH',
                  route: '/debit/ListTongHopKH',
                  created_at: '2023-05-29 14:14:02',
                  updated_at: null,
                  deleted_at: null,
                  status: 1,
                  category_id: 1,
                  sort: 1,
                },
                {
                  id: 1,
                  name: 'Công nợ chi tiết KH',
                  route: '/debit/ListChiTietKH',
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
            name: 'Nhà cung cấp',
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
                  name: 'Công nợ tổng hợp NCC',
                  route: '/debit/ListTongHopKH',
                  created_at: '2023-05-29 14:14:02',
                  updated_at: null,
                  deleted_at: null,
                  status: 1,
                  category_id: 1,
                  sort: 1,
                },
                {
                  id: 1,
                  name: 'Công nợ chi tiết NCC',
                  route: '/debit/ListChiTietNCC',
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
            name: 'Bù trừ công nợ',
            route: '/receipt/ListDoiTruCongNo',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Công nợ giao nhận',
            route: '/debit/ListDebitChiTietGiaoNhan',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Công nợ lái xe',
            route: '/debit/ListDebitChiTietLaiXe',
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
        name: 'Thủ quỹ',
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
        id: 1,
        name: 'Báo cáo',
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
            name: 'Báo cáo sổ quỹ tài khoản',
            route: '/receipt/ListBaoCaoTaiKhoan',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
         {
            id: 1,
            name: 'Báo cáo sổ quỹ tiền mặt',
            route: '/receipt/ListBaoCaoTienMat',
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
        name: 'Quỹ - Ngân Hàng',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        route: '/page-two',
        items: [
          {
              id: 5,
              name: 'Số dư tài khoản',
              route: '/receipt/ListDauKyTaiKhoan',
              category_id:1,
              sort: 1,
              status: 1,
              created_at: '2023-06-01 10:04:39',
              deleted_at: null,
              updated_at: null,
          },
          {
            id: 1,
            name: 'Phiếu thu',
            route: '/receipt/ListReceiptThu',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Phiếu chi',
            route: '/receipt/ListReceiptChi',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
           {
              id: 4,
              name: 'Chuyển tiền nội bộ',
              route: '/receipt/ListChuyenTienNoiBo',
              sort: 1,
              status: 1,
              created_at: '2023-06-01 10:04:39',
              deleted_at: null,
              updated_at: null,
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
          },
          {
            id: 1,
            name: 'Duyệt chi phí hải quan',
            route: '/ContractFile/list-confirm-bangke',
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
  const [data, setData] = useState<any>([]);
  const project = localStorage.getItem('project');
  const fetchProject = async () => {
    try {
      const res = await listStorage({});
      if (res?.data?.data?.data) {
        const _data = res.data.data.data.map((item: any) => ({
          name: item.name,
          projectId: item.id,
        }));
        setData(_data);
      }
    } catch (err) {} 
  };

  useEffect(() => {
    fetchProject();
  }, []);

  // khi data đã load xong → set selected
  useEffect(() => {
    if (data.length > 0) {
      if (project) {
        setSelectedCity(JSON.parse(project));
        localStorage.setItem('project', JSON.stringify(JSON.parse(project)))
        setSearchParams({ "projectId": JSON.parse(project).projectId})
      } else {
        setSelectedCity(data[0]);
        localStorage.setItem('project', JSON.stringify(data[0]))
        setSearchParams({ "projectId": data[0].projectId})
      }
    }
  }, [data]);
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
