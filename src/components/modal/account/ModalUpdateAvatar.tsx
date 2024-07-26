import { Form, Modal, Input, Button, Upload, UploadProps } from "antd";
import React, { useState } from "react";
import { RcFile } from "antd/es/upload";
import { UploadChangeParam } from "antd/es/upload/interface";
import { useAppDispatch } from "@/src/redux/store";
import { updateUserProfile } from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";

interface Props {
  open: boolean;
  onClose: () => void;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

const ModalUpdateAvatar: React.FC<Props> = ({
  open,
  onClose,
  userData,
  setUserData,
}) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const uploadFile = (file: RcFile) => {
    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `avatars/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      toast.error("Vui lòng chọn ảnh để tải lên!");
      return;
    }

    setConfirmLoading(true);
    try {
      const file = fileList[0].originFileObj as RcFile;
      const avatarUrl = await uploadFile(file);

      const updatedData = {
        ...userData,
        avatar_url: avatarUrl,
      };

      await dispatch(updateUserProfile(updatedData)).then((resUpdate) => {
        if (updateUserProfile.fulfilled.match(resUpdate)) {
          toast.success("Cập nhật thành công!");
          setUserData(updatedData);
          onClose();
        } else {
          toast.error("Cập nhật thất bại!");
        }
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.fileList.length > 0) {
      const updatedFileList = info.fileList.map(file => ({
        ...file,
        originFileObj: file.originFileObj as RcFile
      }));
      setFileList(updatedFileList);
    }
  };

  return (
    <Modal
      title="Cập nhật ảnh đại diện"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        setFileList([]);
      }}
      footer={[
        <Button key="back" onClick={() => onClose()}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSubmit}
        >
          Cập nhật
        </Button>,
      ]}
    >
      <Upload
        listType="picture"
        beforeUpload={() => false} 
        onChange={handleChange}
      >
        <Button>Chọn ảnh</Button>
      </Upload>
    </Modal>
  );
};

export default ModalUpdateAvatar;
