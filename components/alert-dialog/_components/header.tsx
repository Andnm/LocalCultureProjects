"use client";

import { FormInput } from "@/src/components/form/FormInput";
import { Layout } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const [nameCategory, setNameCategory] = React.useState(title);
  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div
        className="font-semibold text-xl px-1 text-neutral-700
          bg-transparent border-transparent relative -left-1.5 w-[95%] 
          focus-visible:bg-while focus-visible:border-input mb-0.5 truncate"
      >
        {nameCategory}
      </div>
    </div>
  );
};
