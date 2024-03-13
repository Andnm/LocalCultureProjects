import React from "react";
import "@/src/styles/admin/manage-project.scss";
import { IoIosSearch } from "react-icons/io";
import { MdPlaylistAdd } from "react-icons/md";

import {
  CardHeader,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Public",
    value: "Public",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Done",
    value: "done",
  },
  {
    label: "Expired",
    value: "expired",
  },
];

const ManageProjectHeader: React.FC = () => {
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
        {/* <Tabs value="all" className="filter w-full md:w-max">
          <TabsHeader>
            {TABS.map(({ label, value }) => (
              <Tab key={value} value={value}>
                &nbsp;&nbsp;{label}&nbsp;&nbsp;
              </Tab>
            ))}
          </TabsHeader>
        </Tabs> */}

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
            placeholder="Gõ thứ gì đó ..."
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default ManageProjectHeader;
