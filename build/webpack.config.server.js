const path = require("path");

let config = {
  target: "node", //nodejs中环境运行
  entry: {
    // 工程入口
    app: path.resolve(__dirname, "../client/server.entry.js")
  },
  output: {
    //输出文件格式
    filename: "server.entry.js",
    //输出文路径
    path: path.resolve(__dirname, "../dist"),
    //一个CND标示， 在服务器渲染或路由等场景下非常有用 可以让工程区分静态文件
    publicPath: "/public",
    //打包js时使用的配置方案
    libraryTarget: "commonjs2"
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
  }
};
module.exports = config;
