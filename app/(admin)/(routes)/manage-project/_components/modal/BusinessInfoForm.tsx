import React from "react";
import { Form, Input, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface BusinessInfoFormProps {
  form: any;
  businessUser: any;
  editMode: boolean;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  form,
  businessUser,
  editMode,
}) => (
  <div className="grid grid-cols-3 px-4 ">
    <Form.Item label="Tên doanh nghiệp" className="mx-3">
      <Input disabled={true} value={businessUser?.fullname} />
    </Form.Item>
    <Form.Item label="Địa chỉ email" className="mx-3">
      <Input disabled={true} value={businessUser?.email} />
    </Form.Item>
    <Form.Item label="Lĩnh vực kinh doanh" className="mx-3">
      <Select disabled={true} value={businessUser?.business_sector}>
        <Option value="Nông nghiệp">Nông nghiệp</Option>
        <Option value="Thủ công nghiệp">Thủ công nghiệp</Option>
        <Option value="Du lịch">Du lịch</Option>
        <Option value="Khác">Khác</Option>
      </Select>
    </Form.Item>
    <Form.Item label="Mô tả doanh nghiệp" className="mx-3">
      <TextArea rows={4} disabled={true} value={businessUser?.business_description} />
    </Form.Item>
    <Form.Item label="Địa chỉ doanh nghiệp" className="mx-3">
      <Input disabled={true} value={businessUser?.address} />
    </Form.Item>
    <Form.Item label="Địa chỉ cụ thể" className="mx-3">
      <Input disabled={true} value={businessUser?.address_detail} />
    </Form.Item>
  </div>
);

export default BusinessInfoForm;
