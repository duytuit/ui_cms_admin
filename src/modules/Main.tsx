import Layout from 'layout';
import { LayoutProvider } from 'layout/context/layoutContext';
import React, { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { errorPage, publicRoutes } from 'routes';
import { PrivateRoutes, PublicRoutes } from 'routes/PrivateRoute';

const Main = () => {
    return (
      <Router>
        <div className="App">
          <Routes>
            {publicRoutes.map((route, index) => {
              const DefaultLayout = route.layout === null ? Fragment : Layout;
              const Page = route.component;
              if (route.public)
                return (
                  <Route key={index} element={<PublicRoutes />}>
                    <Route
                      path={route.path}
                      element={
                          <Page />
                      }
                    />
                  </Route>
                );
                return (
                  <Route key={index} element={<PrivateRoutes />}>
                    <Route
                      path={route.path}
                      element={
                        <LayoutProvider>
                          <DefaultLayout>
                            <Page />
                          </DefaultLayout>
                        </LayoutProvider>
                      }
                    />
                  </Route>
                );
            })}
            <Route path={errorPage.path} element={<errorPage.component />} />
          </Routes>
        </div>
      </Router>
    );
}

export default Main;