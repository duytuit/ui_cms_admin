import DashBoard from "modules/dashboard/screen";
const publicRoutes = [
    { path: "/", component: DashBoard ,layout:'DashBoard'},
    // { path: "/auth/login", component: Login, layout: null, public: true },
    // { path: "/auth/loading", component: Loading, layout: null, public: true },
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