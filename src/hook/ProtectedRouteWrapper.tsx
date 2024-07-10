"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useRouter, usePathname } from "next/navigation";
import { getUserFromSessionStorage } from "../redux/utils/handleUser";
import SpinnerLoading from "../components/loading/SpinnerLoading";
import AdminSpinnerLoading from "../components/loading/AdminSpinnerLoading";

interface Props {
  children: React.ReactNode;
}

const ProtectedRouteWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [userLogin, setUserLogin] = useUserLogin();
  const [isDataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const userFromSessionStorage = getUserFromSessionStorage();
      if (userFromSessionStorage) {
        setUserLogin(userFromSessionStorage);
      }
      setDataLoaded(true);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      isDataLoaded &&
      pathName !== "/" &&
      (!userLogin || !userLogin.role_name)
    ) {
      setDataLoaded(false);

      router.push("/");
      toast.error("Vui lòng đăng nhập trước.");
    }
  }, [isDataLoaded, pathName, userLogin]);

  if (!isDataLoaded) {
    return <AdminSpinnerLoading />;
  }

  return <>{children}</>;
};

export default ProtectedRouteWrapper;
