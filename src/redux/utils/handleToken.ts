import { jwtDecode } from "jwt-decode";
import { UserType } from "@/src/types/user.type";

//handle Token in session
export const saveTokenToSessionStorage = (token: string): void => {
  sessionStorage.setItem("token", JSON.stringify(token));
};

export const removeTokenFromSessionStorage = (): void => {
  sessionStorage.removeItem("token");
};

export const getTokenFromSessionStorage = (): string | null => {
  const tokenString = sessionStorage?.getItem("token");
  const token = tokenString ? JSON.parse(tokenString) : null;
  return token;
};

export const getConfigHeader = () => {
  const token = getTokenFromSessionStorage();
  const configHeader = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return configHeader;
};

export const getConfigHeaderMultipartFormData = () => {
  const token = getTokenFromSessionStorage();
  const configHeader = {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };

  return configHeader;
};

//decode token to user info
export const decodeTokenToUser = (token: string): any | null => {
  const user: UserType = jwtDecode(token);
  saveTokenToSessionStorage(token);

  return user;
};
