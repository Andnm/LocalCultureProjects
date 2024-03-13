"use client";

import React from "react";
import BusinessGroupPage from "./_components/BusinessGroupPage";
import { useParams } from "next/navigation";

const GroupPage = () => {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <BusinessGroupPage projectId={parseInt(projectId, 10)}></BusinessGroupPage>
  );
};

export default GroupPage;
