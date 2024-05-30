import { gql } from "@dzangolab/fastify-mercurius";

const notificationSchema = gql`
  type SendNotificationResponse {
    message: String!
  }

  input SendNotificationInput {
    userId: String!
    title: String!
    body: String!
  }

  type Mutation {
    sendNotification(data: SendNotificationInput): SendNotificationResponse
      @auth
  }
`;

export default notificationSchema;
