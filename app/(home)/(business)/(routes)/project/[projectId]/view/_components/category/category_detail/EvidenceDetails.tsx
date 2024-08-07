"use client";
import React, { useEffect, useState } from "react";
import { Button, Image, Modal, Upload, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { useAppDispatch } from "@/src/redux/store";
import {
  createEvidence,
  updateEvidences,
} from "@/src/redux/features/evidenceSlice";
import { CreateEvidenceType } from "@/src/types/evidence.type";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";

const { confirm } = Modal;

interface Props {
  userLogin: any;
  costId: number;
  fileListOrigin: any[];
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
  setFileListOrigin: React.Dispatch<React.SetStateAction<any[]>>;
  fileUpdateList: any[];
  setFileUpdateList: React.Dispatch<React.SetStateAction<any[]>>;
  handleUploadChange: (info: any) => void;
}

const EvidenceDetails: React.FC<Props> = ({
  userLogin,
  costId,
  fileListOrigin,
  setPhaseData,
  setFileListOrigin,
  fileUpdateList,
  setFileUpdateList,
  handleUploadChange,
}) => {
  const dispatch = useAppDispatch();

  const [editEvidenceMode, setEditEvidenceMode] = useState<boolean>(false);
  const [fileListTmp, setFileListTmp] = useState<any[]>(fileListOrigin);

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
    let newEvidences: any[] = [];

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
            evidence_url: documentLinkList[j],
          };

          const resCreateEvidence = await dispatch(createEvidence(dataBody));

          console.log("resCreateEvidence: ", resCreateEvidence)
          if (createEvidence.rejected.match(resCreateEvidence)) {
            toast.error(`${resCreateEvidence.payload}`);
          }else {
            newEvidences.push(resCreateEvidence.payload);
          }
        }

        setFileListOrigin((prev) => [...prev, ...documentLinkList]);
        setFileUpdateList([]);
        //gọi set phase data ra cập nhập
        setPhaseData((prevPhaseData) => {
          const updatedPhaseData = prevPhaseData.map((phase) => {
            const updatedCategories = phase.categories.map((category: any) => {
              if (category.cost && category.cost.id === costId) {
                return {
                  ...category,
                  cost: {
                    ...category.cost,
                    evidences: [...category.cost.evidences, ...newEvidences],
                  },
                };
              }
              return category;
            });
  
            return {
              ...phase,
              categories: updatedCategories,
            };
          });
  
          return updatedPhaseData;
        });
        message.success("Đăng bằng chứng thành công!");
      } catch (error) {
        message.error("Failed to create evidence.");
      }
    } else {
      message.error("No files to upload.");
    }
  };

  useEffect(() => {
    setFileListTmp(fileListOrigin);
  }, [fileListOrigin]);

  const handleRemoveImage = (index: number) => {
    setFileListTmp((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <p className="font-bold text-lg">Bằng chứng</p>
        {/* button đăng bằng chứng */}
        {userLogin?.role_name === "Student" && (
          <div className="flex flex-row gap-3">
            {fileUpdateList.length >= 1 && (
              <Button
                type="primary"
                onClick={async () => {
                  confirm({
                    centered: true,
                    cancelText: "Hủy",
                    onCancel: () => {
                      setFileUpdateList([]);
                    },
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
        {/* button sửa bằng chứng */}
        {userLogin?.role_name === "Student" && (
          <div className="flex flex-row gap-3">
            {editEvidenceMode ? (
              <>
                <Button
                  onClick={() => {
                    setFileListTmp(fileListOrigin);
                    setEditEvidenceMode(false);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={async () => {
                    confirm({
                      centered: true,
                      cancelText: "Quay lại",
                      okText: "Xác nhận",
                      title: `Bạn có chắc muốn cập nhập lại bằng chứng?`,
                      onOk: async () => {
                        try {
                          //CALL API
                          const resUpdateEvidenceList = await dispatch(
                            updateEvidences({
                              evidence_url: fileListTmp,
                              costId: costId,
                            })
                          );

                          console.log(
                            "resUpdateEvidenceList: ",
                            resUpdateEvidenceList.payload
                          );
                          if (
                            updateEvidences.fulfilled.match(
                              resUpdateEvidenceList
                            )
                          ) {
                            setFileListOrigin(fileListTmp);
                            setEditEvidenceMode(false);

                            const idsToRemove = resUpdateEvidenceList.payload;

                            setPhaseData((prevPhaseData) => {
                              const updatedPhaseData = prevPhaseData.map(
                                (phase) => {
                                  const updatedCategories =
                                    phase.categories.map((category: any) => {
                                      //nếu fileListTmp là rỗng tức là xóa hết thì cho mảng về rỗng luôn
                                      if (fileListTmp.length === 0) {
                                        console.log("come")
                                        return {
                                          ...category,
                                          cost: {
                                            ...category.cost,
                                            evidences: [],
                                          },
                                        };
                                      }

                                      if (
                                        category.cost &&
                                        Array.isArray(category.cost.evidences)
                                      ) {
                                        const updatedEvidences =
                                          category.cost.evidences.filter(
                                            (evidence: any) =>
                                              !idsToRemove.includes(evidence.id)
                                          );
                                        return {
                                          ...category,
                                          cost: {
                                            ...category.cost,
                                            evidences: updatedEvidences,
                                          },
                                        };
                                      }
                                      return category;
                                    });

                                  return {
                                    ...phase,
                                    categories: updatedCategories,
                                  };
                                }
                              );

                              return updatedPhaseData;
                            });
                            toast.success("Cập nhập thành công!");
                          } else {
                            toast.error(`${resUpdateEvidenceList.payload}`);
                          }
                        } catch (error) {
                          console.log("error: ", error);
                          message.error("Có lỗi xảy ra khi cập nhập!");
                        }
                      },
                    });
                  }}
                >
                  Cập nhập
                </Button>
              </>
            ) : fileListOrigin.length > 0 ? (
              <Button onClick={() => setEditEvidenceMode(true)}>
                <BiEdit className="h-3 w-3" /> Sửa
              </Button>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>

      <div className="mx-4 mt-3">
        {fileListTmp.length > 0 ? (
          <>
            <p className="mb-3">Hiện có</p>
            <div className="flex gap-2">
              {fileListTmp.map((imageUrl, index) => (
                <div
                  className="relative border-2 rounded-lg border-dashed w-[102px] h-[102px] flex items-center justify-center p-2"
                  key={index}
                >
                  {editEvidenceMode && (
                    <Button
                      type="dashed"
                      className="absolute -top-3 -right-1 p-1 cursor-pointer w-5 h-5 bg-white"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <DeleteOutlined className="text-red-500" />
                    </Button>
                  )}
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
