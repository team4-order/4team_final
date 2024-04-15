const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
      transpileDependencies: true,
      devServer: {
    proxy: {
        "/ROOT" : {
            target : 'http://localhost:8081/',
            changeOrigin : true,
            logLevel : 'debug'
        },
        "/oauth2.0": {
          target: "https://nid.naver.com/",
          changeOrigin: true,
          logLevel: "debug",
            'secure':false
          /*pathRewrite: {
            "/oauth2.0": "https://nid.naver.com/oauth2.0",
          }*/
        },
        "/v1": {
          target: "https://openapi.naver.com/",
          changeOrigin: true,
          logLevel: "debug",
            'secure':false
          /* pathRewrite: {
             "/v1": "https://openapi.naver.com/v1",
           }*/
        },
      }
    }
  })
