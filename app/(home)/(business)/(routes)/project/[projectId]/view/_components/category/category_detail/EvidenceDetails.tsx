import React from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";

interface Props {
  fileList: any[];
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  handleUploadChange: (info: any) => void;
}

const EvidenceDetails: React.FC<Props> = ({
  fileList,
  setFileList,
  handleUploadChange,
}) => {
  return (
    <>
      <h3 className="font-bold text-lg mt-4">Bằng chứng</h3>

      <div className="mx-4 mt-5">
        <Upload
          action=""
          listType="picture-card"
          fileList={fileList}
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
          {fileList.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          )}
        </Upload>
      </div>
    </>
  );
};

export default EvidenceDetails;
