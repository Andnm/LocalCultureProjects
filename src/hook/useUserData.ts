// useUserData.ts
import { useEffect, useState } from 'react';
import { UserType } from '@/src/types/user.type';
import { getUserFromSessionStorage } from '../redux/utils/handleUser';

export const useUserData = () => {
  const [userData, setUserData] = useState<UserType | null>(null);

  useEffect(() => {
    const user: UserType | null = getUserFromSessionStorage();
    setUserData(user);
  }, []);

  return userData;
};
