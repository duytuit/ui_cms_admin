import { Dropdown } from 'primereact/dropdown';
import MenuSidebar from './MenuSidebar';
import { MenuProvider } from './context/menuContext';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { listByUserIdStorage, listStorage } from 'modules/storage/api';
import { listPermission } from 'modules/permission/api';
import { setPermission } from 'redux/features/permission';
export const sidebarModel = [{
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
        admin:false,
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
        admin:false,
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
            name: 'Phiếu cược',
            route: '/debit/ListCuocKeToan',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Phiếu tạm thu',
            route: '/debit/ListTamThuKeToan',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Tính lương',
            route: '/salary/list',
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
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
            name: 'Danh sách tạm thu',
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
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
                  route: '/debit/ListTongHopNCC',
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
        name: 'Theo dõi nhắc nợ',
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
        items: [
          {
            id: 1,
            name: 'Kỳ công nợ KH',
            route: '/debit/ListKyCongNoKH',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Nhắc nợ KH',
            route: '/debit/ListNhacNoKH',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
            id: 1,
            name: 'Kỳ công nợ NCC',
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
            name: 'Nhắc nợ NCC',
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
        name: 'Thủ quỹ',
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
        created_at: '2023-05-29 14:14:02',
        updated_at: null,
        deleted_at: null,
        status: 1,
        category_id: 1,
        sort: 1,
        icon: 'pi pi-home',
        admin:false,
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
          },
         {
            id: 1,
            name: 'Báo cáo kết quả kinh doanh',
            route: '/receipt/ListBaoCaoLoiNhuan',
            created_at: '2023-05-29 14:14:02',
            updated_at: null,
            deleted_at: null,
            status: 1,
            category_id: 1,
            sort: 1,
          },
          {
              id: 1,
              name: 'Báo cáo lưu chuyển tiền tệ',
              route: '/receipt/ListBaoCaoLuuChuyenTienTe',
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
        admin:false,
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
        admin:false,
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
        name: 'Phân quyền',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        admin:false,
          items: [
            {
              id: 1,
              name: 'Danh sách quyền',
              route: '/permission',
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
        name: 'Quản lý',
        sort: 1,
        status: 1,
        created_at: '2023-06-01 10:04:39',
        deleted_at: null,
        updated_at: null,
        icon: 'pi pi-home',
        admin:false,
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
        icon: 'pi pi-home',
        admin:true,
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
        admin:true,
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
          }
        ]
      }
    ]
}];
export default function AppSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [permission, setPermission] = useState<any[]>([]);

  const employeeInfo = localStorage.getItem("employeeInfo")
    ? JSON.parse(localStorage.getItem("employeeInfo") || "{}")
    : null;

  // =========================
  // 1) Fetch project list
  // =========================
  const fetchProject = async (userId: number) => {
    try {
      let res: any;

      if ([280].includes(employeeInfo?.user_id)) {
        res = await listStorage({});
      } else {
        res = await listByUserIdStorage({ UserId: userId });
      }

      if (res?.data?.data?.data) {
        const _data = res.data.data.data.map((item: any) => ({
          name: item.name,
          projectId: item.id,
        }));

        setData(_data);
        return _data;
      }

      setData([]);
      return [];
    } catch (err) {
      setData([]);
      return [];
    }
  };

  // =========================
  // 2) Set selected project
  // =========================
  const applyDefaultProject = (projects: any[]) => {
    if (!projects || projects.length === 0) return null;

    const _project = JSON.parse(localStorage.getItem("project") || "{}");
    const dataProjectIds = projects.map((x: any) => x.projectId);

    let selected: any = null;

    if (_project && dataProjectIds.includes(_project.projectId)) {
      selected = _project;
    } else {
      selected = projects[0];
      localStorage.setItem("project", JSON.stringify(selected));
    }

    setSelectedCity(selected);
    setSearchParams({ projectId: selected.projectId });

    return selected;
  };

  // =========================
  // 3) Get permission
  // =========================
  const getPermission = async (userId: number) => {
    try {
      const res = await listPermission({ UserId: userId });
      if (res?.data?.data) {
        setPermission(res.data.data);
      }
    } catch (err) {}
  };

  // =========================
  // Run đúng thứ tự
  // =========================
  useEffect(() => {
    const run = async () => {
      if (!employeeInfo?.user_id) return;

      // 1) fetchProject
      const projects = await fetchProject(employeeInfo.user_id);

      // 2) set selected + setSearchParams trước
      applyDefaultProject(projects);

      // 3) rồi mới getPermission
      await getPermission(employeeInfo.user_id);
    };

    run();
  }, []);

  // =========================
  // OnChange project
  // =========================
  const onChange = (event: any) => {
    setSelectedCity(event.value);
    localStorage.setItem("project", JSON.stringify(event.value));
    setSearchParams({ projectId: event.value.projectId });

    window.location.reload();
  };

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
        {sidebarModel.map((item: any, i) => {
          return <MenuSidebar item={item} root={true} index={i} key={i} />;
        })}
      </ul>
    </MenuProvider>
  );
}
