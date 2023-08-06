import { AccessDeniedPage, ErrorPage } from "modules/auth/screen/DefaultPage";
import Loading from "modules/auth/screen/Loading";
import Login from "modules/auth/screen/login";
import Bill from "modules/bill/screen";
import UpdateBill from "modules/bill/screen/update";
import Categories from "modules/categories/screen";
import UpdateCategories from "modules/categories/screen/update";
import Customer from "modules/customer/screen";
import UpdateCustomer from "modules/customer/screen/update";
import DashBoard from "modules/dashboard/screen";
import PageOne from "modules/pageOne/screen";
import PageTwo from "modules/pageTwo/screen";
import UpdateCampaign from "modules/pageTwo/screen/update";
import Post from "modules/post/screen";
import Updatepost from "modules/post/screen/update";
import Product from "modules/product/screen";
import UpdateProduct from "modules/product/screen/update";
import Receipt from "modules/receipt/screen";
import UpdateReceipt from "modules/receipt/screen/update";
import Service from "modules/service/screen";
import UpdateService from "modules/service/screen/update";
const publicRoutes = [
    { path: "/", component: DashBoard  ,layout:'DashBoard'},
    { path: "/auth/login", component: Login, layout: null, public: true },
    { path: "/page-one", component:PageOne ,layout:'PageOne'},
    { path: "/page-two", component:PageTwo ,layout:'PageTwo'},
    { path: "/campaign/add", component:UpdateCampaign ,layout:'UpdateCampaign'},


     // categories 
     { path: "/categories/list", component:Categories ,layout:'ListCategories'},
     { path: "/categories/add", component:UpdateCategories ,layout:'AddCategories'},
     { path: "/categories/detail/:id", component:UpdateCategories ,layout:'UpdateCategories'},

     // product 
     { path: "/product/list", component:Product ,layout:'ListProduct'},
     { path: "/product/add", component:UpdateProduct ,layout:'UpdateProduct'},
     { path: "/product/detail/:id", component:UpdateProduct ,layout:'DetailProduct'},

     // service 
     { path: "/service/list", component:Service ,layout:'ListService'},
     { path: "/service/add", component:UpdateService ,layout:'UpdateService'},
     { path: "/service/detail/:id", component:UpdateService ,layout:'UpdateService'},

      // customer 
      { path: "/customer/list", component:Customer ,layout:'ListCustomer'},
      { path: "/customer/add", component:UpdateCustomer ,layout:'UpdateCustomer'},
      { path: "/customer/detail/:id", component:UpdateCustomer ,layout:'DetailCustomer'},

       // bill 
     { path: "/bill/list", component:Bill ,layout:'ListBill'},
     { path: "/bill/add", component:UpdateBill ,layout:'UpdateBill'},
     { path: "/bill/detail/:id", component:UpdateBill ,layout:'DetailBill'},

      // receipt 
      { path: "/receipt/list", component:Receipt ,layout:'ListReceipt'},
      { path: "/receipt/add", component:UpdateReceipt ,layout:'UpdateReceipt'},
      { path: "/receipt/detail/:id", component:UpdateReceipt ,layout:'DetailReceipt'},

       // post 
       { path: "/post/list", component:Post ,layout:'ListPost'},
       { path: "/post/add", component:Updatepost ,layout:'AddPost'},
       { path: "/post/detail/:id", component:Updatepost ,layout:'DetailPost'},


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