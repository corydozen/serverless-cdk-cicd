import { combineReducers } from "redux";

const initialState = {
  fileToEdit: "src/App.tsx"
};

function core(state = initialState, action: string) {
  return state;
}

export default combineReducers({ core });
