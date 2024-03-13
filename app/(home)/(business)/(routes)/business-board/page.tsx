"use client";

import React from "react";
import ProjectList from "./_components/ProjectList";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import {
  getAllProjectByBusiness,
  getProjectById,
} from "@/src/redux/features/projectSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { useUserLogin } from "@/src/hook/useUserLogin";

const BusinessBoard = () => {
  const [dataProjects, setDataProjects] = React.useState<any[]>([]);
  const dispatch: any = useAppDispatch();

  const { data, loadingProject, loadingProjectList, error } = useAppSelector(
    (state) => state.project
  );

  const [userLogin, setUserLogin] = useUserLogin()

  React.useEffect(() => {
    dispatch(getAllProjectByBusiness()).then((result: any) => {
      if (getAllProjectByBusiness.fulfilled.match(result)) {
        socketInstance.on(`getProjectsOfBusiness-${userLogin?.email}`, (data: any) => {
          setDataProjects(data.projects)
          console.log(data)
        })

        // setDataProjects(result.payload);
        // console.log("project", result.payload)
      }else {
        // console.log(result.payload)
      }
    });

  }, [userLogin]);

  return (
    <div className="w-full">
      <ProjectList
        dataProjects={dataProjects}
        setDataProjects={setDataProjects}
        loadingProject={loadingProject}
        loadingProjectList={loadingProjectList}
      />
    </div>
  );
};

export default BusinessBoard;
