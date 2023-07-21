import Layout from 'layout';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from 'routes';
import { PublicRoutes } from 'routes/PrivateRoute';

const Main = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {
                        publicRoutes.map((route, index) => {
                            const DefaultLayout = route.layout === null ? Fragment : Layout;
                            const Page = route.component;
                            return <Route key={index} element={<PublicRoutes />}>
                                <Route path={route.path} element={<DefaultLayout><Page /></DefaultLayout>} />
                            </Route>
                        })
                    }
                    {/* <Route path={errorPage.path} element={<errorPage.component />} /> */}
                </Routes>
            </div>
        </Router>
    )
}

export default Main;