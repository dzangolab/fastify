// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getInvitationLink = (appId: number, token: string): string => {
  // [DU 2023-JUL-07] Todo:  Get details from app table or from config
  return `http://localhost:20074/register/token/${token}`;
};

export default getInvitationLink;
