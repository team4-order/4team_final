module.exports = {
  devServer: {
    proxy: {
      '/navelogin': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: { '^/navelogin': '' }
      }
    }
  }
}

