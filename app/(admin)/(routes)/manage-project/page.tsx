"use client";
import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { Card } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import {
  getAllProjectByAdmin,
  getAllProjectByEveryOne,
} from "@/src/redux/features/projectSlice";
import AdminSpinnerLoading from "@/src/components/loading/AdminSpinnerLoading";
import ManageProjectHeader from "./_components/header";
import ProjectTable from "./_components/table";

const ManageProject = () => {
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const { data, loadingProjectList, loadingProject, error } = useAppSelector(
    (state) => state.project
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  React.useEffect(() => {
    dispatch(getAllProjectByAdmin(currentPage)).then((result) => {
      if (getAllProjectByAdmin.rejected.match(result)) {
        //do something
        console.log(result.payload);
      } else if (getAllProjectByAdmin.fulfilled.match(result)) {
        setTotalObject(result.payload[0]?.totalProjects);
        setDataTable(result.payload[1]);
      }
    });
  }, [currentPage]);

  return (
    <Card className="p-4 manager-project">
      <ManageProjectHeader />

      {loadingProjectList ? (
        <AdminSpinnerLoading />
      ) : (
        <>
          <ProjectTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingProject={loadingProject}
          />
        </>
      )}
    </Card>
  );
};

export default ManageProject;
