import { profileService } from "../services/ProfileService";

export const FETCH_MY_PROFILE = "@@profile/fetch_my_profile";
export const RECEIVE_MY_PROFILE = "@@profile/receive_my_profile";

export function fetchMyProfile() {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_MY_PROFILE });

    const profile = (await profileService.fetchMyProfile()) as any;

    dispatch({
      type: RECEIVE_MY_PROFILE,
      profile
    });
  };
}
