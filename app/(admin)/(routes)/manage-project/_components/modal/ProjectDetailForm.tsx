import React from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import StatusCell from "../StatusCell";
import { formatDate } from "@/src/utils/handleFunction";

const { TextArea } = Input;
const { Option } = Select;

interface ProjectDetailsFormProps {
  form: any;
  fileList: any[];
  editMode: boolean;
  status: string;
  handleUploadChange: (info: any) => void;
  selectedProject: any;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  form,
  fileList,
  editMode,
  status,
  handleUploadChange,
  selectedProject,
}) => (
  <div className="grid grid-cols-3 px-4 ">
    <Form.Item name="name_project" label="Tên dự án" className="mx-3">
      <Input disabled={!editMode} />
    </Form.Item>
    <Form.Item name="business_type" label="Loại hình dự án" className="mx-3">
      <Select disabled={!editMode}>
        <Option value="Lên ý tưởng">Lên ý tưởng</Option>
        <Option value="Triển khai thực tế">Triển khai thực tế</Option>
      </Select>
    </Form.Item>
    <Form.Item
      name="project_implement_time"
      label="Thời gian thực hiện Dự án"
      className="mx-3"
    >
      <Select disabled={!editMode}>
        <Option value="Học kì Hè 2024 (Từ 5/2024 tới 8/2024)">
          Học kì Hè 2024 (Từ 5/2024 tới 8/2024)
        </Option>
        <Option value="Học kì Thu 2024 (Từ 9/2024 tới 12/2024)">
          Học kì Thu 2024 (Từ 9/2024 tới 12/2024)
        </Option>
      </Select>
    </Form.Item>
    <Form.Item name="purpose" label="Mục đích dự án" className="mx-3">
      <TextArea rows={4} disabled={!editMode} />
    </Form.Item>
    <Form.Item name="target_object" label="Đối tượng mục tiêu" className="mx-3">
      <TextArea rows={4} disabled={!editMode} />
    </Form.Item>
    <Form.Item name="request" label="Yêu cầu cụ thể" className="mx-3">
      <TextArea rows={4} disabled={!editMode} />
    </Form.Item>
    <Form.Item name="note" label="Các lưu ý khác nếu có" className="mx-3">
      <TextArea rows={4} disabled={!editMode} />
    </Form.Item>
    <Form.Item name="expected_budget" label="Ngân sách dự kiến" className="mx-3">
      <Select disabled={!editMode}>
        <Option value="Dưới 5.000.000 VNĐ">Dưới 5.000.000 VNĐ</Option>
        <Option value="Từ 5.000.000 tới dưới 15.000.000 VNĐ">
          Từ 5.000.000 tới dưới 15.000.000 VNĐ
        </Option>
        <Option value="Từ 15.000.000 tới dưới 25.000.000 VNĐ">
          Từ 15.000.000 tới dưới 25.000.000 VNĐ
        </Option>
        <Option value="Từ 25.000.000 VNĐ trở lên">Từ 25.000.000 VNĐ trở lên</Option>
        <Option value="Chưa xác định, tùy thuộc vào ý tưởng được đề xuất">
          Chưa xác định, tùy thuộc vào ý tưởng được đề xuất
        </Option>
      </Select>
    </Form.Item>
    <Form.Item
      name="document_related_link"
      label="Tài liệu đính kèm"
      className="mx-3"
    >
      <Upload
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={() => false}
        accept=".pdf"
        disabled={!editMode}
      >
        <Button icon={<UploadOutlined />}>Tải PDF</Button>
      </Upload>
    </Form.Item>
    <Form.Item name="project_status" label="Trạng thái" className="mx-3">
      <StatusCell status={status} />
    </Form.Item>
    <Form.Item label="Ngày tạo" className="mx-3">
      <Input disabled defaultValue={formatDate(selectedProject?.createdAt)} />
    </Form.Item>
  </div>
);

export default ProjectDetailsForm;
