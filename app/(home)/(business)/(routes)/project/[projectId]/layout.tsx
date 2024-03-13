"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { redirect, usePathname } from "next/navigation";
import "./style.scss";
import { ViewNavbar } from "./_components/ViewNavbar";
import { getProjectById } from "@/src/redux/features/projectSlice";
import { ProjectType } from "@/src/types/project.type";
import ViewSidebar from "./_components/ViewSidebar";
import { getAllRegisterPitchingByBusiness } from "@/src/redux/features/pitchingSlice";

const ViewIdLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: number };
}) => {
  //   đoạn này để bắt chưa login mà mò vào đây thì cho nó ra ngoài
  //     const { isLogin, loading } = useAppSelector((state) => state.auth);

  //     if (!isLogin) {
  //       redirect("/");
  //     }

  const [dataProject, setDataProject] = React.useState<ProjectType | undefined>(
    undefined
  );

  const [groupId, setGroupId] = React.useState<number>(0);
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  const fetchData = () => {
    dispatch(getProjectById(params.projectId)).then((result) => {
      if (getProjectById.fulfilled.match(result)) {
        setDataProject(result.payload);
      }
    });

    dispatch(getAllRegisterPitchingByBusiness(params.projectId)).then(
      (result) => {
        if (getAllRegisterPitchingByBusiness.fulfilled.match(result)) {
          const selectedGroup = result.payload.find(
            (item: any) => item.register_pitching_status === "Selected"
          );

          if (selectedGroup) {
            setGroupId(selectedGroup.group.id);
          }
        }
      }
    );
  };

  React.useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex">
      <ViewSidebar dataProject={dataProject} />
      <div
        className="layout-view relative bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url('https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg')`,
        }}
      >
        {pathName === `/project/${params.projectId}/view` && (
          <ViewNavbar
            projectId={params.projectId}
            dataProject={dataProject}
            setDataProject={setDataProject}
            groupId={groupId}
          />
        )}

        <div className="absolute inset-0 bg-black/10" />

        <main
          className={`relative ${
            pathName === `/project/${params.projectId}/view` && " pt-14 "
          } h-full w-full`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default ViewIdLayout;
