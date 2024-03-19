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
import toast from "react-hot-toast";
import { handleLowerCaseNonAccentVietnamese } from "@/src/utils/handleFunction";

const ManageProject = () => {
  const dispatch = useAppDispatch();
  const [dataTableOrigin, setDataTableOrigin] = React.useState<any[]>([]);
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const { data, loadingProjectList, loadingProject, error } = useAppSelector(
    (state) => state.project
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  // handle select on tab header
  const [statusSelected, setStatusSelected] = React.useState("all");

  //handle search
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const resetToOriginDataTable = () => {
    setStatusSelected("all");
    setSearchValue("");
    setDataTable(dataTableOrigin);
  };

  React.useEffect(() => {
    dispatch(getAllProjectByAdmin(currentPage)).then((result) => {
      if (getAllProjectByAdmin.rejected.match(result)) {
        //do something
        console.log(result.payload);
        toast.error(`${result.payload}`);
      } else if (getAllProjectByAdmin.fulfilled.match(result)) {
        setTotalObject(result.payload[0]?.totalProjects);
        setDataTableOrigin(result.payload[1]);
        setDataTable(result.payload[1]);
      }
    });
  }, [currentPage]);

  React.useEffect(() => {
    if (statusSelected === "all") {
      setDataTable(dataTableOrigin);
    } else {
      const filteredData = dataTableOrigin.filter(
        (project) => project.project_status === statusSelected
      );
      setDataTable(filteredData);
    }
  }, [statusSelected, dataTableOrigin]);

  React.useEffect(() => {
    const filteredData = dataTableOrigin.filter((project) =>
      handleLowerCaseNonAccentVietnamese(project.name_project).includes(
        handleLowerCaseNonAccentVietnamese(searchValue)
      )
    );
    setDataTable(filteredData);
  }, [searchValue, dataTableOrigin]);

  return (
    <Card className="p-4 manager-project">
      <ManageProjectHeader
        statusSelected={statusSelected}
        setStatusSelected={setStatusSelected}
        resetToOriginDataTable={resetToOriginDataTable}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearchChange={handleSearch}
      />

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
