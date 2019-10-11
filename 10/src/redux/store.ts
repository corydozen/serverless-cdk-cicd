import { createBrowserHistory } from "history";
import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import monitorReducersEnhancer from "./enhancers/monitorReducers";
import loggerMiddleware from "./middleware/logger";
import createRootReducer from "./reducers";

export const history = createBrowserHistory();

export default function configureStore(preloadedState = {}) {
  const middlewares: any[] = [thunkMiddleware];

  if (process.env.NODE_ENV === "development") {
    middlewares.push(loggerMiddleware);
  }

  const middlewareEnhancer = applyMiddleware(
    routerMiddleware(history),
    ...middlewares
  );

  const enhancers: any[] = [middlewareEnhancer, monitorReducersEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composedEnhancers
  );

  if (process.env.NODE_ENV !== "production" && (module as any).hot) {
    (module as any).hot.accept("./reducers", () =>
      store.replaceReducer(createRootReducer(history))
    );
  }

  return store;
}
