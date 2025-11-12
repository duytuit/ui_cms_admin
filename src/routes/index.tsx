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
import ListCreateDispatch from "modules/Debit/screen/index_debit_dispatch";
import ListFileGia from "modules/Debit/screen/index_debit_file_gia";
import ListContractFileBangKe from "modules/Debit/screen/index_debit_service";
import ListContractFileNangHa from "modules/Debit/screen/index_debit_service_nh";
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
import ListReceiptChiGiaoNhan from "modules/receipt/screen/index_chi_giao_nhan";
import ListReceipt from "modules/receipt/screen/index_chi_giao_nhan";
import Receipt from "modules/receipt/screen/index_chi_tam_ung";
import UpdateReceipt from "modules/receipt/screen/update";
import UpdateReceiptChiGiaoNhan from "modules/receipt/screen/update_chi_giao_nhan";
import Service from "modules/service/screen";
import UpdateService from "modules/service/screen/update";
import ListStorage from "modules/storage/screen";
import UpdateStorages from "modules/storage/screen/update";
import User from "modules/user/screen";
import ListVehicle from "modules/VehicleDispatch/screen";
import UpdateVehicle from "modules/VehicleDispatch/screen/update";
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
  { path: "/receipt/list", component: Receipt, layout: 'ListReceipt' },
  { path: "/receipt/add", component: UpdateReceipt, layout: 'UpdateReceipt' },
  { path: "/receipt/detail/:id", component: UpdateReceipt, layout: 'DetailReceipt' },

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
  { path: "/ContractFile/list-create-nangha", component: ListContractFileNangHa, layout: 'ListContractFileNangHa' },
  { path: "/ContractFile/list-create-dispatch", component: ListCreateDispatch, layout: 'ListCreateDispatch' },
  { path: "/ContractFile/list-create-filegia", component: ListFileGia, layout: 'ListFileGia' },
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
  { path: "/receipt/add", component: UpdateReceipt, layout: 'UpdateReceipt' },
  { path: "/receipt/listReceiptChiGiaoNhan", component: ListReceiptChiGiaoNhan, layout: 'ListReceiptChiGiaoNhan' },
  { path: "/receipt/updateReceiptChiGiaoNhan", component: UpdateReceiptChiGiaoNhan, layout: 'UpdateReceiptChiGiaoNhan' },
  { path: "/receipt/detail/chigiaonhan/:id", component: UpdateReceiptChiGiaoNhan, layout: 'UpdateReceiptChiGiaoNhan' },
  { path: "/receipt/detail/:id", component: UpdateReceipt, layout: 'DetailReceipt' },
  // Debit 
  // { path: "/debit/list", component: ListDebit, layout: 'ListDebit' },
  // { path: "/debit/add", component: UpdateDebit, layout: 'UpdateDebit' },
  // { path: "/debit/detail/:id", component: UpdateDebit, layout: 'UpdateDebit' },
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