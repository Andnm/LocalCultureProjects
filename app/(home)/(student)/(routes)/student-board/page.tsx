"use client";

import React from "react";
import ProjectListStudent from "./_components/ProjectListStudent";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllRegisterPitchingByStudent } from "@/src/redux/features/pitchingSlice";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import { useUserLogin } from "@/src/hook/useUserLogin";

const StudentBoard = () => {
  const [dataPitching, setDataPitching] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();

  const { data, loadingPitching, error } = useAppSelector(
    (state) => state.pitching
  );

  const fetchData = () => {
    dispatch(getAllRegisterPitchingByStudent()).then((result) => {
      if (getAllRegisterPitchingByStudent.fulfilled.match(result)) {
        setDataPitching(result.payload);
      }
    });
  };

  React.useEffect(() => {
    fetchData();

    
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

export default StudentBoard;
