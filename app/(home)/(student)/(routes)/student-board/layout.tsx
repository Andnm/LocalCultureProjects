"use client";

import React from "react";
import StudentSidebar from "./_components/StudentSidebar";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllRegisterPitchingByStudent } from "@/src/redux/features/pitchingSlice";

const StudentBoardLayout = (props: { children: React.ReactNode }) => {
  const [dataPitching, setDataPitching] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { loadingPitching } = useAppSelector((state) => state.pitching);

  React.useEffect(() => {
    dispatch(getAllRegisterPitchingByStudent()).then((result) => {
      if (getAllRegisterPitchingByStudent.fulfilled.match(result)) {
        setDataPitching(result.payload);
      }
    });
  }, []);

  return (
    <main className="py-4 md:py-4 px-4 max-w-6xl 2xl:max-w-screen-xl mx-auto">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden md:block">
          <StudentSidebar
            dataPitching={dataPitching}
            setDataPitching={setDataPitching}
            loadingPitching={loadingPitching}
          />
        </div>
        {props.children}
      </div>
    </main>
  );
};

export default StudentBoardLayout;
