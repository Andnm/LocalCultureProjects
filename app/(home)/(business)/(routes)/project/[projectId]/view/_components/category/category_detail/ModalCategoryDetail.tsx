import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Descriptions,
  Spin,
  List,
  Upload,
  message,
  InputNumber,
  UploadFile,
  UploadProps,
} from "antd";
import { useAppDispatch } from "@/src/redux/store";
import {
  getCostInCategory,
  updateActualCost,
} from "@/src/redux/features/costSlice";
import { getEvidenceInCost } from "@/src/redux/features/evidenceSlice";

import CategoryDetails from "./CategoryDetails";
import CostDetails from "./CostDetails";
import EvidenceDetails from "./EvidenceDetails";
import {
  changeStatusCategory,
  updateActualResult,
  updateCategoryInformation,
} from "@/src/redux/features/categorySlice";
import toast from "react-hot-toast";
import { useUserLogin } from "@/src/hook/useUserLogin";
const { TextArea } = Input;

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: any;
  project: any;
  phaseData: any;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedCategory: any; //này chỉ là 1 category
  setSelectedCategory: React.Dispatch<React.SetStateAction<any>>;
  setDataCategory: React.Dispatch<React.SetStateAction<any[]>>; //cái là 1 list category
}

const ModalCategoryDetail: React.FC<Props> = ({
  open,
  onClose,
  project,
  groupId,
  phaseData,
  setPhaseData,
  selectedCategory,
  setSelectedCategory,
  setDataCategory,
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //form quản lý
  const formCategoryRef = useRef(null);
  const [formCategory] = Form.useForm();
  const formCostRef = useRef(null);
  const [formCost] = Form.useForm();

  const [editCategoryMode, setEditCategoryMode] = useState<boolean>(false);
  const [editCostMode, setEditCostMode] = useState<boolean>(false);

  //evidence
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [fileListOrigin, setFileListOrigin] = useState<string[]>([]);
  const [fileUpdateList, setFileUpdateList] = useState<UploadFile[]>([]);

  //
  const [userLogin, setUserLogin] = useUserLogin();

  useEffect(() => {
    setIsLoading(true);
    formCategory.setFieldsValue({
      ...selectedCategory,
    });

    dispatch(getCostInCategory(selectedCategory.id))
      .then((result) => {
        if (getCostInCategory.fulfilled.match(result)) {
          formCost.setFieldsValue({
            ...result.payload,
            costId: result.payload.id,
          });
          dispatch(getEvidenceInCost(result.payload.id)).then((res) => {
            if (getEvidenceInCost.fulfilled.match(res)) {
              setEvidenceList(res.payload);

              const filesOrigin: string[] = res.payload.map(
                (evidence: any) => evidence.evidence_url
              );
              setFileListOrigin(filesOrigin);
            } else {
              message.error("Lỗi khi tải bằng chứng");
            }
          });
        } else {
          message.error("Lỗi khi tải chi phí");
        }
      })
      .catch((error) => {
        console.error("Error during cost fetch:", error);
        message.error("Lỗi khi tải chi phí");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedCategory.id]);

  const handleUploadChange: UploadProps["onChange"] = ({ fileList }) => {
    setFileUpdateList(fileList);
  };

  const handleEditCategory = async () => {
    const values = await formCategory.validateFields();
    const resEditCategory = await dispatch(
      updateActualResult({
        categoryId: selectedCategory?.id,
        groupId: groupId,
        actual_result: formCategory.getFieldValue("result_actual"),
      })
    );

    if (updateActualResult.fulfilled.match(resEditCategory)) {
      toast.success(`${"Cập nhập kết quả thực tế thành công!"}`);
      setEditCategoryMode(false);
      setPhaseData((prevPhaseData) => {
        const updatedPhaseData = prevPhaseData.map((phase) => {
          const updatedCategories = phase.categories.map((category: any) => {
            if (category.id === resEditCategory.payload.id) {
              return {
                ...category,
                result_actual: formCategory.getFieldValue("result_actual"),
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
    } else {
      toast.error(`${resEditCategory.payload}`);
    }
  };

  const handleCancelEditCategory = () => {};

  const handleChangeStatusCategory = async (status: string) => {
    const resChangeStatusCategory = await dispatch(
      changeStatusCategory({
        categoryId: selectedCategory?.id,
        categoryStatus: status,
      })
    );

    if (changeStatusCategory.fulfilled.match(resChangeStatusCategory)) {
      toast.success(`${"Đổi trạng thái thành công!"}`);

      formCategory.setFieldValue("category_status", status);

      setSelectedCategory((prevDataCategory: any) => ({
        ...prevDataCategory,
        category_status: status,
      }));

      setPhaseData((prevPhaseData) => {
        const updatedPhaseData = prevPhaseData.map((phase) => {
          const updatedCategories = phase.categories.map((category: any) => {
            if (category.id === selectedCategory?.id) {
              return {
                ...category,
                category_status: status,
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
    } else {
      toast.error(`${resChangeStatusCategory.payload}`);
    }
  };

  const handleEditCost = async () => {
    const values = await formCost.validateFields();
    // console.log("cost: ", formCost.getFieldValue("actual_cost"));
    const resEditCost = await dispatch(
      updateActualCost({
        costId: formCost.getFieldValue("costId"),
        phaseId: phaseData?.id,
        categoryId: selectedCategory?.id,
        actual_cost: formCost.getFieldValue("actual_cost"),
      })
    );

    // console.log("resEditCost: ", resEditCost);

    if (updateActualCost.fulfilled.match(resEditCost)) {
      toast.success(`${"Cập nhập giá tiền thực tế thành công!"}`);
      setEditCostMode(false);
      setPhaseData((prevPhaseData) => {
        const updatedPhaseData = prevPhaseData.map((phase) => {
          return {
            ...phase,
            actual_cost_total: resEditCost.payload.actualCostOfPhase,
          };
        });

        return updatedPhaseData;
      });
    } else {
      toast.error(`${resEditCost.payload}`);
    }
  };

  const handleCancelEditCost = () => {
    setEditCostMode(false);
  };

  const handleEditEvidence = () => {
    // Implement edit evidence logic here
  };

  return (
    <Modal
      style={{ top: 10 }}
      width={"80%"}
      visible={open}
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={isLoading}>
        <div>
          <CategoryDetails
            userLogin={userLogin}
            formCategoryRef={formCategoryRef}
            selectedCategory={selectedCategory}
            setDataCategory={setDataCategory}
            editCategoryMode={editCategoryMode}
            setEditCategoryMode={setEditCategoryMode}
            formCategory={formCategory}
            onCancelEditCategory={handleCancelEditCategory}
            onEditCategory={handleEditCategory}
            handleChangeStatusCategory={handleChangeStatusCategory}
          />

          <CostDetails
            userLogin={userLogin}
            editCostMode={editCostMode}
            formCostRef={formCostRef}
            formCost={formCost}
            onCancelEditCost={handleCancelEditCost}
            onEditCost={handleEditCost}
            setEditCostMode={setEditCostMode}
          />

          <EvidenceDetails
            userLogin={userLogin}
            costId={formCost.getFieldValue("costId")}
            fileListOrigin={fileListOrigin}
            setFileListOrigin={setFileListOrigin}
            fileUpdateList={fileUpdateList}
            setFileUpdateList={setFileUpdateList}
            handleUploadChange={handleUploadChange}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalCategoryDetail;
