import React from "react";
import { getUserFromSessionStorage } from "../redux/utils/handleUser";
import { UserType } from "../types/user.type";

export const useUserLogin = (): [
  UserType | undefined,
  React.Dispatch<React.SetStateAction<UserType | undefined>>
] => {
  const [userLogin, setUserLogin] = React.useState<UserType | undefined>(
    undefined
  );

  React.useEffect(() => {
    const userFromSessionStorage = getUserFromSessionStorage();
    if (userFromSessionStorage) {
      setUserLogin(userFromSessionStorage);
    }
  }, []);

  return [userLogin, setUserLogin];
};
