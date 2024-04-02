"use client";
import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { Card } from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import AdminSpinnerLoading from "@/src/components/loading/AdminSpinnerLoading";
import { getAllUser } from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import { getAllSupport } from "@/src/redux/features/supportSlice";
import ManageSupportHeader from "./_components/header";
import SupportTable from "./_components/table";

const ManageSupport = () => {
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [originalDataTable, setOriginalDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const { loadingUser, error } = useAppSelector((state) => state.user);

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
    dispatch(getAllSupport()).then((result) => {
      if (getAllSupport.rejected.match(result)) {
        toast.error(`${result.payload}`);
      } else if (getAllUser.fulfilled.match(result)) {
        setTotalObject(result.payload.length);
        setDataTable(result.payload);
        setOriginalDataTable(result.payload);
      }
      console.log(result.payload.length);
    });
  }, []);

  return (
    <Card className="p-4 manager-project">
      <ManageSupportHeader
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      {loadingUser ? (
        <AdminSpinnerLoading />
      ) : (
        <>
          <SupportTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingUser={loadingUser}
          />
        </>
      )}
    </Card>
  );
};

export default ManageSupport;
