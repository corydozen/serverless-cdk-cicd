export class BaseService {
  recoverGraphQLFailure(graphqlError: any) {
    if (graphqlError.data) {
      return graphqlError;
    }

    throw graphqlError;
  }
}

export default BaseService;
