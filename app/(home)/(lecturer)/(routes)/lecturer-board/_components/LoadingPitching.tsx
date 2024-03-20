import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderLecturerBoardGroup from "./HeaderLecturerBoardGroup";

interface LoadingProps {
  onSearchChange: any;
  filterOption: any;
  setFilterOption: any;
}

const LoadingPitching: React.FC<LoadingProps> = ({
  onSearchChange,
  filterOption,
  setFilterOption,
}) => {
  return (
    <div>
      <HeaderLecturerBoardGroup
        onSearchChange={onSearchChange}
        filterOption={filterOption}
        setFilterOption={setFilterOption}
      />

      <main className="mt-3 grid grid-cols-4 gap-2">
        <div className="h-auto border rounded-2xl">
          <Skeleton className="h-32 relative rounded-t-2xl">
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[16px] z-40" />
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[56px] z-30" />
          </Skeleton>
          <div className="p-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-30 my-2" />
            <Skeleton className="h-6 w-56 mb-2" />
            <div className="flex items-center text-sm justify-end text-gray-400 border-t">
              <Skeleton className="h-6 w-28 mt-3" />
            </div>
          </div>
        </div>

        <div className="h-auto border rounded-2xl">
          <Skeleton className="h-32 relative rounded-t-2xl">
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[16px] z-40" />
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[56px] z-30" />
          </Skeleton>
          <div className="p-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-30 my-2" />
            <Skeleton className="h-6 w-56 mb-2" />
            <div className="flex items-center text-sm justify-end text-gray-400 border-t">
              <Skeleton className="h-6 w-28 mt-3" />
            </div>
          </div>
        </div>

        <div className="h-auto border rounded-2xl">
          <Skeleton className="h-32 relative rounded-t-2xl">
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[16px] z-40" />
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[56px] z-30" />
          </Skeleton>
          <div className="p-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-30 my-2" />
            <Skeleton className="h-6 w-56 mb-2" />
            <div className="flex items-center text-sm justify-end text-gray-400 border-t">
              <Skeleton className="h-6 w-28 mt-3" />
            </div>
          </div>
        </div>

        <div className="h-auto border rounded-2xl">
          <Skeleton className="h-32 relative rounded-t-2xl">
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[16px] z-40" />
            <Skeleton className="h-14 w-14 object-cover rounded-full border-2 absolute -bottom-6 right-[56px] z-30" />
          </Skeleton>
          <div className="p-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-30 my-2" />
            <Skeleton className="h-6 w-56 mb-2" />
            <div className="flex items-center text-sm justify-end text-gray-400 border-t">
              <Skeleton className="h-6 w-28 mt-3" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingPitching;
