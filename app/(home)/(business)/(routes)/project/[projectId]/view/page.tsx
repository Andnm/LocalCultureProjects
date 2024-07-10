"use client";

import React from "react";
import { useParams } from "next/navigation";
import ListPhaseContainer from "./_components/phases/ListPhaseContainer";
import { getPhaseByProjectId } from "@/src/redux/features/phaseSlice";
import { PhaseType } from "@/src/types/phase.type";
import { useAppDispatch } from "@/src/redux/store";
import { getAllRegisterPitchingByBusiness } from "@/src/redux/features/pitchingSlice";
import ProgressLoading from "@/src/components/loading/ProgressLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { getProjectById } from "@/src/redux/features/projectSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import PostIdea from "./_components/post_idea/PostIdea";

const ProjectIdPage = () => {
  const params = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const [phaseData, setPhaseData] = React.useState<any | null>();
  const [groupId, setGroupId] = React.useState<number>(0);
  const [project, setProject] = React.useState<any | null>();
  const [userLogin, setUserLogin] = useUserLogin();

  React.useEffect(() => {
    const projectId = parseInt(params.projectId, 10);

    dispatch(getProjectById(projectId)).then((result) => {
      setProject(result.payload);
    });

    dispatch(getPhaseByProjectId(projectId)).then((result) => {
      const sortedPhaseData = [...result.payload]?.sort(
        (a, b) => a?.phase_number - b?.phase_number
      );
      setPhaseData(sortedPhaseData);

      socketInstance.on(`getPhases-${projectId}`, (data: any) => {
        const sortedPhaseData = [...data.phases]?.sort(
          (a, b) => a?.phase_number - b?.phase_number
        );
        console.log("phase: ", sortedPhaseData);

        // console.log("data.phases", data.phases);
        setPhaseData(sortedPhaseData);
        // setPhaseData(data.phases);
      });
      // console.log("api", result)
      // const sortedPhaseData = [...result?.payload]?.sort((a, b) => a.id - b.id);

      // setPhaseData(sortedPhaseData);
    });

    dispatch(getAllRegisterPitchingByBusiness(projectId)).then((result) => {
      if (getAllRegisterPitchingByBusiness.fulfilled.match(result)) {
        // console.log("group", result.payload);
        const selectedGroup = result.payload.find(
          (item: any) => item.register_pitching_status === "Selected"
        );

        if (selectedGroup) {
          // console.log(selectedGroup)
          setGroupId(selectedGroup.group.id);
        }
      } else {
      }
    });
  }, [params.projectId]);

  return (
    <div className="p-4 h-full overflow-x-auto">
      {/* <ProgressLoading phaseData={phaseData} /> */}
      {project?.project_status === "Public" ||
      project?.project_status === "Pending" ? (
        <p className="text-white">Dự án chưa bắt đầu</p>
      ) : project?.business_type === "Triển khai thực tế" ? (
        <ListPhaseContainer
          projectId={parseInt(params.projectId, 10)}
          groupId={groupId}
          phaseData={phaseData}
          setPhaseData={setPhaseData}
          project={project}
        />
      ) : (
        <PostIdea />
      )}
    </div>
  );
};

export default ProjectIdPage;
