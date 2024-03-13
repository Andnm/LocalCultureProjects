"use client";
import React from "react";
import HeaderLecturerBoardGroup from "./_components/HeaderLecturerBoardGroup";
import CardGroup from "./_components/CardGroup";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllRegisterPitchingByStudent } from "@/src/redux/features/pitchingSlice";
import { getAllGroupAreMembers } from "@/src/redux/features/groupSlice";

const LecturerBoard = () => {
  const [dataGroupList, setDataGroupList] = React.useState<any[]>([]);
  const [lectureData, setLectureData] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { data, loadingPitching, error } = useAppSelector(
    (state) => state.pitching
  );

  React.useEffect(() => {
    dispatch(getAllGroupAreMembers()).then((result) => {
      if (getAllGroupAreMembers.fulfilled.match(result)) {
        setLectureData(result.payload);
        // console.log('lecture', result.payload)
      }
    });

    dispatch(getAllRegisterPitchingByStudent()).then((result) => {
      if (getAllRegisterPitchingByStudent.fulfilled.match(result)) {
        setDataGroupList(result.payload);
        // console.log(result.payload);
      } else {
        // console.log(result.payload);
      }
    });
  }, []);

  if (loadingPitching) {
    return (
      <div>
        <HeaderLecturerBoardGroup />

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
  }

  return (
    <div>
      <HeaderLecturerBoardGroup />

      <main className="mt-3 mb-5 grid grid-cols-4 gap-2">
        {Array.isArray(dataGroupList) && dataGroupList.length === 0 ? (
          <div className="text-center text-lg text-neutral-700">
            Bạn chưa tham gia nhóm nào cả.
          </div>
        ) : (
          dataGroupList.map((group, index) => (
            <CardGroup group={group} key={index} lectureData={lectureData} />
          ))
        )}
      </main>
    </div>
  );
};

export default LecturerBoard;
