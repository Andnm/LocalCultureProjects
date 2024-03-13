"use client";

import { PhaseType } from "@/src/types/phase.type";
import ListOptions from "./ListOptions";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { Hint } from "@/components/hint";
import { changeStatusFromEnToVn } from "@/src/utils/handleFunction";

interface ListHeaderProps {
  project: any;
  data: PhaseType;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
  onAddCategory: () => void;
}

export const ListHeader = ({
  project,
  data,
  onAddCategory,
  setPhaseData,
}: ListHeaderProps) => {
  const [userLogin, setUserLogin] = useUserLogin();
  // console.log("data", data);

  const getBorderColorClass = () => {
    switch (data.phase_status) {
      case "Processing":
        return "border-yellow-500";
      case "Warning":
        return "border-red-500";
      case "Done":
        return "border-green-500";
      default:
        return "";
    }
  };

  return (
    <div
      className="pt-2 px-2 text-sm font-semibold flex 
  justify-between items-start gap-x-2 relative"
    >
      <div className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent">
        Giai đoạn {data.phase_number}
      </div>

      <Hint
        sideOffset={100}
        description={`Giai đoạn ${changeStatusFromEnToVn(
          data.phase_status
        ).toLowerCase()}`}
        side={"left"}
      >
        <div
          className={` absolute top-5 -left-0.5 w-6 ${getBorderColorClass()} border-2 rotate-90 `}
        ></div>
      </Hint>

      {data.phase_status === "Done" && userLogin?.role_name === "Student" ? (
        <></>
      ) : (
        <ListOptions
          project={project}
          onAddCategory={onAddCategory}
          data={data}
          setPhaseData={setPhaseData}
        />
      )}
    </div>
  );
};
