const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api', { 
    target: 'https://protected-wildwood-11173.herokuapp.com', 
    changeOrigin: true,
    pathRewrite: {
      '^/api': '' // URL ^/api -> 공백 변경
    }
  }));
};
