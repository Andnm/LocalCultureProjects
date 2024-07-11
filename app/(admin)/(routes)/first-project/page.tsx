"use client";
import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { Card } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import AdminSpinnerLoading from "@/src/components/loading/AdminSpinnerLoading";
import ManageAccountHeader from "./_components/header";
import AccountTable from "./_components/table";
import { getAllUser } from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import { getAllFirstProjectByAdmin } from "@/src/redux/features/projectSlice";

const FirstProjectManagement = () => {
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [originalDataTable, setOriginalDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const { loadingProjectList, error } = useAppSelector(
    (state) => state.project
  );

  //pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  // filter
  const [filterOption, setFilterOption] = React.useState<any>({
    role_name: [],
    status: [],
    searchValue: "",
  });

  //search
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    setFilterOption((prevFilterOption: any) => ({
      ...prevFilterOption,
      searchValue: searchValue,
    }));

    if (searchValue === "") {
      setDataTable(originalDataTable);
    } else {
      const filteredData = originalDataTable.filter(
        (item: any) =>
          item?.email.toLowerCase().includes(searchValue) ||
          item?.role?.role_name?.toLowerCase().includes(searchValue) ||
          (item.status ? "active" : "inactive")
            .toLowerCase()
            .includes(searchValue)
      );
      setDataTable(filteredData);
    }
  };

  // hàm filter
  React.useEffect(() => {
    const filteredData = originalDataTable.filter((item) => {
      if (
        filterOption.role_name.length > 0 &&
        !filterOption.role_name.includes(item.role?.role_name)
      ) {
        return false;
      }
      if (
        filterOption.status.length > 0 &&
        !filterOption.status.includes(item.status ? "Active" : "Inactive")
      ) {
        return false;
      }
      if (
        filterOption.searchValue &&
        !(
          item.email.toLowerCase().includes(filterOption.searchValue) ||
          item.role?.role_name
            .toLowerCase()
            .includes(filterOption.searchValue) ||
          (item.status ? "active" : "inactive").includes(
            filterOption.searchValue
          )
        )
      ) {
        return false;
      }
      return true;
    });
    setDataTable(filteredData);
  }, [filterOption, originalDataTable]);

  React.useEffect(() => {
    dispatch(getAllFirstProjectByAdmin()).then((resGetAll: any) => {
      if (getAllFirstProjectByAdmin.rejected.match(resGetAll)) {
        // console.log(resGetAll.payload);
        toast.error(`${resGetAll.payload}`);
      } else if (getAllFirstProjectByAdmin.fulfilled.match(resGetAll)) {
        // console.log("resGetAll", resGetAll);
        const sortedData = resGetAll.payload.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setTotalObject(resGetAll.payload.length);
        setDataTable(sortedData);
        setOriginalDataTable(sortedData);
      }
    });
  }, [currentPage]);

  return (
    <Card className="p-4 manager-project">
      <ManageAccountHeader
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      {loadingProjectList ? (
        <AdminSpinnerLoading />
      ) : (
        <>
          <AccountTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingUser={loadingProjectList}
          />
        </>
      )}
    </Card>
  );
};

export default FirstProjectManagement;
