import { FETCH_MY_PROFILE, RECEIVE_MY_PROFILE } from "../actions";

const initialState = {
  sub: "",
  email: "",
  firstName: "",
  lastName: "",
  fetching: true
};

interface UserRow {
  PK?: String;
  SK?: String;
  email?: String;
  firstName?: String;
  lastName?: String;
}
function profile(state = initialState, action: any) {
  let user: UserRow = {};
  const { profile } = action;

  if (profile) {
    user = profile.find(
      (row: UserRow) => row.SK && row.SK.substring(0, 4) === "user"
    );
  }
  switch (action.type) {
    case FETCH_MY_PROFILE:
      return Object.assign({}, state, {
        fetching: true
      });
    case RECEIVE_MY_PROFILE:
      console.log(action);
      return Object.assign({}, state, {
        sub: user.PK ? user.PK.substring(4) : "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        fetching: false
      });
    default:
      return state;
  }
}

export default profile;
