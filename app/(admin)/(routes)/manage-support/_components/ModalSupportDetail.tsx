import React, { useRef, useState } from "react";
import { Avatar, Descriptions, Divider, Image, Modal, Rate } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataSupport: any;
}

const ModalSupportDetail: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, dataSupport } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();
  // console.log("dataSupport: ", dataSupport);

  return (
    <>
      <Modal
        width={1200}
        title={<span className="inline-block m-auto">Thông tin chi tiết</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={false}
      >
        <div className="">
          {dataSupport?.support_image && (
            <div className="px-5">
              <p style={{color: "#00000073"}}> Ảnh liên quan: </p>
              <Image
                style={{ width: 300, height: 200 }}
                src={`${dataSupport?.support_image}`}
                alt={`${dataSupport?.support_image}`}
              />
            </div>
          )}

          <Descriptions className="px-5" layout="vertical">
            <Descriptions.Item label="Người gửi">
              {dataSupport?.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {dataSupport?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              {dataSupport?.support_content}
            </Descriptions.Item>
            <Descriptions.Item label="Loại hỗ trợ">
              {dataSupport?.support_type}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
};

export default ModalSupportDetail;
