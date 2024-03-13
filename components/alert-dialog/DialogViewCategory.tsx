"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Header } from "./_components/header";
import { Edit, Layout } from "lucide-react";
import {
  changeStatusFromEnToVn,
  formatCurrency,
  formatDate,
} from "@/src/utils/handleFunction";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import {
  changeStatusCost,
  createCost,
  getCostInCategory,
} from "@/src/redux/features/costSlice";
import AdminSpinnerLoading from "@/src/components/loading/AdminSpinnerLoading";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import ImageUpload from "./_components/ImageUpload";
import { useUserLogin } from "@/src/hook/useUserLogin";
import toast from "react-hot-toast";
import { getEvidenceInCost } from "@/src/redux/features/evidenceSlice";
import { EvidenceType } from "@/src/types/evidence.type";

interface DialogViewCategoryProps {
  project: any;
  phaseData?: any;
  open: boolean;
  dataCategory: any;
  setDataCategory: React.Dispatch<React.SetStateAction<any[]>>;
  actionClose: () => void;
}

const DialogViewCategory = ({
  project,
  open,
  dataCategory,
  setDataCategory,
  actionClose,
}: DialogViewCategoryProps) => {
  const [cost, setCost] = React.useState<any>("");
  const [phaseData, setPhaseData] = React.useState<any>(dataCategory);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [userLogin, setUserLogin] = useUserLogin();
  const [editingField, setEditingField] = React.useState(null);
  const [editedValue, setEditedValue] = React.useState("");

  // cost
  const [isCreatingCost, setIsCreatingCost] = React.useState(false);
  const [newExpectedCost, setNewExpectedCost] = React.useState("");

  //evidence
  const [evidence, setEvidence] = React.useState<any>([]);

  const handleOpenCreateCost = () => {
    setIsCreatingCost(true);
  };

  const handleCloseCreateCost = () => {
    setIsCreatingCost(false);
    setNewExpectedCost("");
  };

  const handleUpdateExpectedCost = () => {
    const updatedCost = {
      actual_cost: null,
      category: dataCategory.id,
      cost_status: "Not Transferred",
      createdAt: new Date().toISOString(),
      expected_cost: newExpectedCost,
    };

    const dataBody = {
      expected_cost: parseInt(newExpectedCost, 10),
      categoryId: parseInt(dataCategory.id, 10),
      phaseId: dataCategory.phase.id,
    };

    dispatch(createCost(dataBody)).then((result: any) => {
      if (createCost.fulfilled.match(result)) {
        setCost(updatedCost);
        toast.success("Chi phí đã được cập nhật");
      } else {
        toast.error("Chi phí cập nhật thất bại");
      }
    });

    handleCloseCreateCost();
  };

  const startEditing = (field: any, data: any) => {
    setEditingField(field);
    setEditedValue(data[field] || "");
    setIsEditing(true);
  };

  const handleEditField = (field: any, value: any, data: any) => {
    const updatedDataCategory = { ...data, [field]: value };
    toast.success(`Thay đổi ${field} thành công`);
    setPhaseData(updatedDataCategory);
    setEditingField(null);
    setEditedValue("");
    setIsEditing(false);
  };

  const handleChangeStatus = (status: string) => {
    let costStatus = "Not Transferred";
    if (status === "Not Transferred") {
      costStatus = "Transferred";
    } else {
      costStatus = "Received";
    }

    const id = cost.id;
    dispatch(changeStatusCost({ id, costStatus })).then((result) => {
      if (changeStatusCost.fulfilled.match(result)) {
        // console.log(cost);
        // console.log(result.payload);
        setCost(result.payload);
        toast.success("Chuyển trạng thái thành công!");
      } else {
        toast.error(`${result.payload}`);
      }
    });
  };

  React.useEffect(() => {
    setIsLoading(true);

    dispatch(getCostInCategory(dataCategory.id))
      .then((result) => {
        if (getCostInCategory.fulfilled.match(result)) {
          // console.log("cost", result.payload);
          setCost(result.payload);

          dispatch(getEvidenceInCost(result.payload.id)).then((res) => {
            if (getEvidenceInCost.fulfilled.match(res)) {
              setEvidence(res.payload);
              // console.log("res", res.payload);
            } else {
              // toast.error("Lỗi khi tải bằng chứng");
            }
          });
        } else {
          // console.log("error", result.payload);
        }
      })
      .catch((error) => {
        console.error("Error during cost fetch:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={actionClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 opacity-80 blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                  {isLoading ? (
                    <div className="h-56">
                      <SpinnerLoading />
                    </div>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        <div className="flex items-start gap-x-3 mb-6 w-full">
                          <Layout className="h-5 w-5 mt-1 text-neutral-700" />
                          <div
                            className="font-semibold text-xl px-1 text-neutral-700
          bg-transparent border-transparent relative -left-1.5 w-[95%] 
          focus-visible:bg-while focus-visible:border-input mb-0.5 truncate"
                          >
                            {phaseData.category_name}
                          </div>
                        </div>
                      </Dialog.Title>

                      <div>
                        <div>
                          <h2 className="flex items-center gap-2 text-lg font-bold">
                            Thông tin hạng mục
                            {/* <Edit className="cursor-pointer w-4 h-4" /> */}
                          </h2>
                          <div className="grid grid-cols-2 gap-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Trạng thái:
                              </span>
                              <span className="font-semibold flex items-center gap-2">
                                {changeStatusFromEnToVn(
                                  phaseData.category_status
                                )}
                                {userLogin?.role_name === "Student" && (
                                  <Edit className="cursor-pointer w-4 h-4" />
                                )}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Chi tiết:
                              </span>
                              <span className="font-semibold">
                                {phaseData.detail}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Kết quả mong muốn:
                              </span>
                              <span className="font-semibold">
                                {phaseData.result_expected}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">
                                Kết quả thực tế:
                              </span>
                              <span className="font-semibold">
                                {phaseData.result_actual ? (
                                  phaseData.result_actual
                                ) : isEditing &&
                                  editingField === "result_actual" ? (
                                  <>
                                    <input
                                      type="text"
                                      value={editedValue}
                                      onChange={(e) =>
                                        setEditedValue(e.target.value)
                                      }
                                      className="border border-gray-300 px-2 py-1 rounded"
                                    />
                                    <button
                                      className="bg-orange-500 text-white px-3 py-1 rounded ml-2"
                                      onClick={() => {
                                        setIsEditing(false);
                                        setEditingField(null);
                                        setEditedValue("");
                                      }}
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                                      onClick={() => {
                                        handleEditField(
                                          "result_actual",
                                          editedValue,
                                          phaseData
                                        );
                                      }}
                                    >
                                      Thay đổi
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    (Chưa cập nhập){" "}
                                    {userLogin?.role_name === "Student" && (
                                      <Edit
                                        className="cursor-pointer w-4 h-4"
                                        onClick={() =>
                                          startEditing(
                                            "result_actual",
                                            phaseData
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h2 className="flex items-center gap-2 text-lg font-bold">
                            Chi phí
                          </h2>

                          {isCreatingCost ? (
                            <div className="grid gap-4 px-4">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  Chi phí ước chừng:
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newExpectedCost}
                                    onChange={(e) =>
                                      setNewExpectedCost(e.target.value)
                                    }
                                    className="border border-gray-300 px-2 py-1 rounded"
                                  />
                                  <button
                                    className="bg-orange-500 text-white px-3 py-1 rounded ml-2"
                                    onClick={handleCloseCreateCost}
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
                                    onClick={handleUpdateExpectedCost}
                                  >
                                    Thay đổi
                                  </button>
                                </span>
                              </div>
                            </div>
                          ) : cost ? (
                            <div className="grid grid-cols-2 gap-4 px-4">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  Chi phí ước chừng:
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                  {formatCurrency(cost.expected_cost)}
                                  {userLogin?.role_name === "Student" && (
                                    <Edit className="cursor-pointer w-4 h-4" />
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  Ngày thêm:
                                </span>
                                <span className="font-semibold">
                                  {formatDate(cost.createdAt)}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  Trạng thái thanh toán:
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                  {changeStatusFromEnToVn(cost.cost_status)}
                                  {cost.cost_status !== "Received" &&
                                    userLogin?.role_name === "Student" && (
                                      <Edit
                                        className="cursor-pointer w-4 h-4"
                                        onClick={() =>
                                          handleChangeStatus(cost.cost_status)
                                        }
                                      />
                                    )}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">
                                  Chi phí thực tế:
                                </span>
                                <span className="font-semibold flex items-center gap-2">
                                  {formatCurrency(cost.actual_cost)}
                                  {userLogin?.role_name === "Student" && (
                                    <Edit className="cursor-pointer w-4 h-4" />
                                  )}
                                </span>
                              </div>
                            </div>
                          ) : userLogin?.role_name === "Student" ? (
                            <button
                              className="bg-blue-500 text-white text-sm px-4 py-2 rounded"
                              onClick={handleOpenCreateCost}
                            >
                              Tạo chi phí
                            </button>
                          ) : (
                            <p className="pl-4">(Chưa được cập nhập)</p>
                          )}
                        </div>

                        <div className="mt-4">
                          <h2 className="flex items-center gap-2 text-lg font-bold">
                            Bằng chứng
                          </h2>

                          <div>
                            {evidence?.length > 0 ? (
                              evidence.map((item: any, index: number) => (
                                <div key={index} className="mb-4">
                                  <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">
                                      Ảnh bằng chứng:
                                    </span>
                                    <img
                                      src={item.evidence_url}
                                      alt="pic"
                                      className="w-20 h-20"
                                    ></img>
                                  </div>

                                  <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">
                                      Mô tả ảnh:
                                    </span>
                                    <span className="font-semibold flex items-center gap-2">
                                      {item.description}
                                      {userLogin?.role_name === "Student" && (
                                        <Edit className="cursor-pointer w-4 h-4" />
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : userLogin?.role_name === "Student" ? (
                              <ImageUpload
                                project={project}
                                phaseData={phaseData}
                                cost={cost}
                                setCost={setCost}
                                evidence={evidence}
                                setEvidence={setEvidence}
                                dataCategory={dataCategory}
                              />
                            ) : (
                              <p className="pl-4">(Chưa được cập nhập)</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DialogViewCategory;
