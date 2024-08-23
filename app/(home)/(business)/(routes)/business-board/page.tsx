"use client";

import React from "react";
import ProjectList from "./_components/ProjectList";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import {
  getAllProjectByBusiness,
  getAllProjectByResponsiblePerson,
  getProjectById,
} from "@/src/redux/features/projectSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { useUserLogin } from "@/src/hook/useUserLogin";
import toast from "react-hot-toast";

const BusinessBoard = () => {
  const [dataProjects, setDataProjects] = React.useState<any[]>([]);
  const dispatch: any = useAppDispatch();

  const { data, loadingProject, loadingProjectList, error } = useAppSelector(
    (state) => state.project
  );

  const [userLogin, setUserLogin] = useUserLogin();

  React.useEffect(() => {
    if (userLogin?.role_name === "Business") {
      dispatch(getAllProjectByBusiness()).then((result: any) => {
        if (getAllProjectByBusiness.fulfilled.match(result)) {
          setDataProjects(result.payload);
          socketInstance.on(
            `getProjectsOfBusiness-${userLogin?.email}`,
            (data: any) => {
              // console.log("data socket project", data);
              if (data && data.projects) {
                setDataProjects(data.projects);
              } else {
                console.log("No projects data or error occurred from socket");
                setDataProjects(result.payload);
              }
            }
          );
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu!");
        }
      });
    } else if (userLogin?.role_name === "ResponsiblePerson") {
      dispatch(getAllProjectByResponsiblePerson()).then((result: any) => {
        if (getAllProjectByResponsiblePerson.fulfilled.match(result)) {
          setDataProjects(result.payload);
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu!");
        }
      });
    }
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
