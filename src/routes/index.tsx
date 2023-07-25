import Loading from "modules/auth/screen/Loading";
import Login from "modules/auth/screen/login";
import DashBoard from "modules/dashboard/screen";
import PageOne from "modules/pageOne/screen";
import PageTwo from "modules/pageTwo/screen";
const publicRoutes = [
    { path: "/", component: DashBoard  ,layout:'DashBoard'},
    // { path: "/auth/login", component: Login, layout: null, public: true },
    { path: "/page-one", component:PageOne ,layout:'PageOne'},
    { path: "/page-two", component:PageTwo ,layout:'PageTwo'},
    // { path: "/auth/forgotpassword", component: ForgotPassword, layout: null, public: true },
    // { path: "/auth/verifyaccount", component: VerifyAccount, layout: null, public: true },
    // { path: "/auth/changepassword", component: ChangePassword, layout: null },
    // { path: "/auth/setpassword", component: SetPassword, layout: null, public: true },
    // { path: "/import_failed", component: ImportFailed, layout: null },
];

// const errorPage = { path: "*", component: ErrorPage, layout: null, public: true };
// const accessDeniedPage = { path: "*", component: AccessDeniedPage, layout: null, public: true };
// const loadingPage = { path: "*", component: Loading, layout: null, public: true };

export {
    publicRoutes,
    // accessDeniedPage,
    // errorPage,
    // loadingPage
}