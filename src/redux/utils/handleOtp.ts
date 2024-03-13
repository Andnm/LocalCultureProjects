import { OtpType } from "@/src/types/otp.type";

export const saveOtpToSessionStorage = (user: OtpType): void => {
  sessionStorage.setItem("otp", JSON.stringify(user));
};

export const getOtpFromSessionStorage = (): OtpType | null => {
  const otpString = sessionStorage.getItem("otp");
  return otpString ? JSON.parse(otpString) : null;
};

export const removeOtpFromSessionStorage = (): void => {
  sessionStorage.removeItem("otp");
};
