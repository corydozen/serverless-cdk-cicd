import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";

// First party
import AppWithAuth from "./AppWithAuth";
import configureStore, { history } from "./redux/store";
import * as serviceWorker from "./serviceWorker";

const store = configureStore();

const renderApp = () => {
  render(
    <Provider store={store}>
      <AppWithAuth history={history} />
    </Provider>,
    document.getElementById("root")
  );
};

if (process.env.NODE_ENV !== "production" && (module as any).hot) {
  (module as any).hot.accept("./AppWithAuth", renderApp);
}

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
