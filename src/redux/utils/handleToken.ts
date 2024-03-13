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

//decode token to user info
export const decodeTokenToUser = (token: string): any | null => {
  const user: UserType = jwtDecode(token);
  saveTokenToSessionStorage(token);

  return user;
};
