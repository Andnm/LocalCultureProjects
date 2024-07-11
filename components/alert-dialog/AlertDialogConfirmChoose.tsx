"use client";

import React, { Fragment } from "react";

import { useRouter } from "next/navigation";

import "./style.scss";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import toast from "react-hot-toast";
import {
  chooseGroupByBusiness,
  registerPitching,
} from "@/src/redux/features/pitchingSlice";
import { changeStatusProjectByAdmin } from "@/src/redux/features/projectSlice";

interface AlertDialogConfirmChooseProps {
  children: React.ReactNode;
  groupId: number;
  projectId: number;
  setDataGroupPitching: any;
  dataGroupPitching: any;
}

export const AlertDialogConfirmChoose: React.FC<
  AlertDialogConfirmChooseProps
> = ({
  children,
  groupId,
  projectId,
  setDataGroupPitching,
  dataGroupPitching,
}) => {
  const [open, setOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loadingPitching } = useAppSelector((state) => state.pitching);

  const handleChooseGroup = () => {
    dispatch(chooseGroupByBusiness({ groupId, projectId })).then((result: any) => {
      const projectStatus = "Processing";

      // dispatch(changeStatusProjectByAdmin({ projectId, projectStatus })).then(
      //   (result) => {
      //     console.log(result.payload);
      //   }
      // );
      // console.log("dataGroupPitching", dataGroupPitching);
      // console.log("groupId", groupId);

      // TẠM THỜI ẨN
      if (chooseGroupByBusiness.fulfilled.match(result)) {
        // console.log("suc", result.payload);
        const updatedDataGroupPitching = dataGroupPitching.map((item: any) => {
          if (item.group.id === groupId) {
            return { ...item, register_pitching_status: "Selected" };
          } else {
            return { ...item, register_pitching_status: "Rejected" };
          }
        });
        setDataGroupPitching(updatedDataGroupPitching);
        toast.success("Chọn nhóm thành công!");
      } else {
        console.log('res', result);
        toast.error(`${result.payload}`);
        toast.error("Đã có lỗi xảy ra vui lòng thử lại sau!");
      }
    });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="opacity-100 max-w-lg bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Chọn nhóm đăng kí</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn nhận nhóm này?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-4 justify-end mt-4">
          <AlertDialogCancel className="rounded-sm bg-orange-200 border-orange-200 border-2">
            Hủy
          </AlertDialogCancel>
          <Button
            className="rounded-sm bg-blue-200 border-blue-200 border-2"
            onClick={handleChooseGroup}
          >
            Xác nhận chọn
          </Button>
        </div>
      </AlertDialogContent>

      {loadingPitching && <SpinnerLoading />}
    </AlertDialog>
  );
};
