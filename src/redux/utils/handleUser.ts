import { UserType } from "@/src/types/user.type";

export const saveUserToSessionStorage = (user: UserType): void => {
  sessionStorage.setItem("user", JSON.stringify(user));
};

export const getUserFromSessionStorage = (): UserType | null => {
  const userString = sessionStorage.getItem("user");
  return userString ? JSON.parse(userString) : null;
};

export const removeUserFromSessionStorage = (): void => {
  sessionStorage.removeItem("user");
};
