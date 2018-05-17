const express = require("express");
const ReactSSR = require("react-dom/server");
const fs = require("fs");
const path = require("path");
//环境变量
const isDev = process.env.ENV_TYPE === "development";
//创建服务对象
const app = express();

if (!isDev) {
  //require得到的是整个export对象。 想要拿到 default 内容需要.default
  const serverEntry = require("../dist/server.entry.js").default;
  //读取最终编译完成后的模板文件内容
  const template = fs.readFileSync(
    path.resolve(__dirname, "../dist/index.html"),
    "utf8"
  );
  //过滤|指定静态文件路径
  app.use("/public", express.static(path.resolve(__dirname, "../dist")));
  //获取服务端渲染内容
  app.get("*", function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry);
    res.send(template.replace("<!--APPTOOT-->", appString));
  });
} else {
  const devstatic = require("./util/dev.static.js");
}
//服务的配置
app.listen(3333, function () {
  console.log("===服务端渲染完成，浏览器打开：http://localhost:3333===");
});