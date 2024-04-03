import React from "react";
import Pagination from "@/src/components/shared/Pagination";
import { IoIosSearch } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { cn } from "@/lib/utils";
import DrawerFilterGroup from "@/components/drawer/DrawerFilterGroup";

interface HeaderLecturerBoardGroupProps {
  onSearchChange: any;
  filterOption: any;
  setFilterOption: any;
}

const HeaderLecturerBoardGroup: React.FC<HeaderLecturerBoardGroupProps> = ({
  onSearchChange,
  filterOption,
  setFilterOption,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const onPageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const openDrawerAction = () => setOpenDrawer(true);
  const closeDrawerAction = () => setOpenDrawer(false);

  return (
    <div className="flex justify-between">
      <Pagination
        hiddenNumberPage={true}
        currentPage={currentPage}
        totalItems={8}
        onPageChange={onPageChange}
      />

      <div className="flex gap-2">
        {(filterOption?.register_pitching_status !== "" ||
          filterOption?.relationship_status !== "" ||
          filterOption?.searchValue !== "") && (
          <Button
            variant={"default"}
            className={cn(
              "font-normal justify-center items-center ph-10 text-orange-900 bg-orange-300 hover:bg-orange-400 gap-2"
            )}
            style={{ borderRadius: "7px" }}
            onClick={() =>
              setFilterOption({
                subject_code: [],
                register_pitching_status: [],
                relationship_status: [],
                searchValue: "",
              })
            }
          >
            <GrPowerReset />
            <p>Reset</p>
          </Button>
        )}

        <div className="relative flex items-center border-b border-gray-500 w-56 h-10 bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <IoIosSearch />
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Gõ nhóm muốn tìm kiếm ..."
            value={filterOption?.searchValue}
            onChange={onSearchChange}
          />
        </div>

        <Button
          onClick={openDrawerAction}
          className="gap-2 border border-gray-300 rounded"
        >
          <MdFilterList className="w-5 h-5" />
          Filter
        </Button>
      </div>

      {openDrawer && (
        <DrawerFilterGroup
          openDrawer={openDrawer}
          closeDrawerAction={closeDrawerAction}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      )}
    </div>
  );
};

export default HeaderLecturerBoardGroup;
