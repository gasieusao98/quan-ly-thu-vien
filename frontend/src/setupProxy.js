const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:10000',  // ← Sửa từ 5000 thành 10000
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          error: 'Proxy error', 
          message: 'Backend server might be down' 
        }));
      }
    })
  );
  
  // Proxy cho uploads
  app.use(
    '/uploads',
    createProxyMiddleware({
      target: 'http://localhost:10000',  // ← Sửa từ 5000 thành 10000
      changeOrigin: true,
    })
  );
};