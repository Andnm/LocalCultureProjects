import React, { useState } from "react";
import toast from "react-hot-toast";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { generateFileNameImage } from "@/src/utils/handleFunction";
import { createEvidence } from "@/src/redux/features/evidenceSlice";
import "./style.scss";
import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useAppDispatch } from "@/src/redux/store";
import { FormInput } from "@/src/components/form/FormInput";
import { NOTIFICATION_TYPE } from "@/src/constants/notification";
import { createNewNotification } from "@/src/redux/features/notificationSlice";
import { useUserLogin } from "@/src/hook/useUserLogin";

interface ImageUploadProps {
  cost: any;
  setCost: React.Dispatch<React.SetStateAction<any[]>>;
  evidence: any;
  setEvidence: React.Dispatch<React.SetStateAction<any[]>>;
  dataCategory: any;
  project: any;
  phaseData: any;
}

const ImageUpload = ({
  dataCategory,
  project,
  phaseData,
  cost,
  setCost,
  evidence,
  setEvidence,
}: ImageUploadProps) => {

  const dispatch = useAppDispatch();

  const [isOpenConfirmCancelAction, setIsOpenConfirmCancelAction] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preImgLoad, setPreImgLoad] = useState(null || "");
  const [imageLoad, setImageLoad] = useState<any>("");
  const [descriptionImg, setDescriptionImg] = useState<string>("");

  const [userLogin, setUserLogin] = useUserLogin();

  const actionCloseUploadAvatar = () => {
    if (preImgLoad) {
      setIsOpenConfirmCancelAction(true);
    } else {
      setPreImgLoad("");
    }
  };

  const handleSaveUpdateAvatar = async () => {
    setIsLoading(true);
    handleSubmit();
  };

  const handleSubmit = () => {
    const fileName = generateFileNameImage();
    const imageRef = ref(storage, fileName);
    uploadBytes(imageRef, imageLoad)
      .then(() => {
        getDownloadURL(imageRef)
          .then(async (url) => {
            setIsLoading(true);
            // call API

            const dataBody = {
              description: descriptionImg,
              evidence_url: url,
              costId: parseInt(cost.id, 10),
            };

            dispatch(createEvidence(dataBody)).then((result) => {
              if (createEvidence.fulfilled.match(result)) {
                const dataBodyNoti = {
                  notification_type: NOTIFICATION_TYPE.POST_EVIDENCE_BUSINESS,
                  information: `Bạn có chi phí cần được xác nhận ở dự án ${project?.name_project} tại giai đoạn ${dataCategory?.phase?.phase_number} trong hạng mục ${dataCategory?.category_name}`,
                  sender_email: `${userLogin?.email}`,
                  receiver_email: "business@gmail.com",
                };

                dispatch(createNewNotification(dataBodyNoti)).then(
                  (resNoti) => {
                    console.log(resNoti);
                  }
                );

                setEvidence((preData) => [...preData, result.payload]);
                toast.success("Cập nhập bằng chứng thành công!");
                setPreImgLoad("");
                setIsLoading(false);
              } else {
                toast.error(`${result.payload}`);
              }
            });
            setPreImgLoad("");
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleCancelConfirm = () => {
    setPreImgLoad("");
    setIsOpenConfirmCancelAction(false);
  };

  const handleRemoveImage = () => {
    setPreImgLoad("");
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file: File | null = event.target.files?.[0] || null;
    const reader: FileReader = new FileReader();

    setImageLoad(file);

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        setPreImgLoad(e.target.result as string);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="upload-image-box">
        <div className="flex justify-center items-center flex-col">
          <div className="custom-file-upload">
            {!preImgLoad ? (
              <label htmlFor="file">
                <div className="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill=""
                    viewBox="0 0 24 24"
                  >
                    <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      id="SVGRepo_tracerCarrier"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        fill=""
                        d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                        clipRule="evenodd"
                        fillRule="evenodd"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
                <div className="text">
                  <span>Bấm vào đây để đăng ảnh</span>
                </div>
                <input type="file" id="file" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="img-upload">
                <div
                  className="remove-img flex justify-center items-center"
                  onClick={handleRemoveImage}
                >
                  X
                </div>
                <img src={preImgLoad} alt="picture"></img>
              </div>
            )}
          </div>
        </div>
      </div>

      {preImgLoad && (
        <div className="flex justify-center gap-4 flex-col items-center mt-4">
          <FormInput
            type="text"
            id="descriptionImg"
            className="w-full px-2 py-1 h-7 border-neutral-200/100 bg-white transition"
            placeholder="Nhập vào mô tả hình ảnh ..."
            value={descriptionImg}
            onChange={(e) => setDescriptionImg(e.target.value)}
          />

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleCancelConfirm}
              className="rounded-sm bg-orange-200 border-orange-200 border-2"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveUpdateAvatar}
              className="rounded-sm bg-blue-200 border-blue-200 border-2"
            >
              Xác nhận thêm bằng chứng
            </Button>
          </div>
        </div>
      )}

      {isLoading && <SpinnerLoading />}
    </div>
  );
};

export default ImageUpload;
