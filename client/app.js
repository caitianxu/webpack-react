import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import App from "./App.jsx";

const root = document.getElementById("root");
const render = Component => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  );
};
render(App);

//判断是否有热更新
if (module.hot) {
  module.hot.accept("./App.jsx", () => {
    const NextApp = require("./App.jsx").default;
    render(NextApp);
  });
}
