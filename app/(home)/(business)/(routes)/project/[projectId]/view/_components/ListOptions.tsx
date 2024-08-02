"use client";

import { PhaseType } from "@/src/types/phase.type";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { IoMdWarning } from "react-icons/io";
import {
  changeStatusPhaseByBusiness,
  deletePhase,
  uploadFeedback,
} from "@/src/redux/features/phaseSlice";
import { useAppDispatch } from "@/src/redux/store";
import toast from "react-hot-toast";
import { BiAddToQueue, BiCheck, BiDetail, BiTrash } from "react-icons/bi";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { FcStart } from "react-icons/fc";
import ModalPhaseDetail from "./phases/phases_detail/ModalPhaseDetail";
import ModalChoosePaymentMethod from "./phases/phases_detail/ModalChoosePaymentMethod";
import ModalAddFeedback from "./phases/ModalAddFeedback";
import { message, Modal } from "antd";
const { confirm } = Modal;

interface ListOptionsProps {
  project: any;
  data: PhaseType;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; // này là nguyên 1 list
  onAddCategory: () => void;
}

const ListOptions = ({
  project,
  data, //data của từng phase, ko truyền set được vì data này lấy từ map phase list truyền vào
  onAddCategory,
  setPhaseData, //set phase data của 1 list phase
}: ListOptionsProps) => {
  //data là 1 phase
  // console.log("data phase: ", data);
  // console.log('project', project)
  const [userLogin, setUserLogin] = useUserLogin();
  const dispatch = useAppDispatch();

  //state open modal
  const [isOpenModalPhaseDetail, setIsOpenModalPhaseDetail] =
    React.useState(false);
  const [isOpenModalChoosePaymentMethod, setIsOpenModalChoosePaymentMethod] =
    React.useState<boolean>(false);
  const [isOpenModalAddFeedback, setIsOpenModalAddFeedback] =
    React.useState<boolean>(false);

  const handleChangeStatus = (status: string) => {
    const phaseId: number = data.id;
    const phaseStatus: string = status;
    dispatch(changeStatusPhaseByBusiness({ phaseId, phaseStatus })).then(
      (result) => {
        if (changeStatusPhaseByBusiness.fulfilled.match(result)) {
          setPhaseData((prevDataTable) => {
            const updatedIndex = prevDataTable.findIndex(
              (item) => item.id === result.payload.id
            );

            if (updatedIndex !== -1) {
              const newDataTable = [...prevDataTable];
              newDataTable[updatedIndex] = result.payload;
              return newDataTable;
            }

            return prevDataTable;
          });
          toast.success("Chuyển trạng thái thành công!");
        } else {
          toast.error("Đã có lỗi xảy ra, chuyển trạng thái thất bại!");
        }

        console.log(result);
      }
    );
  };

  const startPhase = () => {
    const phaseId = data.id;
    const phaseStatus = "Processing";
    dispatch(changeStatusPhaseByBusiness({ phaseId, phaseStatus })).then(
      (result) => {
        if (changeStatusPhaseByBusiness.fulfilled.match(result)) {
          setPhaseData((prevDataTable) => {
            const updatedIndex = prevDataTable.findIndex(
              (item) => item.id === result.payload.id
            );

            if (updatedIndex !== -1) {
              const newDataTable = [...prevDataTable];
              newDataTable[updatedIndex] = {
                ...newDataTable[updatedIndex],
                phase_status: phaseStatus,
              };
              return newDataTable;
            }

            return prevDataTable;
          });
          toast.success("Bắt đầu giai đoạn thành công");
        } else {
          console.log(result.payload);
          toast.error(`${result.payload}`);
        }
      }
    );
  };

  const donePhase = () => {
    const phaseId = data.id;
    const phaseStatus = "Done";
    dispatch(changeStatusPhaseByBusiness({ phaseId, phaseStatus })).then(
      (result: any) => {
        if (changeStatusPhaseByBusiness.fulfilled.match(result)) {
          const dataBodyNoti = {
            notification_type: NOTIFICATION_TYPE.DONE_PHASE_BUSINESS,
            information: `Giai đoạn ${data.phase_number} của dự án ${project?.name_project} đã hoàn thành`,
            sender_email: userLogin?.email,
            receiver_email: project?.business?.email,
            note: project.id,
          };

          dispatch(createNewNotification(dataBodyNoti)).then((resNoti) => {
            console.log(resNoti);
          });

          const dataBodyNotiLecturer = {
            notification_type: NOTIFICATION_TYPE.DONE_PHASE_BUSINESS,
            information: `Giai đoạn ${data.phase_number} của dự án ${project?.name_project} đã hoàn thành`,
            sender_email: userLogin?.email,
            receiver_email: "lecturer@gmail.com",
            note: project.id,
          };

          dispatch(createNewNotification(dataBodyNotiLecturer)).then(
            (resNoti) => {
              console.log(resNoti);
            }
          );

          setPhaseData((prevDataTable) => {
            const updatedIndex = prevDataTable.findIndex(
              (item) => item.id === result.payload.id
            );

            if (updatedIndex !== -1) {
              const newDataTable = [...prevDataTable];
              newDataTable[updatedIndex] = {
                ...newDataTable[updatedIndex],
                phase_status: phaseStatus,
              };
              return newDataTable;
            }

            return prevDataTable;
          });
          toast.success("Hoàn thành giai đoạn thành công");
        } else {
          console.log(result.payload);
          toast.error(`${result.payload}`);
        }
      }
    );
  };

  //xử lý open modal payment method
  const handleOpenModalChoosePaymentMethod = () => {
    setIsOpenModalPhaseDetail(false);
    setIsOpenModalChoosePaymentMethod(true);
  };

  const handleCloseModalChoosePaymentMethod = () => {
    setIsOpenModalChoosePaymentMethod(false);
    setIsOpenModalPhaseDetail(true);
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="h-auto w-auto p-2" variant={"ghost"}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="px-0 pt-3 pb-3 bg-white"
          side="bottom"
          align="start"
          style={{ borderRadius: "7px" }}
        >
          <div className="text-sm font-medium text-center text-neutral-600 pb-4">
            Các chức năng khác
          </div>

          {userLogin?.role_name === "Student" && (
            <>
              <Button
                className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                variant={"ghost"}
                onClick={() => setIsOpenModalPhaseDetail(true)}
              >
                <BiDetail className="w-3 h-3 mr-1" /> Chi tiết giai đoạn
              </Button>

              {data?.phase_status !== "Done" && (
                <Button
                  onClick={onAddCategory}
                  className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                  variant={"ghost"}
                >
                  <BiAddToQueue className="w-3 h-3 mr-1" /> Thêm hạng mục
                </Button>
              )}

              {data?.phase_status !== "Done" &&
                (data?.phase_status === "Pending" ? (
                  <Button
                    onClick={startPhase}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                    variant={"ghost"}
                  >
                    <FcStart className="w-3 h-3 mr-1" /> Bắt đầu giai đoạn
                  </Button>
                ) : (
                  <Button
                    onClick={donePhase}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                    variant={"ghost"}
                  >
                    <BiCheck className="w-3 h-3 mr-1" />
                    Hoàn thành giai đoạn
                  </Button>
                ))}

              {data?.phase_status !== "Done" && (
                <>
                  <Separator className="bg-gray-200/100" />

                  <Button
                    onClick={() => {
                      confirm({
                        centered: true,
                        cancelText: "Quay lại",
                        okText: "Xác nhận",
                        title: `Bạn có chắc muốn xóa giai đoạn ${data.phase_number} của dự án này? `,
                        async onOk() {
                          try {
                            const resDeletePhase = await dispatch(
                              deletePhase(data.id)
                            );

                            if (deletePhase.fulfilled.match(resDeletePhase)) {
                              toast.success("Xóa giai đoạn thành công!");
                              setPhaseData((prevPhaseData) => {
                                const updatedPhaseDataList =
                                  prevPhaseData.filter(
                                    (phase) => phase.id !== data.id
                                  );
                                return updatedPhaseDataList;
                              });
                            } else {
                              toast.error(`${resDeletePhase.payload}`);
                            }
                          } catch (error) {
                            message.error("Có lỗi xảy ra");
                          }
                        },
                        onCancel() {},
                      });
                    }}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                    variant={"ghost"}
                  >
                    <BiTrash className="w-3 h-3 mr-1" />
                    Xóa giai đoạn
                  </Button>
                </>
              )}
            </>
          )}

          {(userLogin?.role_name === "Lecturer" ||
            userLogin?.role_name === "Business" ||
            userLogin?.role_name === "ResponsiblePerson") && (
            <>
              <Button
                className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                variant={"ghost"}
                onClick={() => setIsOpenModalPhaseDetail(true)}
              >
                <BiDetail className="w-3 h-3 mr-1" /> Chi tiết giai đoạn
              </Button>
              <Button
                onClick={() => setIsOpenModalAddFeedback(true)}
                className="rounded-none w-full h-auto p-2 px-5 justify-start hover:bg-gray-200/100"
                variant={"ghost"}
              >
                <Plus className="w-3 h-3 mr-1" /> Thêm feedback
              </Button>
            </>
          )}
        </PopoverContent>
      </Popover>

      {isOpenModalPhaseDetail && (
        <ModalPhaseDetail
          open={isOpenModalPhaseDetail}
          onClose={() => {
            setIsOpenModalPhaseDetail(false);
          }}
          dataPhase={data}
          setPhaseData={setPhaseData}
          handleOpenModalChoosePaymentMethod={
            handleOpenModalChoosePaymentMethod
          }
        />
      )}

      {isOpenModalChoosePaymentMethod && (
        <ModalChoosePaymentMethod
          open={isOpenModalChoosePaymentMethod}
          onClose={handleCloseModalChoosePaymentMethod}
          dataPhase={data}
          setPhaseData={setPhaseData}
        />
      )}

      {isOpenModalAddFeedback && (
        <ModalAddFeedback
          open={isOpenModalAddFeedback}
          onClose={() => setIsOpenModalAddFeedback(false)}
          dataPhase={data}
          setPhaseData={setPhaseData}
        />
      )}
    </>
  );
};

export default ListOptions;
