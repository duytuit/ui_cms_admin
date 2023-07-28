const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app:any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "http://103.237.144.38:8091/",
      changeOrigin: true,
      onProxyReq: function (proxyReq:any) {
        proxyReq.setHeader("Accept", "application/json");
      },
      pathRewrite: {'/api' : '/'}
    })
  );
};
