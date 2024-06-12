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
  const { loadingSupport } = useAppSelector((state) => state.support);

  //pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  //search
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue === "") {
      setDataTable(originalDataTable);
    } else {
      const filteredData = originalDataTable.filter(
        (item: any) =>
          item?.email.toLowerCase().includes(searchValue) 
      );
      setDataTable(filteredData);
    }
  };


  React.useEffect(() => {
    dispatch(getAllSupport()).then((result) => {
      if (getAllSupport.rejected.match(result)) {
        toast.error(`${result.payload}`);
      } else if (getAllSupport.fulfilled.match(result)) {
        setTotalObject(result.payload.length);
        setDataTable(result.payload);
        setOriginalDataTable(result.payload);
      }
    });
  }, []);

  return (
    <Card className="p-4 manager-project">
      <ManageSupportHeader
        onSearchChange={onSearchChange}
        
      />

      {loadingSupport ? (
        <AdminSpinnerLoading />
      ) : (
        <>
          <SupportTable
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalObject={totalObject}
            dataTable={dataTable}
            setDataTable={setDataTable}
            loadingUser={loadingSupport}
          />
        </>
      )}
    </Card>
  );
};

export default ManageSupport;
