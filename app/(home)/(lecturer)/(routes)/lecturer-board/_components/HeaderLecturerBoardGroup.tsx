import React from "react";
import Pagination from "@/src/components/shared/Pagination";
import { IoIosSearch } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { Button } from "@/components/ui/button";

const HeaderLecturerBoardGroup = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex justify-between">
      <Pagination
        hiddenNumberPage={true}
        currentPage={currentPage}
        totalItems={8}
        onPageChange={onPageChange}
      />

      <div className="flex gap-2">
        <div className="relative flex items-center border-b border-gray-500 w-56 h-10 bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <IoIosSearch />
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Gõ thứ gì đó ..."
          />
        </div>

        <Button className="gap-2 border border-gray-300 rounded">
          <MdFilterList className="w-5 h-5" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default HeaderLecturerBoardGroup;
