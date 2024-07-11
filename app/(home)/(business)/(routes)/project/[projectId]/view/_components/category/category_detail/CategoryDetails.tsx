import React, { useEffect, useState } from "react";
import { Form, Input, Descriptions, Button, Modal, message } from "antd";
import { CheckCircleIcon, ClockIcon, Trash } from "lucide-react";
import { Hint } from "@/components/hint";
import { BiEdit } from "react-icons/bi";

const { TextArea } = Input;
const { confirm } = Modal;

interface Props {
  userLogin: any;
  selectedCategory: any;
  setDataCategory: React.Dispatch<React.SetStateAction<any>>;
  editCategoryMode: boolean;
  setEditCategoryMode: React.Dispatch<React.SetStateAction<boolean>>;
  formCategoryRef: any;
  formCategory: any; // Form Instance
  onCancelEditCategory: () => void;
  onEditCategory: () => void;
  handleChangeStatusCategory: (status: string) => void;
}

const CategoryDetails: React.FC<Props> = ({
  userLogin,
  selectedCategory,
  editCategoryMode,
  setEditCategoryMode,
  formCategoryRef,
  formCategory,
  onCancelEditCategory,
  onEditCategory,
  handleChangeStatusCategory,
}) => {
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [hint, setHint] = useState<string>("");
  const [action, setAction] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    const renderIconAndHint = () => {
      switch (selectedCategory.category_status) {
        case "Todo":
          return {
            icon: <ClockIcon className="w-4 h-4" />,
            hint: "Chuyển hạng mục sang tiến hành",
            action: () => handleChangeStatusCategory("Doing"),
          };
        case "Doing":
          return {
            icon: <CheckCircleIcon className="w-4 h-4" />,
            hint: "Đánh dấu hoàn thành hạng mục",
            action: () => handleChangeStatusCategory("Done"),
          };
        case "Done":
          return {
            icon: null,
            hint: "",
            action: undefined,
          };
        default:
          return {
            icon: null,
            hint: "",
            action: undefined,
          };
      }
    };

    const { icon, hint, action } = renderIconAndHint();
    setIcon(icon);
    setHint(hint);
    setAction(() => action);
  }, [selectedCategory]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Processing":
      case "Doing":
        return "bg-orange-300 text-orange-900";
      case "Done":
      case "Complete":
      case "Transferred":
        return "bg-green-300 text-green-900";
      case "Warning":
        return "bg-red-300 text-red-900";
      case "Pending":
      case "Not Transferred":
      case "Todo":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-teal-300 text-teal-900";
    }
  };

  return (
    <>
      <div className="flex flex-row gap-3">
        <p className="font-bold text-lg"> Chi tiết hạng mục </p>
        {userLogin?.role_name === "Student" && (
          <div className="flex flex-row gap-3">
            {editCategoryMode ? (
              <>
                <Button onClick={onCancelEditCategory}>Hủy</Button>
                <Button
                  type="primary"
                  onClick={async () => {
                    confirm({
                      centered: true,
                      cancelText: "Hủy",
                      okText: "Xác nhận",
                      title: `Bạn có chắc muốn cập nhập kết quả thực tế?`,
                      onOk: async () => {
                        try {
                          await onEditCategory();
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
            ) : (
              <>
                <Button onClick={() => setEditCategoryMode(true)}>
                  <BiEdit className="h-3 w-3" /> Sửa
                </Button>
                <Button danger onClick={() => {}}>
                  <Trash className="h-3 w-3" /> Xóa
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      <Descriptions className="px-5 mt-5">
        <Descriptions.Item label="Tên hạng mục">
          <strong>{selectedCategory.category_name}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <div className="flex flex-row gap-2 items-center">
            <span
              className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(
                selectedCategory.category_status
              )}`}
            >
              {selectedCategory.category_status}
            </span>
            {icon && (
              <Hint sideOffset={10} description={hint} side="right">
                <Button
                  type="text"
                  onClick={async () => {
                    confirm({
                      centered: true,
                      cancelText: "Hủy",
                      okText: "Xác nhận",
                      title: `Bạn có chắc muốn chuyển trạng thái cho hạng mục này?`,
                      onOk: async () => {
                        try {
                          if (action) {
                            await action();
                          }
                        } catch (error) {
                          message.error("Có lỗi xảy ra khi chuyển trạng thái!");
                        }
                      },
                    });
                  }}
                >
                  {icon}
                </Button>
              </Hint>
            )}
          </div>
        </Descriptions.Item>

        {/* Other details */}
      </Descriptions>
      <Form form={formCategory} layout="vertical" ref={formCategoryRef}>
        <div className="grid grid-cols-3 px-2 ">
          <Form.Item name="detail" label="Chi tiết" className="mx-3">
            <TextArea rows={4} disabled={true} />
          </Form.Item>

          <Form.Item
            name="result_expected"
            label="Kết quả dự kiến"
            className="mx-3"
          >
            <TextArea rows={4} disabled={true} />
          </Form.Item>

          <Form.Item
            name="result_actual"
            label="Kết quả thực tế"
            className="mx-3"
            rules={[
              {
                required: true,
                message: "Vui lòng không để trống!",
              },
            ]}
          >
            <TextArea rows={4} disabled={!editCategoryMode} />
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default CategoryDetails;
