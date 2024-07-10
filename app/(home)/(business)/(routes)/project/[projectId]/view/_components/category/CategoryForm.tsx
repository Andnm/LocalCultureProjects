"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormInput } from "@/src/components/form/FormInput";
import { FormTextArea } from "@/src/components/form/FormTextArea";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { createCategory } from "@/src/redux/features/categorySlice";
import { createCost } from "@/src/redux/features/costSlice";
import { getAllRegisterPitchingByBusiness } from "@/src/redux/features/pitchingSlice";
import { useAppDispatch } from "@/src/redux/store";
import { CategoryType } from "@/src/types/category.type";
import {
  convertCommaStringToNumber,
  formatNumberWithCommas,
} from "@/src/utils/handleFunction";
import { Plus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { forwardRef } from "react";
import toast from "react-hot-toast";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CategoryFormProps {
  phaseData: any; //cái này chỉ có 1 object
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; //cái này set cho data list
  phaseId: number;
  dataCategory: CategoryType[];
  setDataCategory: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const CategoryForm = forwardRef<HTMLTextAreaElement, CategoryFormProps>(
  (
    {
      phaseData,
      setPhaseData,
      phaseId,
      isEditing,
      setDataCategory,
      dataCategory,
      isLoading,
      setIsLoading,
      enableEditing,
      disableEditing,
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = React.useState<CategoryType>({
      category_name: "",
      detail: "",
      result_expected: "",
      phaseId: phaseId,
      groupId: 0,
    });
    const formRef = React.useRef<React.ElementRef<"form">>(null);

    const [errors, setErrors] = React.useState({
      category_name: "",
      detail: "",
      costEstimates: "",
      result_expected: "",
    });

    const [costEstimates, setCostEstimates] = React.useState<any>();
    const [userLogin, setUserLogin] = useUserLogin();

    const handleChange = (field: keyof CategoryType, value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
        setErrors({
          category_name: "",
          detail: "",
          costEstimates: "",
          result_expected: "",
        });
      }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, () => {
      disableEditing();
      setErrors({
        category_name: "",
        detail: "",
        costEstimates: "",
        result_expected: "",
      });
    });

    const handleCreateCategory = async (e: React.FormEvent) => {
      e.preventDefault();

      const newErrors = {
        category_name: formData.category_name
          ? ""
          : "Tên hạng mục là bắt buộc!",
        detail: formData.detail ? "" : "Chi tiết là bắt buộc!",
        costEstimates: costEstimates ? "" : "Dự trù chi phí là bắt buộc!",
        result_expected: formData.result_expected
          ? ""
          : "Kết quả mong muốn là bắt buộc!",
      };

      if (Object.values(newErrors).some((error) => error)) {
        setErrors(newErrors);
        return;
      }

      setIsLoading(true);

      try {
        const result = await dispatch(createCategory(formData)).unwrap();
        // setPhaseData((prev) => [...prev, result.payload]); //MỞ RA LÀ LỖI NGAY
        
        const dataBody = {
          expected_cost: convertCommaStringToNumber(costEstimates),
          categoryId: result.id,
          phaseId: result.phase.id,
        };

        const resCreateCost = await dispatch(createCost(dataBody)).unwrap();
        toast.success("Tạo hạng mục thành công!");
        setFormData((prevData) => ({
          ...prevData,
          category_name: "",
          detail: "",
          result_expected: "",
          phaseId: phaseId,
        }));

        setCostEstimates("");
        disableEditing();
      } catch (error) {
        toast.error("Tạo hạng mục thất bại!");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleCancelCreateCategory = () => {
      setFormData((prevData) => ({
        ...prevData,
        category_name: "",
        detail: "",
        result_expected: "",
      }));
      setCostEstimates("");
      disableEditing();
    };

    const params = useParams<{ projectId: string }>();

    React.useEffect(() => {
      const projectId = parseInt(params.projectId, 10);

      dispatch(getAllRegisterPitchingByBusiness(projectId)).then((result) => {
        if (getAllRegisterPitchingByBusiness.fulfilled.match(result)) {
          // console.log('group', result.payload);
          const selectedGroup = result.payload.find(
            (item: any) => item.register_pitching_status === "Selected"
          );

          if (selectedGroup) {
            // console.log(selectedGroup)
            setFormData((prevData) => ({
              ...prevData,
              groupId: selectedGroup.group.id,
            }));
          }
        } else {
        }
      });
    }, []);

    if (isEditing) {
      return (
        <form
          ref={formRef}
          onSubmit={handleCreateCategory}
          className="m-1 py-0.5 px-1 space-y-4 mt-3"
        >
          <FormInput
            type="text"
            id="category_name"
            className="w-full px-2 py-1 h-7 border-neutral-200/100 bg-white transition"
            placeholder="Nhập vào tên hạng mục ..."
            value={formData.category_name}
            onChange={(e) => handleChange("category_name", e.target.value)}
          />
          {errors.category_name && (
            <div
              className="text-red-500 text-xs ml-1"
              style={{ marginTop: "0px" }}
            >
              {errors.category_name}
            </div>
          )}

          <FormTextArea
            id="title"
            onKeyDown={() => {}}
            ref={ref}
            placeholder="Nhập chi tiết ..."
            value={formData.detail}
            onChange={(e) => handleChange("detail", e.target.value)}
          />
          {errors.detail && (
            <div
              className="text-red-500 text-xs ml-1"
              style={{ marginTop: "0px" }}
            >
              {errors.detail}
            </div>
          )}

          <FormInput
            type="text"
            id="category_name"
            className="w-full px-2 py-1 h-7 border-neutral-200/100 bg-white transition"
            placeholder="Nhập vào dự trù chi phí ..."
            value={costEstimates}
            onChange={(e) => {
              const inputValue = e.target.value.replace(/,/g, "");
              const numericValue = parseInt(inputValue, 10) || 0;
              const formattedValue = formatNumberWithCommas(numericValue);
              setCostEstimates(formattedValue);
            }}
          />
          {errors.costEstimates && (
            <div
              className="text-red-500 text-xs ml-1"
              style={{ marginTop: "0px" }}
            >
              {errors.costEstimates}
            </div>
          )}

          <FormTextArea
            id="result_expected"
            onKeyDown={() => {}}
            ref={ref}
            placeholder="Nhập kết quả mong muốn ..."
            value={formData.result_expected}
            onChange={(e) => handleChange("result_expected", e.target.value)}
          />
          {errors.result_expected && (
            <div
              className="text-red-500 text-xs ml-1"
              style={{ marginTop: "0px" }}
            >
              {errors.result_expected}
            </div>
          )}

          <input hidden id="phaseId" name="phaseId" value={phaseId} />

          <div className="flex items-center gap-x-1">
            <button
              type="submit"
              className="bg-blue-500 text-sm text-white hover:bg-blue-300 transition px-3 py-2"
              style={{ borderRadius: "7px" }}
            >
              Tạo hạng mục
            </button>
            <Button
              onClick={handleCancelCreateCategory}
              size="sm"
              variant={"ghost"}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        {userLogin?.role_name === "Student" &&
          phaseData?.phase_status !== "Done" && (
            <Button
              onClick={enableEditing}
              className="h-auto px-2 py-1.5 w-full 
          justify-start text-muted-foreground text-sm
          hover:opacity-60"
              size="sm"
              variant={"ghost"}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm hạng mục
            </Button>
          )}

        {isLoading && <SpinnerLoading />}
      </div>
    );
  }
);

CategoryForm.displayName = "CategoryForm";
export default CategoryForm;