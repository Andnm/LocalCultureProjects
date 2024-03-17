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
import ManageAccountHeader from "./_components/header";
import AccountTable from "./_components/table";
import { getAllUser } from "@/src/redux/features/userSlice";

const ManageGroup = () => {
  const dispatch = useAppDispatch();
  const [dataTable, setDataTable] = React.useState<any[]>([]);
  const [totalObject, setTotalObject] = React.useState(1);
  const { loadingUser, error } = useAppSelector((state) => state.user);

  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  React.useEffect(() => {
    dispatch(getAllUser(currentPage)).then((result) => {
      if (getAllUser.rejected.match(result)) {
        //do something
        console.log(result.payload);
      } else if (getAllUser.fulfilled.match(result)) {
        setTotalObject(result.payload[0]?.totalUsers);
        setDataTable(result.payload[1]);
        console.log(result.payload);
      }
    });
  }, [currentPage]);

  return (
    <Card className="p-4 manager-project">
      <ManageAccountHeader />

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
            loadingProject={loadingUser}
          />
        </>
      )}
    </Card>
  );
};

export default ManageGroup;
