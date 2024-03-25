"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

interface ButtonBackProps {
  functionBack?: any;
}

const ButtonBack: React.FC<ButtonBackProps> = ({ functionBack }) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (functionBack) {
      functionBack();
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      className="
       font-normal justify-start hover:bg-neutral-500/10 rounded-md
      cursor-pointer left-10 flex gap-2 items-center"
      onClick={handleGoBack}
    >
      <RiArrowGoBackLine />
      Quay lại
    </Button>
  );
};

export default ButtonBack;
