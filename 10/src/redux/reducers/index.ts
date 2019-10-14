import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import app from "./app";
import profile from "./profile";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    app,
    profile
  });
