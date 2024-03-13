"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import "./style.scss";
import { ProjectType } from "@/src/types/project.type";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { formatDate } from "@/src/utils/handleFunction";

interface DialogViewProjectProps {
  children: React.ReactNode;
  project: ProjectType;
}

export const DialogViewProject: React.FC<DialogViewProjectProps> = ({
  children,
  project,
}) => {
  const [open, setOpen] = React.useState(false);

  const { loadingProjectList, error } = useAppSelector(
    (state) => state.project
  );
  const dispatch = useAppDispatch();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="opacity-100 bg-opacity-100 max-w-6xl bg-white">
        <DialogHeader>
          <DialogTitle>Thông tin dự án</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Tên dự án:</p>
            <p className="text-black">{project.name_project}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Người phụ trách:</p>
            <p className="text-black">{project.email_responsible_person}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Trạng thái:</p>
            <p className="text-black">{project.project_status}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Lĩnh vực chuyên môn:</p>
            <p className="text-black">{project.specialized_field}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Mô tả:</p>
            <p className="text-black">{project.description_project}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Chú thích:</p>
            <p className="text-black">{project.note}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Yêu cầu:</p>
            <p className="text-black">{project.note}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Ngày bắt đầu:</p>
            <p className="text-black">
              {formatDate(project.project_start_date)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">
              Ngày kết thúc dự kiến:
            </p>
            <p className="text-black">
              {formatDate(project.project_expected_end_date)}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 font-semibold">Ngày hết hạn đăng kí:</p>
            <p className="text-black">
              {formatDate(project.project_registration_expired_date)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
