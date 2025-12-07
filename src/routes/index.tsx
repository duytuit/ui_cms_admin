import { AccessDeniedPage, ErrorPage } from "modules/auth/screen/DefaultPage";
import Loading from "modules/auth/screen/Loading";
import Login from "modules/auth/screen/login";
import Bill from "modules/bill/screen";
import UpdateBill from "modules/bill/screen/update";
import Categories from "modules/categories/screen";
import UpdateCategories from "modules/categories/screen/update";
import ListContractFile from "modules/ContractFile/screen";
import UpdateContractFile from "modules/ContractFile/screen/update";
import Customer from "modules/customer/screen";
import UpdateCustomer from "modules/customer/screen/update";
import DashBoard from "modules/dashboard/screen";
import ListConfirmFileGia from "modules/Debit/screen/index_confirm_debit_file_gia";
import ListCuoc from "modules/Debit/screen/index_cuoc";
import ListDauKyKh from "modules/Debit/screen/index_dauky_kh";
import ListDauKyNcc from "modules/Debit/screen/index_dauky_ncc";
import ListCreateDispatch from "modules/Debit/screen/index_debit_dispatch";
import ListFileGia from "modules/Debit/screen/index_debit_file_gia";
import ListContractFileBangKe from "modules/Debit/screen/index_debit_service";
import ListContractFileNangHa from "modules/Debit/screen/index_debit_service_nh";
import ListTamThu from "modules/Debit/screen/index_tamthu";
import UpdateDauKyKh from "modules/Debit/screen/update_dauky_kh";
import UpdateDauKyNCC from "modules/Debit/screen/update_dauky_ncc";
import ListDepartment from "modules/department/screen";
import UpdateDepartment from "modules/department/screen/update";
import ListEmployee from "modules/employee/screen";
import UpdateEmployee from "modules/employee/screen/update";
import PageOne from "modules/pageOne/screen";
import PageTwo from "modules/pageTwo/screen";
import UpdateCampaign from "modules/pageTwo/screen/update";
import ListPartner from "modules/partner/screen";
import UpdatePartner from "modules/partner/screen/update";
import Post from "modules/post/screen";
import Updatepost from "modules/post/screen/update";
import Product from "modules/product/screen";
import UpdateProduct from "modules/product/screen/update";
import ListReceipt from "modules/receipt/screen/index_chi";
import ListChiPhiGiaoNhan from "modules/receipt/screen/index_xn_chiphi_giaonhan";
import UpdateReceiptChiGiaoNhan from "modules/receipt/screen/update_chi_giao_nhan";
import Service from "modules/service/screen";
import UpdateService from "modules/service/screen/update";
import ListStorage from "modules/storage/screen";
import UpdateStorages from "modules/storage/screen/update";
import User from "modules/user/screen";
import ListVehicle from "modules/VehicleDispatch/screen";
import UpdateVehicle from "modules/VehicleDispatch/screen/update";
import UpdateImportExcel from "modules/partner/screen/updateImportExcel";
import ListTongHopKH from "modules/Debit/screen/index_tonghop_kh";
import ListChiTietKH from "modules/Debit/screen/index_chitiet_kh";
import ListDebitNoFileKH from "modules/Debit/screen/index_debit_no_file_kh";
import UpdateMuaHang from "modules/Debit/screen/update_muahang";
import ListMuaHang from "modules/Debit/screen/index_muahang";
import ListBanHang from "modules/Debit/screen/index_banhang";
import UpdateBanHang from "modules/Debit/screen/update_banhang";
import ListViewChiPhiGiaoNhan from "modules/receipt/screen/index_view_chiphi_giaonhan";
import UpdateImportDauKy from "modules/Debit/screen/imports/updateImportDauKy";
import PrintDebit from "modules/Debit/screen/exports/print_debit";
import UpdateImportDauKyNCC from "modules/Debit/screen/imports/updateImportDauKyNCC";
import ListChiTietNCC from "modules/Debit/screen/index_chitiet_ncc";
import ListReceiptThu from "modules/receipt/screen/index_thu";
import ListReceiptChi from "modules/receipt/screen/index_chi";
import UpdateReceiptChiNoiBo from "modules/receipt/screen/update_chi_noibo";
import ListConfirmContractFileBangKe from "modules/Debit/screen/index_confirm_debit_service";
import PrintDebitNoFile from "modules/Debit/screen/exports/print_debit_no_file";
import ListChuyenTienNoiBo from "modules/receipt/screen/index_chuyentien_noibo";
import UpdateChuyenTienNoiBo from "modules/receipt/screen/update_chuyentien_noibo";
import ListDebitChiTietGiaoNhan from "modules/Debit/screen/index_chitiet_giaonhan";
import ListDebitChiTietLaiXe from "modules/Debit/screen/index_chitiet_laixe";
import ListDoiTruCongNo from "modules/receipt/screen/index_doitru_congno";
import UpdateDoiTruCongNo from "modules/receipt/screen/update_doitru_congno";
const publicRoutes = [
  { path: "/", component: DashBoard, layout: 'DashBoard' },
  { path: "/auth/login", component: Login, layout: null, public: true },
  { path: "/page-one", component: PageOne, layout: 'PageOne' },
  { path: "/page-two", component: PageTwo, layout: 'PageTwo' },
  { path: "/campaign/add", component: UpdateCampaign, layout: 'UpdateCampaign' },

  // categories 
  { path: "/categories/list", component: Categories, layout: 'ListCategories' },
  { path: "/categories/add", component: UpdateCategories, layout: 'AddCategories' },
  { path: "/categories/detail/:id", component: UpdateCategories, layout: 'UpdateCategories' },

  // product 
  { path: "/product/list", component: Product, layout: 'ListProduct' },
  { path: "/product/add", component: UpdateProduct, layout: 'UpdateProduct' },
  { path: "/product/detail/:id", component: UpdateProduct, layout: 'DetailProduct' },

  // service 
  { path: "/service/list", component: Service, layout: 'ListService' },
  { path: "/service/add", component: UpdateService, layout: 'UpdateService' },
  { path: "/service/detail/:id", component: UpdateService, layout: 'UpdateService' },

  // customer 
  { path: "/customer/list", component: Customer, layout: 'ListCustomer' },
  { path: "/customer/add", component: UpdateCustomer, layout: 'UpdateCustomer' },
  { path: "/customer/detail/:id", component: UpdateCustomer, layout: 'DetailCustomer' },

  // bill 
  { path: "/bill/list", component: Bill, layout: 'ListBill' },
  { path: "/bill/add", component: UpdateBill, layout: 'UpdateBill' },
  { path: "/bill/detail/:id", component: UpdateBill, layout: 'DetailBill' },

  // receipt 

  // post 
  { path: "/post/list", component: Post, layout: 'ListPost' },
  { path: "/post/add", component: Updatepost, layout: 'AddPost' },
  { path: "/post/detail/:id", component: Updatepost, layout: 'DetailPost' },
  // post category
  { path: "/user/list", component: User, layout: 'ListUser' },

  // storage 
  { path: "/storage/list", component: ListStorage, layout: 'ListStorage' },
  { path: "/storage/add", component: UpdateStorages, layout: 'UpdateStorage' },
  { path: "/storage/detail/:id", component: UpdateStorages, layout: 'DetailStorage' },
   // employee 
  { path: "/employee/list", component: ListEmployee, layout: 'ListEmployee' },
  { path: "/employee/add", component: UpdateEmployee, layout: 'UpdateEmployee' },
  { path: "/employee/detail/:id", component: UpdateEmployee, layout: 'UpdateEmployee' },
   // partner 
  { path: "/partner/list", component: ListPartner, layout: 'ListPartner' },
  { path: "/partner/add", component: UpdatePartner, layout: 'UpdatePartner' },
  { path: "/partner/detail/:id", component: UpdatePartner, layout: 'UpdatePartner' },
  // ContractFile 
  { path: "/ContractFile/list", component: ListContractFile, layout: 'ListContractFile' },
  { path: "/ContractFile/list-create-bangke", component: ListContractFileBangKe, layout: 'ListContractFileBangKe' },
  { path: "/ContractFile/list-confirm-bangke", component: ListConfirmContractFileBangKe, layout: 'ListConfirmContractFileBangKe' },
  { path: "/ContractFile/list-create-nangha", component: ListContractFileNangHa, layout: 'ListContractFileNangHa' },
  { path: "/ContractFile/list-create-dispatch", component: ListCreateDispatch, layout: 'ListCreateDispatch' },
  { path: "/ContractFile/list-create-filegia", component: ListFileGia, layout: 'ListFileGia' },
  { path: "/ContractFile/list-confirm-filegia", component: ListConfirmFileGia, layout: 'ListConfirmFileGia' },
  { path: "/ContractFile/add", component: UpdateContractFile, layout: 'UpdateContractFile' },
  { path: "/ContractFile/detail/:id", component: UpdateContractFile, layout: 'UpdateContractFile' },
  // Vehicle 
  { path: "/vehicle/list", component: ListVehicle, layout: 'ListVehicle' },
  { path: "/vehicle/add", component: UpdateVehicle, layout: 'UpdateVehicle' },
  { path: "/vehicle/detail/:id", component: UpdateVehicle, layout: 'UpdateVehicle' },
   // Vehicle 
  { path: "/department/list", component: ListDepartment, layout: 'ListDepartment' },
  { path: "/department/add", component: UpdateDepartment, layout: 'UpdateDepartment' },
  { path: "/department/detail/:id", component: UpdateDepartment, layout: 'UpdateDepartment' },
  // Receipt 
  { path: "/receipt/list", component: ListReceipt, layout: 'ListReceipt' },
  { path: "/receipt/ListReceiptThu", component: ListReceiptThu, layout: 'ListReceiptThu' },
  { path: "/receipt/ListReceiptChi", component: ListReceiptChi, layout: 'ListReceiptChi' },
  { path: "/receipt/listChiPhiGiaoNhan", component: ListChiPhiGiaoNhan, layout: 'ListChiPhiGiaoNhan' },
  { path: "/receipt/listViewChiPhiGiaoNhan", component: ListViewChiPhiGiaoNhan, layout: 'ListViewChiPhiGiaoNhan' },
  { path: "/receipt/updateReceiptChiNoiBo", component: UpdateReceiptChiNoiBo, layout: 'UpdateReceiptChiNoiBo' },
  { path: "/receipt/detail/chinoibo/:id", component: UpdateReceiptChiNoiBo, layout: 'UpdateReceiptChiNoiBo' },
  { path: "/receipt/updateReceiptChiGiaoNhan", component: UpdateReceiptChiGiaoNhan, layout: 'UpdateReceiptChiGiaoNhan' },
  { path: "/receipt/detail/chigiaonhan/:id", component: UpdateReceiptChiGiaoNhan, layout: 'UpdateReceiptChiGiaoNhan' },
  { path: "/receipt/ListChuyenTienNoiBo", component: ListChuyenTienNoiBo, layout: 'ListChuyenTienNoiBo' },
  { path: "/receipt/UpdateChuyenTienNoiBo", component: UpdateChuyenTienNoiBo, layout: 'UpdateChuyenTienNoiBo' },
  { path: "/receipt/detail/chuyentiennoibo/:id", component: UpdateChuyenTienNoiBo, layout: 'UpdateChuyenTienNoiBo' },
  { path: "/receipt/ListDoiTruCongNo", component: ListDoiTruCongNo, layout: 'ListDoiTruCongNo' },
  { path: "/receipt/UpdateDoiTruCongNo", component: UpdateDoiTruCongNo, layout: 'UpdateDoiTruCongNo' },
  // Debit 
  { path: "/debit/listCuoc", component: ListCuoc, layout: 'ListCuoc' },
  { path: "/debit/listTamThu", component: ListTamThu, layout: 'ListTamThu' },
  { path: "/debit/ListDauKyKh", component: ListDauKyKh, layout: 'ListDauKyKh' },
  { path: "/debit/addDauKyKh", component: UpdateDauKyKh, layout: 'UpdateDauKyKh' },
  { path: "/debit/UpdateImportDauKy", component: UpdateImportDauKy, layout: 'UpdateImportDauKy' },
  { path: "/debit/UpdateImportDauKyNCC", component: UpdateImportDauKyNCC, layout: 'UpdateImportDauKyNCC' },
  { path: "/debit/detailDauKyKh/:id", component: UpdateDauKyKh, layout: 'UpdateDauKyKh' },
  { path: "/debit/ListDauKyNcc", component: ListDauKyNcc, layout: 'ListDauKyNcc' },
  { path: "/debit/addDauKyNCC", component: UpdateDauKyNCC, layout: 'UpdateDauKyNCC' },
  { path: "/debit/detailDauKyNCC/:id", component: UpdateDauKyNCC, layout: 'UpdateDauKyNCC' },
  { path: "/debit/ListDebitNoFileKH", component: ListDebitNoFileKH, layout: 'ListDebitNoFileKH' },

  { path: "/debit/ListMuaHang", component: ListMuaHang, layout: 'ListMuaHang' },
  { path: "/debit/UpdateMuaHang", component: UpdateMuaHang, layout: 'UpdateMuaHang' },
  { path: "/debit/detailMuaHang/:id", component: UpdateMuaHang, layout: 'UpdateMuaHang' },

  { path: "/debit/ListBanHang", component: ListBanHang, layout: 'ListBanHang' },
  { path: "/debit/UpdateBanHang", component: UpdateBanHang, layout: 'UpdateBanHang' },
  { path: "/debit/detailBanHang/:id", component: UpdateBanHang, layout: 'UpdateBanHang' },
  { path: "/debit/print", component: PrintDebit,  layout: null, public: true  },
  { path: "/debit/printNoFile", component: PrintDebitNoFile,  layout: null, public: true  },

  //công nợ khách hàng
  { path: "/debit/ListTongHopKH", component: ListTongHopKH, layout: 'ListTongHopKH' },
  { path: "/debit/ListChiTietKH", component: ListChiTietKH, layout: 'ListChiTietKH' },
  { path: "/debit/ListChiTietNCC", component: ListChiTietNCC, layout: 'ListChiTietNCC' },
  { path: "/debit/ListDebitChiTietGiaoNhan", component: ListDebitChiTietGiaoNhan, layout: 'ListDebitChiTietGiaoNhan' },
  { path: "/debit/ListDebitChiTietLaiXe", component: ListDebitChiTietLaiXe, layout: 'ListDebitChiTietLaiXe' },

  
  { path: "/user/inportExcelPartner", component: UpdateImportExcel, layout: 'UpdateImportExcel' },

  //{ path: "/debit/detail/:id", component: UpdateDebit, layout: 'UpdateDebit' },
  // { path: "/auth/forgotpassword", component: ForgotPassword, layout: null, public: true },
  // { path: "/auth/verifyaccount", component: VerifyAccount, layout: null, public: true },
  // { path: "/auth/changepassword", component: ChangePassword, layout: null },
  // { path: "/auth/setpassword", component: SetPassword, layout: null, public: true },
  // { path: "/import_failed", component: ImportFailed, layout: null },
];

const errorPage = { path: "*", component: ErrorPage, layout: null, public: true };
const accessDeniedPage = { path: "*", component: AccessDeniedPage, layout: null, public: true };
const loadingPage = { path: "*", component: Loading, layout: null, public: true };

export {
  publicRoutes,
  accessDeniedPage,
  errorPage,
  loadingPage
}