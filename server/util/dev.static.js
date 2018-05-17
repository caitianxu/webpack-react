const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const ReactDomServer = require("react-dom/server");
const serverConfig = require('../../build/webpack.config.server')

const MemoryFs = require('memory-fs')
const mfs = new MemoryFs();
const Module = module.constructor;
let serverBundle;

//获取服务端渲染，的html内容结构
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get("http://localhost:8888/public.index.html").then(res => {
      resolve(res.data);
    }).catch(reject);
  });
}

const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = mfs;
//监听服务器渲染内容变化
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err));
  stats.warnings.forEach(warn => console.warn(warn));
  //获取服务输出文件路径
  const bundlePath = path.resolve(serverConfig.output.path, serverConfig.output.filename);
  //读取文件内容
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  const m = new Module();
  m._compile(bundle,'server.entry.js');
  serverBundle = m.default;
})

module.exports = function (app) {
  //获取服务器渲染内容 并传递到容器
  app.get("*", function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle);
      res.send(template.replace("<!--APPTOOT-->", content));
    });
  })
}