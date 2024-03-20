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
import ManageGroupHeader from "./_components/header";
import GroupTable from "./_components/table";
import { getAllGroupByAdmin, getAllMemberByGroupId } from "@/src/redux/features/groupSlice";
import toast from "react-hot-toast";

const ManageGroup = () => {
  const dispatch = useAppDispatch();
  const [originalDataTable, setOriginalDataTable] = React.useState<any[]>([]);
  const [dataTable, setDataTable] = React.useState<any[]>([]);
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

  console.log("originalDataTable", originalDataTable)

  //load data
  React.useEffect(() => {
    dispatch(getAllGroupByAdmin()).then((result) => {
      if (getAllGroupByAdmin.fulfilled.match(result)) {
        setTotalObject(result?.payload?.length);
        setOriginalDataTable(result?.payload);
        
        result?.payload.forEach((object: any) => {
          dispatch(getAllMemberByGroupId(object.id)).then((memberResult) => {
            if (getAllMemberByGroupId.fulfilled.match(memberResult)) {
              setOriginalDataTable((prevOriginalDataTable) => {
                const updatedDataTable = prevOriginalDataTable.map((item) => {
                  if (item.id === object.id) {
                    return {
                      ...item,
                      members: memberResult.payload,
                    };
                  }
                  return item;
                });
                return updatedDataTable;
              });
            } else {
              toast.error(`${memberResult.payload}`);
            }
          });
        });
      } else {
        toast.error(`${result.payload}`);
      }
    });
  }, [currentPage]);
  
  return (
    <Card className="p-4 manager-project">
      <ManageGroupHeader
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      {loadingUser ? (
        <AdminSpinnerLoading />
      ) : (
        <>
          <GroupTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingProject={loadingUser}
          />
        </>
      )}
    </Card>
  );
};

export default ManageGroup;
