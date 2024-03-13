"use client";

import { PhaseType } from "@/src/types/phase.type";
import React from "react";
import ListForm from "./PhaseForm";
import ListPhases from "./ListPhases";
import { useUserLogin } from "@/src/hook/useUserLogin";

interface ListPhaseContainerProps {
  project: any;
  projectId: number;
  groupId: number;
  phaseData: PhaseType[];
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
}

const ListPhaseContainer = ({
  project,
  projectId,
  groupId,
  phaseData,
  setPhaseData,
}: ListPhaseContainerProps) => {
  // console.log("phasedata", phaseData);
  const [userLogin, setUserLogin] = useUserLogin();

  return (
    <div className="flex gap-x-6 h-full flex-wrap">
      {(phaseData === undefined ||
        (Array.isArray(phaseData) && phaseData?.length === 0)) &&
      userLogin?.role_name !== "Student" ? (
        <p className="text-white">Sinh viên chưa tạo giai đoạn</p>
      ) : (
        phaseData?.map((phase, index) => {
          return (
            <ListPhases
              key={index}
              index={index}
              project={project}
              data={phase}
              groupId={groupId}
              setPhaseData={setPhaseData}
            ></ListPhases>
          );
        })
      )}

      <ListForm
        project={project}
        groupId={groupId}
        projectId={projectId}
        phaseData={phaseData}
        setPhaseData={setPhaseData}
      />
      <div className="flex-shrink-0 w-1"></div>
    </div>
  );

  // mới sửa khúc này
};

export default ListPhaseContainer;
