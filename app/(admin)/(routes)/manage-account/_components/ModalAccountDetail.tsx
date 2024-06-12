import React, { useRef, useState } from "react";
import { Avatar, Descriptions, Divider, Image, Modal, Rate } from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import { formatDate } from "@/src/utils/handleFunction";
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataAccount: any;
}

const ModalAccountDetail: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, dataAccount } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();
  console.log("dataAccount: ", dataAccount);

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
        <div className=" flex flex-row px-8 items-center">
          <div className="">
            <Avatar
              shape="square"
              size={150}
              src={`${dataAccount?.avatar_url}`}
            >
              {dataAccount?.email.charAt(0)}
            </Avatar>
          </div>

          <Descriptions className="px-5" layout="vertical">
            <Descriptions.Item label="Họ và tên">
              {dataAccount?.fullname}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {dataAccount?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              <TextNotUpdate data={dataAccount?.support_content} />
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              <TextNotUpdate data={dataAccount?.address} />
            </Descriptions.Item>
            {dataAccount?.role_name === "Business" && (
              <>
                <Descriptions.Item label="Lĩnh vực kinh doanh">
                  <TextNotUpdate data={dataAccount?.business_sector} />
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả doanh nghiệp">
                  <TextNotUpdate data={dataAccount?.business_description} />
                </Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Vai trò">
              <TextNotUpdate data={dataAccount?.role_name} />
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian tạo">
              {formatDate(dataAccount?.createdAt)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
    </>
  );
};

export default ModalAccountDetail;
