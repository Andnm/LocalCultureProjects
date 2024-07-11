"use client";

import React, { useState } from "react";
import MemberGroup from "../member/page";
import { useAuthContext } from "@/src/utils/context/auth-provider";
import Project from "./_components/Project";
import { useRouter } from "next/navigation";
import { RiArrowGoBackLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import "./style.scss";
import { useAppDispatch } from "@/src/redux/store";
import { checkUserAccessToViewWorkingProcess } from "@/src/redux/features/pitchingSlice";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import toast from "react-hot-toast";

const LECTURER_HEADER = [
  {
    id: 1,
    nameItem: "Thành viên nhóm",
  },
  {
    id: 2,
    nameItem: "Về dự án",
  },
  {
    id: 3,
    nameItem: "Quá trình làm việc",
  },
];

const InfoGroup = ({ params }: { params: { groupId: number } }) => {
  const { selectedProjectContext, setSelectedProjectContext }: any =
    useAuthContext();
  const [isLoadingHandle, setIsLoadingHandle] = useState(false);

  const projectId = selectedProjectContext?.project?.id;
  // console.log("selectedProjectContext", selectedProjectContext);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedMenu, setSelectedMenu] = React.useState("Thành viên nhóm");

  const handleClickMenuItem = (nameItem: string) => {
    if (nameItem !== "Quá trình làm việc") {
      setSelectedMenu(nameItem);
    } else {
      setIsLoadingHandle(true);
      dispatch(
        checkUserAccessToViewWorkingProcess({
          groupId: selectedProjectContext?.group?.id,
          projectId: projectId,
        })
      ).then((resCheck) => {
        if (checkUserAccessToViewWorkingProcess.fulfilled.match(resCheck)) {
          if (resCheck.payload) {
            toast.success(
              "Đang xử lý dữ liệu, vui lòng chờ!"
            );
            router.push(`/project/${projectId}/view`);
          } else {
            toast.error(
              "Vui lòng phản hồi lời mời tham gia trước bấm vào đây!"
            );
          }
        } else {
          toast.error("Có lỗi khi xác thực thẩm quyền truy cập!");
        }

        setIsLoadingHandle(false);
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <div className="container">
        <Button
          variant="ghost"
          className="
       font-normal justify-start hover:bg-neutral-500/10 rounded-md
      cursor-pointer left-10 flex gap-2 items-center"
          onClick={handleGoBack}
        >
          <RiArrowGoBackLine />
          Quay lại
        </Button>
      </div>

      <div className="container general-management__menu">
        <ul className="">
          {LECTURER_HEADER.map((item, index) => (
            <li key={index}>
              <a
                onClick={() => handleClickMenuItem(item.nameItem)}
                className={selectedMenu === `${item.nameItem}` ? "active" : ""}
              >
                {item.nameItem}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {selectedMenu === "Về dự án" && (
        <Project projectId={projectId as number} />
      )}
      {selectedMenu === "Thành viên nhóm" && <MemberGroup params={params} />}
      {isLoadingHandle && <SpinnerLoading />}
    </>
  );
};

export default InfoGroup;
