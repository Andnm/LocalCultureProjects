"use client";
import React from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { ListWrapper } from "../ListWrapper";
import { FiPlus } from "react-icons/fi";
import { FormInput } from "@/src/components/form/FormInput";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppDispatch } from "@/src/redux/store";
import { createPhase } from "@/src/redux/features/phaseSlice";
import toast from "react-hot-toast";
import { PhaseType } from "@/src/types/phase.type";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useUserLogin } from "@/src/hook/useUserLogin";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Hint } from "@/components/hint";
import { addDays, addMonths } from "date-fns";
import vn from "date-fns/locale/vi";

registerLocale("vi", vn);
setDefaultLocale("vi");

interface ListFormProp {
  project: any;
  groupId: number;
  projectId: number;
  phaseData: any;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
}

const fieldDate: { name: any; label: string }[] = [
  {
    name: "phase_start_date",
    label: "Ngày bắt đầu giai đoạn",
  },
  { name: "phase_expected_end_date", label: "Ngày kết thúc giai đoạn" },
];

const ListForm = ({
  project,
  groupId,
  projectId,
  phaseData,
  setPhaseData,
}: ListFormProp) => {
  // console.log("project", project);
  // console.log("phaseData", phaseData);

  const [isEditing, setIsEditing] = React.useState(false);
  const formRef = React.useRef<React.ElementRef<"form">>(null);
  const inputRef = React.useRef<React.ElementRef<"input">>(null);
  // const [startInputValue, setStartInputValue] = React.useState<string>("");
  const [endInputValue, setEndInputValue] = React.useState<string>("");
  const [loading, setIsLoading] = React.useState(false);

  const [formDate, setFormDate] = React.useState<any>({
    phase_start_date: null,
    phase_expected_end_date: null,
  });

  const [userLogin, setUserLogin] = useUserLogin();

  const params = useParams();
  const dispatch = useAppDispatch();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      // inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setFormDate({
      phase_start_date: null,
      phase_expected_end_date: null,
    });
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleSubmitCreatePhase = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const dataBody = {
      phase_start_date: formDate.phase_start_date,
      phase_expected_end_date: formDate.phase_expected_end_date,
      projectId: projectId,
      groupId: groupId,
    };
    console.log("dataBody", dataBody);

    dispatch(createPhase(dataBody)).then((result: any) => {
      if (createPhase.fulfilled.match(result)) {
        // setPhaseData((prevDataTable) => [...prevDataTable, result.payload]);
        // console.log(result.payload);
        toast.success("Tạo giai đoạn thành công!");
      } else {
        toast.error(`${result.payload}`);
      }
      disableEditing();
      setIsLoading(false);
    });
  };

  //new selected date
  const getHintDescription = (fieldName: string) => {
    switch (fieldName) {
      case "phase_start_date":
        return "1 số rule gì đó";
      case "phase_expected_end_date":
        return "Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày";
      default:
        return "";
    }
  };

  const handleDateChange = (name: any, value: any) => {
    setFormDate((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMinDate = (name: any): Date => {
    const projectStartDate = new Date(project.project_start_date);

    switch (name) {
      case "phase_start_date":
        if (!phaseData || phaseData.length === 0) {
          return projectStartDate;
        } else {
          const endDatePreviousPhase = new Date(
            phaseData[phaseData.length - 1]?.phase_expected_end_date
          );
          return endDatePreviousPhase;
        }
      case "phase_expected_end_date":
        const phaseStartDate = formDate?.phase_start_date;
        return phaseStartDate ? addDays(phaseStartDate, 1) : projectStartDate;
      default:
        return projectStartDate;
    }
  };

  const handleMaxDate = (name: any): Date => {
    const projectEndDate = new Date(project.project_expected_end_date);
    return projectEndDate;
  };

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
          style={{ borderRadius: "7px" }}
          onSubmit={handleSubmitCreatePhase}
        >
          {/* <FormInput
            ref={inputRef}
            type={"date"}
            id="start_date"
            className="w-full px-2 py-1 h-7 border-transparent border-neutral-200/100 bg-white transition"
            placeholder="Nhập vào ..."
            value={startInputValue}
            onChange={(e) => setStartInputValue(e.target.value)}
          />

          <FormInput
            ref={inputRef}
            type={"date"}
            id="expected_end_date"
            className="w-full px-2 py-1 h-7 border-transparent border-neutral-200/100 bg-white transition"
            placeholder="Nhập vào ..."
            value={endInputValue}
            onChange={(e) => setEndInputValue(e.target.value)}
          /> */}

          {fieldDate.map((field) => (
            <div key={field.name} className="mb-4">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                <Hint
                  sideOffset={10}
                  description={getHintDescription(field.name)}
                  side={"top"}
                >
                  <IoHelpCircleOutline className="h-[14px] w-[14px] ml-1" />
                </Hint>
              </label>

              <DatePicker
                ref={inputRef as any}
                className="cursor-pointer border w-full"
                showIcon
                selected={formDate[field.name]}
                dateFormat="dd/MM/yyyy"
                onChange={(date) => handleDateChange(field.name, date)}
                placeholderText=" "
                minDate={handleMinDate(field.name)}
                maxDate={handleMaxDate(field.name)}
              />
            </div>
          ))}

          <input hidden value={params.projectId} name="proecjtId" />

          <div className="flex items-center gap-x-1">
            <button
              type="submit"
              className="bg-blue-500 text-sm text-white hover:bg-blue-300 transition px-3 py-2"
              style={{ borderRadius: "7px" }}
            >
              Tạo giai đoạn
            </button>
            <Button onClick={disableEditing} size="sm" variant={"ghost"}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      {userLogin?.role_name === "Student" && phaseData?.length !== 4 && (
        <button
          onClick={enableEditing}
          className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center  font-medium text-sm"
          style={{ borderRadius: "7px" }}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Thêm giai đoạn
        </button>
      )}

      {loading && <SpinnerLoading />}
    </ListWrapper>
  );
};

export default ListForm;
