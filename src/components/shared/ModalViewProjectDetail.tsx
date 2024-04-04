import { Button } from "@/components/ui/button";
import {
  convertToNumberFormat,
  generateFallbackAvatar,
  truncateString,
} from "@/src/utils/handleFunction";
import { Dialog, Transition } from "@headlessui/react";
import { Check, Edit, X } from "lucide-react";
import Link from "next/link";
import { CSSProperties, Fragment } from "react";

interface ModalProps {
  open: boolean;
  title: React.ReactNode;
  actionClose?: any;
  actionConfirm?: any;
  buttonClose?: string;
  buttonConfirm?: string;
  status?: any;
  selectedProject: any;
}

export default function ModalViewProjectDetail({
  open,
  title,
  actionClose,
  buttonClose,
  actionConfirm,
  buttonConfirm,
  status,
  selectedProject,
}: ModalProps) {
  const handleDownloadFile = (object: any) => {
    const link = document.createElement("a");
    link.href = object;
    link.download = `${object}_introduction`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeByClickBackground = () => {
    if (actionClose) {
      actionClose();
    }
  };

  const styleOverlay: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeByClickBackground}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 blur-sm opacity-20" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center relative z-50">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`relative z-40 w-full max-w-full transform overflow-hidden rounded-2xl bg-gray-100 p-6 text-left align-middle transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-end"
                  >
                    <X className="cursor-pointer" onClick={actionClose} />
                  </Dialog.Title>

                  <div className="bg-gray-100">
                    <div className="container">
                      <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                        <div className="col-span-4 sm:col-span-3">
                          <div className="bg-white shadow rounded-lg p-6">
                            <div className="flex flex-col items-center">
                              <img
                                src={
                                  selectedProject?.business?.avatar_url
                                    ? selectedProject?.business?.avatar_url
                                    : generateFallbackAvatar(
                                        selectedProject?.business?.fullname
                                      )
                                }
                                className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0 object-cover"
                              ></img>
                              <h1 className="text-xl font-bold">
                                {selectedProject?.business?.fullname}
                              </h1>
                              <p className="text-gray-700">
                                {selectedProject?.business_sector}
                              </p>
                              <p className="text-gray-700">
                                {selectedProject?.business?.email}
                              </p>
                              {selectedProject?.business?.link_web && (
                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                  <Link
                                    href={`${selectedProject?.business?.link_web}`}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                                    target="_blank"
                                  >
                                    Web
                                  </Link>
                                </div>
                              )}
                            </div>
                            <hr className="my-6 border-t border-gray-300" />
                            <div className="flex flex-col">
                              <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                                Thông tin liên lạc
                              </span>
                              <ul>
                                <li className="mb-2">
                                  <span className="font-bold">
                                    Số điện thoại:{" "}
                                  </span>{" "}
                                  {selectedProject?.business?.phone_number ? (
                                    selectedProject?.business?.phone_number
                                  ) : (
                                    <span style={{ fontStyle: "italic" }}>
                                      Chưa cập nhập
                                    </span>
                                  )}
                                </li>
                                <li className="mb-2">
                                  <span className="font-bold">Địa chỉ: </span>
                                  {selectedProject?.business?.address_detail ? (
                                    selectedProject?.business?.address_detail +
                                    ", " +
                                    selectedProject?.business?.address
                                  ) : (
                                    <span style={{ fontStyle: "italic" }}>
                                      Chưa cập nhập
                                    </span>
                                  )}
                                </li>
                              </ul>

                              <hr className="my-6 border-t border-gray-300" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                                Thông tin khác
                              </span>
                              <ul>
                                <li className="mb-2">
                                  <span className="font-bold">
                                    Lĩnh vực kinh doanh:{" "}
                                  </span>{" "}
                                  {selectedProject?.business
                                    ?.business_sector ? (
                                    selectedProject?.business?.business_sector
                                  ) : (
                                    <span style={{ fontStyle: "italic" }}>
                                      Chưa cập nhập
                                    </span>
                                  )}
                                </li>
                                <li className="mb-2">
                                  <span className="font-bold">Mô tả: </span>
                                  {selectedProject?.business
                                    ?.business_description ? (
                                    truncateString(
                                      selectedProject?.business
                                        ?.business_description,
                                      25
                                    )
                                  ) : (
                                    <span style={{ fontStyle: "italic" }}>
                                      Chưa cập nhập
                                    </span>
                                  )}
                                </li>
                              </ul>

                              <hr className="my-6 border-t border-gray-300" />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-9">
                          <div className="bg-white shadow rounded-lg p-6 relative">
                            <h2 className="text-xl font-bold mb-4">
                              Tên dự án
                            </h2>
                            <p className="text-gray-700 text-2xl">
                              {selectedProject?.name_project}
                            </p>

                            {/* Nút phê duyệt */}
                            {status === "Pending" && (
                              <div className="mt-4 flex gap-4 justify-end absolute right-3 top-1">
                                <button
                                  type="button"
                                  className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={actionClose}
                                  style={{ borderRadius: "10px" }}
                                >
                                  <Edit />
                                  {buttonClose}
                                </button>

                                <button
                                  type="button"
                                  className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                  onClick={actionConfirm}
                                  style={{ borderRadius: "10px" }}
                                >
                                  <Check /> {buttonConfirm}
                                </button>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                <h2 className="text-xl font-bold mt-6 mb-4">
                                  Hướng đi dự án
                                </h2>
                                <p className="text-gray-700">
                                  -{" "}
                                  {selectedProject?.business_type === "Project"
                                    ? "Triển khai dự án"
                                    : "Lên kế hoạch"}
                                </p>
                              </div>

                              <div className="flex flex-col">
                                <h2 className="text-xl font-bold mt-6 mb-4">
                                  Tài liệu liên quan
                                </h2>
                                <p className="text-gray-700">
                                  {selectedProject?.document_related_link ? (
                                    selectedProject.document_related_link
                                      .length > 0 ? (
                                      <Button
                                        className="font-normal transition text-white hover:text-red-600 border border-cyan-600 bg-cyan-600"
                                        onClick={() =>
                                          handleDownloadFile(
                                            selectedProject.document_related_link
                                          )
                                        }
                                      >
                                        Tải xuống tài liệu
                                      </Button>
                                    ) : (
                                      <span className="italic">
                                        {" "}
                                        (Chưa được cập nhập)
                                      </span>
                                    )
                                  ) : (
                                    <span className="italic">
                                      {" "}
                                      (Chưa được cập nhập)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Mục đích Dự án
                            </h2>
                            <p className="text-gray-700">
                              - {selectedProject?.purpose}
                            </p>

                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Đối tượng mục tiêu
                            </h2>
                            <p className="text-gray-700">
                              - {selectedProject?.target_object}
                            </p>

                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Yêu cầu cụ thể
                            </h2>
                            <p className="text-gray-700">
                              {selectedProject?.request ? (
                                "- " + selectedProject?.request
                              ) : (
                                <span className="italic">
                                  (Chưa được cập nhập)
                                </span>
                              )}
                            </p>

                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Ngân sách dự kiến
                            </h2>
                            <p className="text-gray-700">
                              {convertToNumberFormat(
                                selectedProject?.expected_budget
                              )}{" "}
                              VNĐ
                            </p>

                            {selectedProject?.note && (
                              <>
                                <h2 className="text-xl font-bold mt-6 mb-4">
                                  Chú thích
                                </h2>
                                <p className="text-gray-700">
                                  - {selectedProject?.note}
                                </p>
                              </>
                            )}

                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Thời gian
                            </h2>
                            <p className="text-gray-700">
                              {selectedProject?.project_implement_time}
                            </p>

                            <h2 className="text-xl font-bold mt-6 mb-4">
                              Người phụ trách
                            </h2>
                            <div className="bg-gray-100 p-4 rounded-lg shadow-md grid grid-cols-3">
                              <div className="mb-4">
                                <p className="font-semibold">Họ và tên:</p>
                                <p>
                                  {
                                    selectedProject?.responsible_person
                                      ?.fullname
                                  }
                                </p>
                              </div>
                              <div className="mb-4">
                                <p className="font-semibold">Số điện thoại:</p>
                                <p>
                                  {
                                    selectedProject?.responsible_person
                                      ?.phone_number
                                  }
                                </p>
                              </div>
                              <div className="mb-4">
                                <p className="font-semibold">Email:</p>
                                <p>
                                  {selectedProject?.responsible_person?.email}
                                </p>
                              </div>
                              <div className="mb-4">
                                <p className="font-semibold">Chức vụ:</p>
                                <p>
                                  {
                                    selectedProject?.responsible_person
                                      ?.position
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="font-semibold">
                                  Thông tin liên hệ khác:
                                </p>
                                <p>
                                  {selectedProject?.responsible_person
                                    ?.other_contact ? (
                                    selectedProject?.responsible_person
                                      ?.other_contact
                                  ) : (
                                    <span className="italic text-gray-500">
                                      Chưa cập nhập
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="overlay" style={styleOverlay}></div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
