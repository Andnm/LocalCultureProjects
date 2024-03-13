"use client";

import React from "react";
import BusinessSidebar from "./_components/BusinessSidebar";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllProjectByBusiness } from "@/src/redux/features/projectSlice";

const BusinessBoardLayout = (props: { children: React.ReactNode }) => {
  const [dataProjects, setDataProjects] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { data, loadingProject, loadingProjectList, error } = useAppSelector(
    (state) => state.project
  );

  React.useEffect(() => {
    dispatch(getAllProjectByBusiness()).then((result) => {
      if (getAllProjectByBusiness.fulfilled.match(result)) {
        // console.log(result.payload)
        setDataProjects(result.payload);
      }
    });
  }, []);

  return (
    <main className="py-4 md:py-4 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <BusinessSidebar
            dataProjects={dataProjects}
            setDataProjects={setDataProjects}
            loadingProject={loadingProject}
            loadingProjectList={loadingProjectList}
          />
        </div>
        {props.children}
      </div>
    </main>
  );
};

export default BusinessBoardLayout;
