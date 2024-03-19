import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineClear, MdPlaylistAdd } from "react-icons/md";
import { Button } from "@/components/ui/button";

import {
  CardHeader,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { GrPowerReset } from "react-icons/gr";
import { cn } from "@/lib/utils";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "Pending",
  },
  {
    label: "Public",
    value: "Public",
  },
  {
    label: "Processing",
    value: "Processing",
  },
  {
    label: "Done",
    value: "Done",
  },
  {
    label: "Expired",
    value: "Expired",
  },
];

interface ManageProjectHeaderProps {
  statusSelected: any;
  setStatusSelected: any;
  resetToOriginDataTable: any;
  searchValue: any;
  setSearchValue: any;
  onSearchChange: any;
}

const ManageProjectHeader: React.FC<ManageProjectHeaderProps> = ({
  statusSelected,
  setStatusSelected,
  resetToOriginDataTable,
  searchValue,
  setSearchValue,
  onSearchChange
}) => {
  return (
    <CardHeader floated={false} shadow={false} className="rounded-none">
      <div className="mb-8 flex items-center justify-between gap-8">
        <div>
          <Typography variant="h5" color="blue-gray">
            Quản lý dự án
          </Typography>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <div
            className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2"
            style={{ borderRadius: "7px", borderWidth: "1px" }}
          >
            <MdPlaylistAdd />
            <p className="text-sm">Thêm dự án</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* tạm thời ẩn đi */}
        <Tabs value="all" className="filter w-full md:w-max">
          <TabsHeader>
            {TABS.map(({ label, value }) => (
              <p
                key={value}
                className={`p-2 cursor-pointer focus:outline-none transition-all text-sm ${
                  statusSelected === value ? "bg-orange-300 text-white" : ""
                }`}
                style={{ borderRadius: "0.3rem" }}
                onClick={() => setStatusSelected(value)}
              >
                &nbsp;&nbsp;{label}&nbsp;&nbsp;
              </p>
            ))}
          </TabsHeader>
        </Tabs>

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
            placeholder="Gõ tên dự án muốn tìm ..."
            value={searchValue}
            onChange={onSearchChange}
          />

          {searchValue && (
            <MdOutlineClear
              className="cursor-pointer mr-3"
              onClick={() => {
                setSearchValue("");
              }}
            />
          )}
        </div>

        <Button
          className={cn(
            "font-normal justify-center items-center text-orange-900 bg-orange-300 hover:bg-orange-400 gap-2"
          )}
          style={{ borderRadius: "7px" }}
          onClick={resetToOriginDataTable}
        >
          <GrPowerReset />
          <p>Reset</p>
        </Button>
      </div>
    </CardHeader>
  );
};

export default ManageProjectHeader;
