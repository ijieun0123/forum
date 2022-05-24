
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/', { 
    target: 'http://localhost:5000', 
    changeOrigin: true,
  }));
};

/*
const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(proxy("/", { target: "http://localhost:5000" }));
};
*/