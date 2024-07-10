import React from "react";
import { Button, Form, Input, InputNumber, message, Modal } from "antd";
import { formatCurrency } from "@/src/utils/handleFunction";
import { BiEdit } from "react-icons/bi";

const { confirm } = Modal;

interface Props {
  editCostMode: boolean;
  setEditCostMode: React.Dispatch<React.SetStateAction<boolean>>;
  formCost: any; // Form Instance
  formCostRef: any;
  onCancelEditCost: () => void;
  onEditCost: () => void;
}

const CostDetails: React.FC<Props> = ({
  editCostMode,
  setEditCostMode,
  formCost,
  formCostRef,
  onCancelEditCost,
  onEditCost,
}) => {
  return (
    <>
      <div className="flex flex-row gap-3">
        <p className="font-bold text-lg"> Chi phí </p>
        <div className="flex flex-row gap-3">
          {editCostMode ? (
            <>
              <Button onClick={onCancelEditCost}>Hủy</Button>
              <Button
                type="primary"
                onClick={async () => {
                  confirm({
                    centered: true,
                    cancelText: "Hủy",
                    okText: "Xác nhận",
                    title: `Bạn có chắc muốn cập nhập chi phí thực tế?`,
                    onOk: async () => {
                      try {
                        await onEditCost();
                      } catch (error) {
                        message.error("Có lỗi xảy ra khi cập nhập!");
                      }
                    },
                  });
                }}
              >
                Cập nhập
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setEditCostMode(true)}>
                <BiEdit className="h-3 w-3" /> Sửa
              </Button>
            </>
          )}
        </div>
      </div>
      <Form
        form={formCost}
        layout="vertical"
        className="mt-5"
        ref={formCostRef}
      >
        <div className="grid grid-cols-3 px-2 ">
          <Form.Item
            name="expected_cost"
            label="Chi phí dự kiến"
            className="mx-3"
          >
            <Input
              value={formatCurrency(formCost.getFieldValue("expected_cost"))}
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            name="actual_cost"
            label="Chi phí thực tế"
            className="mx-3"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống!",
              },
            ]}
          >
            <InputNumber
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value ? value.replace(/\$\s?|(,*)/g, "") : ""
              }
              style={{ width: "100%" }}
              value={formatCurrency(formCost.getFieldValue("actual_cost"))}
              disabled={!editCostMode}
            />
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default CostDetails;
