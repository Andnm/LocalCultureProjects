import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { IoIosSearch } from "react-icons/io";
import { MdPlaylistAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { MdFilterList } from "react-icons/md";
import { MdOutlineClear } from "react-icons/md";
import { GrPowerReset } from "react-icons/gr";

import DrawerFilterAdmin from "@/components/drawer/DrawerFilterAdmin";

import { CardHeader, Typography } from "@material-tailwind/react";
import { cn } from "@/lib/utils";
import { FILTER_ACCOUNT_BY_ADMIN, FILTER_GROUP_BY_ADMIN } from "@/src/constants/filter";

interface ManageAccountHeaderProps {
  onSearchChange: any;
  filterOption: any;
  setFilterOption: any;
}

const ManageAccountHeader: React.FC<ManageAccountHeaderProps> = ({
  onSearchChange,
  filterOption,
  setFilterOption,
}) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const openDrawerAction = () => setOpenDrawer(true);
  const closeDrawerAction = () => setOpenDrawer(false);

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Quản lý Dự án đầu
            </Typography>
          </div>
          {/* <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <div
              className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2"
              style={{ borderRadius: "7px", borderWidth: "1px" }}
            >
              <MdPlaylistAdd />
              <p className="text-sm">Tạo tài khoản</p>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col items-center  gap-4 md:flex-row">
          {/* <Button
            className="gap-2 border"
            onClick={openDrawerAction}
            style={{ borderRadius: "7px" }}
          >
            <MdFilterList className="w-5 h-5" />
            Bộ lọc
          </Button> */}

          <div
            style={{ borderRadius: "7px" }}
            className="relative border flex items-center w-5/12 h-10 rounded-lg focus-within:shadow-lg bg-white overflow-hidden"
          >
            <div className="grid place-items-center h-full w-12 text-gray-300">
              <IoIosSearch />
            </div>

            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
              type="text"
              id="search"
              placeholder="Gõ email muốn tìm kiếm"
              value={filterOption?.searchValue}
              onChange={onSearchChange}
            />

            {filterOption?.searchValue && (
              <MdOutlineClear
                className="cursor-pointer mr-3"
                onClick={() => {
                  setFilterOption((prevFilterOption: any) => ({
                    ...prevFilterOption,
                    searchValue: "",
                  }));
                }}
              />
            )}
          </div>

          {(filterOption.role_name !== "" ||
            filterOption.status !== "" ||
            filterOption.searchValue !== "") && (
            <Button
              variant={"default"}
              className={cn(
                "font-normal justify-center items-center ph-10 text-orange-900 bg-orange-300 hover:bg-orange-400 gap-2"
              )}
              style={{ borderRadius: "7px" }}
              onClick={() =>
                setFilterOption({
                  role_name: [],
                  status: [],
                  searchValue: "",
                })
              }
            >
              <GrPowerReset />
              <p>Reset</p>
            </Button>
          )}
        </div>
      </CardHeader>

      {openDrawer && (
        <DrawerFilterAdmin
          listFilter={FILTER_ACCOUNT_BY_ADMIN}
          openDrawer={openDrawer}
          closeDrawerAction={closeDrawerAction}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
        />
      )}
    </>
  );
};

export default ManageAccountHeader;
