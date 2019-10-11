import { API, graphqlOperation } from "aws-amplify";
import BaseService from "./BaseService";
import { fetchMyProfile } from "./graphql/queries";

class ProfileService extends BaseService {
  async fetchMyProfile() {
    try {
      const profile = await API.graphql(graphqlOperation(fetchMyProfile));
      console.log("FETCHED PROFILE", profile.data.fetchMyProfile);
      return profile.data.fetchMyProfile;
    } catch (err) {
      console.error("COULD NOT FETCH PROFILE", err);
    }
  }
}

export const profileService = new ProfileService();
export default ProfileService;
