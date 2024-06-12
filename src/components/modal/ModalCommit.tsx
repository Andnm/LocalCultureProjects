import React, { useRef, useState } from "react";
import { Button, Modal, Form, Checkbox, message } from "antd";
import { useAppDispatch } from "@/src/redux/store";

const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

const ModalCommit: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose } = props;
  const dispatch = useAppDispatch();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const formRef = useRef(null);
  const [form] = Form.useForm();

  const disabled = async () => {
    let result = false;
    try {
      await form.validateFields();
    } catch (errorInfo) {
      result = true;
    }
    return result;
  };

  const handleSubmit = async () => {
    if (!(await disabled())) {
      confirm({
        cancelText: "Hủy",
        okText: "Xác nhận",
        title: "Bạn có chắc là xác nhận cam kết bảo mật thông tin này?",
        async onOk() {
          setLoadingSubmit(true);
          if (onSubmit) {
            onSubmit();
          }
          setLoadingSubmit(false);
          onClose();
          form.resetFields();
        },
      });
    } else {
      message.error("Vui lòng đồng ý với các điều khoản bảo mật thông tin.");
    }
  };

  return (
    <Modal
      width={800}
      title={
        <span className="inline-block m-auto">
          Cam Kết Bảo Mật Thông Tin Đề Bài Doanh Nghiệp
        </span>
      }
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={[
        <Button
          className="btn-cancel"
          key="cancel"
          onClick={() => {
            onClose();
            form.resetFields();
          }}
        >
          Hủy Bỏ
        </Button>,
        <Button
          type="primary"
          className="btn-submit"
          key="submit"
          onClick={handleSubmit}
        >
          Tiếp Tục
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" ref={formRef} name="form_in_modal">
        <Form.Item>
          <p>
            Trước khi tiếp cận đề bài chi tiết của dự án truyền thông từ doanh
            nghiệp, bạn cần đọc kỹ và đồng ý với Cam kết Bảo mật Thông tin dưới
            đây để đảm bảo tính bảo mật và an toàn thông tin cho các dự án của
            doanh nghiệp đối tác.
          </p>
        </Form.Item>

        <Form.Item>
          <p>
            <strong>Bằng việc tick chọn vào ô bên dưới bạn cam kết:</strong>
          </p>
          <ul>
            <li>
              Bảo Mật Thông Tin Liên Hệ Người Phụ Trách từ phía doanh nghiệp:
              Bạn sẽ không tiết lộ thông tin liên hệ của người phụ trách dự án
              từ phía doanh nghiệp bao gồm tên, chức vụ, số điện thoại và địa
              chỉ email với bên thứ ba nào mà không có sự đồng ý bằng văn bản từ
              người này và từ quản trị viên của website.
            </li>
            <li>
              Bảo mật Đối Tượng Mục Tiêu của dự án: Bạn sẽ không tiết lộ thông
              tin liên quan đến đối tượng mục tiêu của dự án cho bất kỳ bên thứ
              ba nào bao gồm nhưng không giới hạn ở các phương tiện truyền thông
              mạng xã hội hoặc các đối tác không liên quan.
            </li>
            <li>
              Bảo mật Yêu Cầu Cụ Thể của dự án: Bạn sẽ không tiết lộ thông tin
              yêu cầu cụ thể, chi tiết kỹ thuật và mô tả dự án được doanh nghiệp
              đối tác cung cấp, không công bố hay sử dụng thông tin này với mục
              đích cá nhân hoặc thương mại.
            </li>
            <li>
              Bảo mật Ngân Sách Dự Kiến của dự án: Bạn sẽ không công bố ngân
              sách dự kiến hay bất kỳ thông tin tài chính nào liên quan đến dự
              án này dưới mọi hình thức bao gồm việc chia sẻ thông tin qua
              email, mạng xã hội hoặc bất kỳ phương tiện điện tử nào khác.
            </li>
          </ul>
        </Form.Item>

        <Form.Item>
          <p>
            <strong>Lưu ý:</strong> Việc vi phạm Cam kết Bảo mật Thông tin này
            có thể dẫn đến việc bạn bị loại khỏi dự án và có thể phải chịu trách
            nhiệm pháp lý tùy theo mức độ vi phạm. Hãy đảm bảo bạn hiểu rõ nội
            dung cam kết trước khi tiếp tục.
          </p>
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      "Bạn cần đồng ý với các điều khoản bảo mật thông tin."
                    ),
            },
          ]}
        >
          <Checkbox>
            Tôi đã đọc và đồng ý với các điều khoản của Cam Kết Bảo Mật Thông
            Tin.
          </Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCommit;
