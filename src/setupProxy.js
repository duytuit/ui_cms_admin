const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "http://localhost:8091/",
      changeOrigin: true,
      onProxyReq: function (proxyReq) {
        proxyReq.setHeader("Accept", "application/json");
      },
      pathRewrite: {'/api' : '/'}
    })
  );
};
