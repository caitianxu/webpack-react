const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
//环境变量
const isDev = process.env.ENV_TYPE === "development";

let config = {
  target: "web", // 浏览器中运行
  entry: {
    // 工程入口
    app: path.resolve(__dirname, "../client/app.js")
  },
  output: {
    //输出文件格式
    filename: "[name][hash:5].js",
    //输出文路径
    path: path.resolve(__dirname, "../dist"),
    //一个CND标示， 在服务器渲染或路由等场景下非常有用 可以让工程区分静态文件
    publicPath: "/public/"
  },
  module: {
    rules: [
      {
        test: /.jsx$/,
        loader: "babel-loader"
      },
      {
        test: /.js$/,
        loader: "babel-loader",
        exclude: [path.resolve(__dirname, "../node_modules")]
      }
    ]
  },
  plugins: [
    // 生成默认启动的index.html
    new HTMLPlugin({
      template: path.resolve(__dirname, "../client/tamplate.html")
    })
  ]
};

//在开发环境和真实环境做不同的配置处理
if (isDev) {
  //指定热更新文件
  config.entry = {
    app: ["react-hot-loader/patch", path.resolve(__dirname, "../client/app.js")]
  };
  config.devServer = {
    host: "0.0.0.0", //域名
    port: "8888", //端口
    contentBase: path.resolve(__dirname, "../dist"), //路径
    hot: true,
    overlay: {
      errors: true //错误信息的网页中显示
    },
    publicPath: "/public", //指定静态文件全部加上CND路径
    historyApiFallback: {
      index: "/public/index.html" //单独指定首页访问路径， 或指定所有404内容全部指向index.html
    }
  };
  //启用热更新
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}
module.exports = config;
