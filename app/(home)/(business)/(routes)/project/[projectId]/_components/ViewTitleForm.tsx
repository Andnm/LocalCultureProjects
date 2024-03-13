"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ProjectType } from "@/src/types/project.type";

interface BoardTitleFormProps {
  dataProject?: ProjectType;
}

export const ViewTitleForm = () => {
  return <Button className="font-bold text-lg h-auto w-auto p-1 px-2"></Button>;
};


