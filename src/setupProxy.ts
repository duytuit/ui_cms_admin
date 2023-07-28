const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app:any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      changeOrigin: true,
      onProxyReq: function (proxyReq:any) {
        proxyReq.setHeader("Accept", "application/json");
      },
      pathRewrite: {'/api' : '/'}
    })
  );
};
// export {}