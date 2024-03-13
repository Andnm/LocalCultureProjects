"use client";

import { PhaseType } from "@/src/types/phase.type";
import React from "react";
import { ListHeader } from "../ListHeader";
import CategoryForm from "../category/CategoryForm";
import { useAppDispatch } from "@/src/redux/store";
import { getAllCategoryOfPhase } from "@/src/redux/features/categorySlice";
import ListCategory from "../category/ListCategory";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import NewProgressLoading from "@/src/components/loading/NewProgressLoading";

interface ListItemProps {
  project: any;
  data: PhaseType;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
  index: number;
  groupId: number;
}

const ListItem = ({
  project,
  data,
  groupId,
  index,
  setPhaseData,
}: ListItemProps) => {
  const [dataCategory, setDataCategory] = React.useState<any>([]);
  const textareaRef = React.useRef<React.ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = React.useState(false);

  const dispatch = useAppDispatch();

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  // console.log("phase", data);

  React.useEffect(() => {
    dispatch(getAllCategoryOfPhase(data.id)).then((result: any) => {
      socketInstance.on(`getCategories-${data.id}`, (dataResponse: any) => {
        // console.log("data.categories", dataResponse.categories);
        setDataCategory(dataResponse.categories);
      });

      // setDataCategory(result.payload);
      // console.log("category", result.payload);
    });
  }, []);

  return (
    <li
      className="shrink-0 h-auto w-[272px] select-none"
      style={{ listStyle: "none" }}
    >
      <NewProgressLoading phaseData={data} />

      <div
        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
        style={{ borderRadius: "7px", marginBottom: "10px" }}
      >
        <ListHeader
          onAddCategory={enableEditing}
          data={data}
          setPhaseData={setPhaseData}
          project={project}
        />

        {data && (
          <ListCategory
            project={project}
            phaseData={data}
            dataCategory={dataCategory}
            setDataCategory={setDataCategory}
          />
        )}

        <CategoryForm
          phaseData={data}
          phaseId={data.id}
          dataCategory={dataCategory}
          setDataCategory={setDataCategory}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};

export default ListItem;
