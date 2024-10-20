import { GET, POST } from "./fetch-auth-action.ts";

export const signInApi = async (params) => {
  const URL = "/api/auth/login";
  const response = POST(URL, params, null);
  return response;
};

export const sendCodeApi = async (param) => {
  const URL = "/api/auth/verification/" + param;
  const response = GET(URL, null);
  return response;
};

export const passwordResetApi = async (param) => {
  const URL = "/api/auth/password/reset";
  const response = POST(URL, param, null);
  return response;
};

export const sendEmailApi = async (param) => {
  const URL = "/api/auth/emailCheck/" + param;
  const response = GET(URL, null);
  return response;
};

export const signUpApi = async (param) => {
  const URL = "/api/auth/signup";
  const response = POST(URL, param, null);
  return response;
};
