"use client";

import ProjectListStudent from "@/app/(home)/(student)/(routes)/student-board/_components/ProjectListStudent";
import { getAllRegisterPitchingByStudent } from "@/src/redux/features/pitchingSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import React from "react";

const LectureProjectPage = () => {
  const [dataPitching, setDataPitching] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();

  const { data, loadingPitching, error } = useAppSelector(
    (state) => state.pitching
  );

  React.useEffect(() => {
    dispatch(getAllRegisterPitchingByStudent()).then((result) => {
      if (getAllRegisterPitchingByStudent.fulfilled.match(result)) {
        console.log(result.payload);
        setDataPitching(result.payload);
      }
    });
  }, []);
  return (
    <div className="w-full">
      <ProjectListStudent
        dataPitching={dataPitching}
        setDataPitching={setDataPitching}
        loadingPitching={loadingPitching}
      />
    </div>
  );
};

export default LectureProjectPage;
