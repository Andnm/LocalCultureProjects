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

const ManageAccount = () => {
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [originalDataTable, setOriginalDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10); 
  const { loadingUser, error } = useAppSelector((state) => state.user);

  // Pagination
  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Filter
  const [filterOption, setFilterOption] = React.useState<any>({
    role_name: [],
    is_ban: [],
    status: [],
    searchValue: "",
  });

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    setFilterOption((prevFilterOption: any) => ({
      ...prevFilterOption,
      searchValue: searchValue,
    }));
  };

  React.useEffect(() => {
    dispatch(getAllUser()).then((result) => {
      if (getAllUser.rejected.match(result)) {
        toast.error(`${result.payload}`);
      } else if (getAllUser.fulfilled.match(result)) {
        
        const users = result.payload[1];
        setTotalObject(result.payload[0]?.totalUsers);
        setOriginalDataTable(users);
        
        // Apply pagination and filter
        const filteredData = filterData(users);
        const paginatedData = paginateData(filteredData);
        setDataTable(paginatedData);
      }
    });
  }, [dispatch, currentPage, filterOption]);

  const filterData = (data: any[]) => {
    return data.filter((item) => {
      if (
        filterOption.role_name.length > 0 &&
        !filterOption.role_name.includes(item.role?.role_name)
      ) {
        return false;
      }
      if (
        filterOption?.is_ban?.length > 0 &&
        !filterOption?.is_ban?.includes(item.is_ban ? "True" : "False")
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
          (item.status ? "Active" : "Inactive").includes(
            filterOption.searchValue
          ) ||
          (item.is_ban ? "True" : "False").includes(filterOption.searchValue)
        )
      ) {
        return false;
      }
      return true;
    });
  };

  const paginateData = (data: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  React.useEffect(() => {
    const filteredData = filterData(originalDataTable);
    const paginatedData = paginateData(filteredData);
    setDataTable(paginatedData);
  }, [filterOption, originalDataTable, currentPage]);

  return (
    <Card className="p-4 manager-project">
      <ManageAccountHeader
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      {loadingUser ? (
        <AdminSpinnerLoading />
      ) : (
        <>
           <AccountTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingUser={loadingUser}
            setOriginalDataTable={setOriginalDataTable}
          />
        </>
      )}
    </Card>
  );
};

export default ManageAccount;
