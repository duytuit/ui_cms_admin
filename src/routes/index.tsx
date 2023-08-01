import { AccessDeniedPage, ErrorPage } from "modules/auth/screen/DefaultPage";
import Loading from "modules/auth/screen/Loading";
import Login from "modules/auth/screen/login";
import Categories from "modules/categories/screen";
import UpdateCategories from "modules/categories/screen/update";
import DashBoard from "modules/dashboard/screen";
import PageOne from "modules/pageOne/screen";
import PageTwo from "modules/pageTwo/screen";
import UpdateCampaign from "modules/pageTwo/screen/update";
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
     { path: "/product/list", component:UpdateCampaign ,layout:'UpdateCampaign'},
     { path: "/product/add", component:UpdateCampaign ,layout:'UpdateCampaign'},
     { path: "/product/detail/:id", component:UpdateCampaign ,layout:'UpdateCampaign'},

     // service 
     { path: "/service/list", component:UpdateCampaign ,layout:'UpdateCampaign'},
     { path: "/service/add", component:UpdateCampaign ,layout:'UpdateCampaign'},
     { path: "/service/detail/:id", component:UpdateCampaign ,layout:'UpdateCampaign'},


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