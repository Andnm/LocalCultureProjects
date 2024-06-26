"use client";

import React, { useState } from "react";
import Footer from "@/src/components/landing/Footer";
import "./style.scss";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import {
  generateRandomString,
  truncateString,
  validateEmail,
} from "@/src/utils/handleFunction";
import { MdDeleteOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { createNewSupport } from "@/src/redux/features/supportSlice";
import CustomModal from "@/src/components/shared/CustomModal";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { getAllAdmin } from "@/src/redux/features/authSlice";

const supportTypes = [
  "Về kỹ thuật",
  "Về việc tạo tài khoản",
  "Về vấn đề xảy ra lỗi",
  "Về Yêu cầu sản phẩm",
  "Về Góp ý",
  "Khác",
];

const ContactUs = () => {
  const dispatch = useAppDispatch();
  const { loadingSupport } = useAppSelector((state) => state.support);

  const [selectedSupportType, setSelectedSupportType] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    support_type: "bất cập",
    support_content: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    email: "",
    support_type: "",
    support_content: "",
  });

  const [supportImageOrigin, setSupportImageOrigin] = useState<any[]>([]);
  const [supportImage, setSupportImage] = useState<any[]>([]);

  const [openModalConfirmAction, setOpenModalConfirmAction] = useState(false);

  //xử lý data
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSupportTypeChange = (e: any) => {
    setSelectedSupportType(e.target.value);
    setFormData((prevState) => ({
      ...prevState,
      support_type: e.target.value,
    }));
  };

  const handleSendEmail = (e: any) => {
    e.preventDefault();

    const newErrors = {
      fullname: "",
      email: "",
      support_type: "",
      support_content: "",
    };

    if (!formData.fullname) {
      newErrors.fullname = "Vui lòng nhập họ và tên.";
    }

    if (!formData.email) {
      newErrors.email = "Vui lòng nhập số điện thoại.";
    } else if (!formData.email.startsWith("0")) {
      newErrors.email = "Số điện thoại không hợp lệ.";
    }

    if (!formData.support_type) {
      newErrors.support_type = "Vui lòng nhập chủ đề hỗ trợ.";
    }

    if (!formData.support_content) {
      newErrors.support_content = "Vui lòng nhập nội dung hỗ trợ.";
    }

    if (
      newErrors.fullname ||
      newErrors.email ||
      newErrors.support_type ||
      newErrors.support_content
    ) {
      setErrors(newErrors);
      return;
    } else {
      setOpenModalConfirmAction(true);
    }
  };

  // call api
  const handleCallApiSendSupport = async () => {
    // Xử lý UP ẢNH LÊN FIREBASE TRƯỚC
    let supportImageURLs: any = [];
    let supportImageURL = "";

    if (supportImageOrigin.length > 0) {
      const uploadPromises: any[] = [];
      const uploadedFiles: any[] = [];

      const supportImageOriginDownload = supportImageOrigin.map((file) => {
        const randomFileName = generateRandomString();
        const storageRef = ref(storage, `khoduan/${randomFileName}`);
        const uploadTask = uploadBytes(storageRef, file);
        uploadPromises.push(uploadTask);
        uploadedFiles.push({ path: `khoduan/${randomFileName}`, file });
        return uploadTask.then(() => getDownloadURL(storageRef));
      });

      await Promise.all(uploadPromises);

      supportImageURLs = await Promise.all(supportImageOriginDownload);
      if (supportImageURLs.length > 0) {
        supportImageURL = supportImageURLs[0];
      }
    }

    const dataBody = {
      ...formData,
      support_image: supportImageURL,
    };

    const resCreate = await dispatch(createNewSupport(dataBody));

    if (createNewSupport.fulfilled.match(resCreate)) {
      toast.success("Gửi mail thành công !");

      (async () => {
        try {
          const resGetAllAdmin = await dispatch(getAllAdmin());

          await Promise.all(
            resGetAllAdmin.payload.map(async (email: any) => {
              const dataBodyNoti = {
                notification_type: NOTIFICATION_TYPE.SEND_SUPPORT_TO_ADMIN,
                information: "Có một yêu cầu hỗ trợ vừa mới gửi tới!",
                sender_email: formData.email,
                receiver_email: email,
              };

              const resNoti = await dispatch(
                createNewNotification(dataBodyNoti)
              );
              console.log(resNoti);
            })
          );

          setOpenModalConfirmAction(false);

          setSupportImageOrigin([]);
          setSupportImage([]);

          setFormData({
            fullname: "",
            email: "",
            support_type: "",
            support_content: "",
          });

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        } catch (error) {
          console.error(error);
        }
      })();
    } else {
      toast.error("Có vấn đề xảy ra!");
      toast.error(`${resCreate.payload}`);
    }
  };

  // xử lý file
  const handleOnDrop = (acceptedFiles: any) => {
    setSupportImageOrigin([...supportImageOrigin, ...acceptedFiles]);
    setSupportImage([...supportImage, ...acceptedFiles]);

    acceptedFiles?.forEach((file: any) => {
      previewImage(file);
    });
  };

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    onDrop: handleOnDrop,
  });

  const previewImage = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (e.target) {
        const imageUrl = e.target.result as string;

        setSupportImage((prevFiles: any) =>
          prevFiles.map((prevFile: any) =>
            prevFile.name === file.name
              ? { ...prevFile, previewUrl: imageUrl }
              : prevFile
          )
        );
      }
    };
  };

  const removeImage = (path: any) => {
    setSupportImage((prevFiles: any) =>
      prevFiles.filter((file: any) => file.path !== path)
    );
  };

  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="container px-6 py-12 mx-auto">
          <div>
            <p className="font-medium text-blue-500 dark:text-blue-400">
              Liên hệ
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-gray-800 md:text-3xl dark:text-white">
              Gửi mail tới đội ngũ của chúng tôi
            </h1>

            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Điền thông tin cần thiết nếu bạn muốn có bất kì hỗ trợ nào!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 mt-4">
            <div className="text-center">
              <span className="inline-block p-3 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </span>

              <h2 className="mt-4 text-base font-medium text-gray-800 dark:text-white">
                Email
              </h2>

              <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">
                anhhvq@fe.edu.vn
              </p>
            </div>

            <div className="text-center">
              <span className="inline-block p-3 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              </span>

              <h2 className="mt-4 text-base font-medium text-gray-800 dark:text-white">
                Phone
              </h2>
              <p className="mt-2 text-sm text-blue-500 dark:text-blue-400">
                +84367082493
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSendEmail}
            className="grid grid-cols-1 gap-10 mt-10 md:grid-cols-2 bg-gray-50"
          >
            <div className="p-4 py-6 rounded-lg">
              <div className="-mx-2 md:items-center md:flex">
                <div className="flex-1 px-2">
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Vui lòng cung cấp họ tên của bạn{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    type="text"
                    placeholder="Đặng Văn A"
                    className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.fullname && (
                    <p className="text-red-500">{errors.fullname}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="0123xxxxxxx"
                  className="block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 space-y-2 mt-4">
                <label className="cursor-pointer block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Đính kèm hình ảnh (Nếu cần)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    {...getRootProps({
                      isFocused,
                      isDragAccept,
                      isDragReject,
                    })}
                    className="bg-white flex flex-col rounded-lg border-4 border-dashed w-full h-fit p-6 group text-center"
                  >
                    {supportImage.length > 0 ? (
                      <div className="form-group mb-0">
                        <div className="photo-uploaded">
                          <p className="font-semibold text-sm text-center">
                            Ảnh đã chọn
                          </p>

                          <ul className="list-photo flex flex-wrap gap-1 justify-center">
                            {supportImage.map((file: any) => (
                              <li key={file.path}>
                                <div
                                  className="photo-item relative overflow-hidden"
                                  style={{
                                    width: "130px",
                                    height: "72px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {file.previewUrl ? (
                                    <img
                                      src={file.previewUrl}
                                      alt={file.path}
                                      className="block w-full h-full object-cover"
                                    />
                                  ) : (
                                    <p>Loading...</p>
                                  )}
                                  <div className="delete-item">
                                    <MdDeleteOutline
                                      onClick={() => removeImage(file.path)}
                                    />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="cursor-pointer w-full text-center flex flex-col items-center justify-center items-center  ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>

                          <p className="pointer-none text-gray-500 ">
                            <span className="text-sm">Kéo / thả ảnh </span>{" "}
                            <br /> hoặc là{" "}
                            <span className="text-blue-500">bấm vào đây</span>{" "}
                            để tải ảnh lên từ thiết bị
                          </p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 py-6 rounded-lg">
              <div className="w-full mt-4">
                <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="block w-full h-32 px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg md:h-56 dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Mô tả vấn đề"
                  name="support_content"
                  value={formData.support_content}
                  onChange={handleChange}
                ></textarea>
                {errors.support_content && (
                  <p className="text-red-500">{errors.support_content}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="col-span-2 w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
            >
              Gửi lời nhắn
            </button>
          </form>
        </div>
      </section>
      <Footer />

      {openModalConfirmAction && (
        <CustomModal
          open={openModalConfirmAction}
          title={<h2 className="text-2xl font-semibold">Xác nhận gửi</h2>}
          body={
            "Bạn có chắc muốn tạo mail nhắn tới chúng tôi với những thông tin mà đã điền hay không?"
          }
          actionClose={() => setOpenModalConfirmAction(false)}
          buttonClose={"Hủy"}
          actionConfirm={handleCallApiSendSupport}
          buttonConfirm={"Xác nhận"}
          styleWidth={"max-w-xl"}
          status={"Pending"} //truyền pending để hiện button action
        />
      )}

      {loadingSupport && <SpinnerLoading />}
    </>
  );
};

export default ContactUs;
