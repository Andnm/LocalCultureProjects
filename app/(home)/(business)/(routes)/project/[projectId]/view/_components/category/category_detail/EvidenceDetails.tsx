import React from "react";
import { Button, Image, Modal, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { useAppDispatch } from "@/src/redux/store";
import { createEvidence } from "@/src/redux/features/evidenceSlice";
import { CreateEvidenceType } from "@/src/types/evidence.type";
import toast from "react-hot-toast";

const { confirm } = Modal;

interface Props {
  userLogin: any;
  costId: number;
  fileListOrigin: any[];
  setFileListOrigin: React.Dispatch<React.SetStateAction<any[]>>;
  fileUpdateList: any[];
  setFileUpdateList: React.Dispatch<React.SetStateAction<any[]>>;
  handleUploadChange: (info: any) => void;
}

const EvidenceDetails: React.FC<Props> = ({
  userLogin,
  costId,
  fileListOrigin,
  setFileListOrigin,
  fileUpdateList,
  setFileUpdateList,
  handleUploadChange,
}) => {
  const dispatch = useAppDispatch();

  const handleUpdateEvidence = async () => {
    toast(
      "Tiến trình xử lý sẽ hơi lâu, phụ thuộc vào số ảnh được đăng. Vui lòng chờ trong giây lát!",
      {
        style: {
          borderRadius: "10px",
          background: "#FFAF45",
          color: "white",
          fontWeight: 500,
        },
      }
    );

    let documentLinkList: string[] = [];

    for (let i = 0; i < fileUpdateList.length; i++) {
      const file = fileUpdateList[i]?.originFileObj;

      if (file) {
        const storageRef = ref(storage, `khoduan/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        try {
          await uploadTask;
          const downloadURL = await getDownloadURL(storageRef);
          documentLinkList.push(downloadURL);
        } catch (error) {
          message.error(`File upload failed: ${file.name}`);
          return;
        }
      }
    }

    if (documentLinkList.length > 0) {
      try {
        for (let j = 0; j < documentLinkList.length; j++) {
          const dataBody: CreateEvidenceType = {
            costId: costId,
            description: "hmmm",
            evidence_url: documentLinkList[j],
          };

          const resCreateEvidence = await dispatch(createEvidence(dataBody));

          if (createEvidence.rejected.match(resCreateEvidence)) {
            toast.error(`${resCreateEvidence.payload}`);
          }
        }

        setFileListOrigin((prev) => [...prev, ...documentLinkList]);
        setFileUpdateList([]);
        message.success("Đăng bằng chứng thành công!");
      } catch (error) {
        message.error("Failed to create evidence.");
      }
    } else {
      message.error("No files to upload.");
    }
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <p className="font-bold text-lg">Bằng chứng</p>
        {userLogin?.role_name === "Student" && (
          <div className="flex flex-row gap-3">
            {fileUpdateList.length >= 1 && (
              <Button
                type="primary"
                onClick={async () => {
                  confirm({
                    centered: true,
                    cancelText: "Hủy",
                    okText: "Xác nhận",
                    title: `Bạn có chắc muốn cập nhập bằng chứng cho giai đoạn này?`,
                    onOk: async () => {
                      try {
                        await handleUpdateEvidence();
                      } catch (error) {
                        message.error("Có lỗi xảy ra khi cập nhập!");
                      }
                    },
                  });
                }}
              >
                Đăng bằng chứng
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mx-4 mt-3">
        {fileListOrigin.length > 0 ? (
          <>
            <p className="mb-3">Hiện có</p>
            <div className="flex gap-2">
              {fileListOrigin.map((imageUrl, index) => (
                <div className="border-2 rounded-lg border-dashed w-[102px] h-[102px] flex items-center justify-center p-2">
                  <Image
                    key={index}
                    className="block object-cover"
                    src={imageUrl}
                    alt={`Ảnh ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="">Chưa có bằng chứng nào được đăng!</p>
        )}
      </div>

      {userLogin?.role_name === "Student" && (
        <div className="mx-4 mt-5">
          <Upload
            action=""
            listType="picture-card"
            fileList={fileUpdateList}
            onChange={handleUploadChange}
            multiple
            onPreview={async (file) => {
              let src = file.url as string;
              if (!src) {
                src = await new Promise((resolve) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file.originFileObj as RcFile);
                  reader.onload = () => resolve(reader.result as string);
                });
              }
              const imgWindow = window.open(src);
              imgWindow!.document.write(`<img src="${src}" />`);
            }}
          >
            {fileUpdateList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
              </div>
            )}
          </Upload>
        </div>
      )}
    </>
  );
};

export default EvidenceDetails;
