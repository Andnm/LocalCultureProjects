import { Hint } from "@/components/hint";
import { changeStatusFromEnToVn } from "@/src/utils/handleFunction";
import React from "react";
import ModalCategoryDetail from "./category_detail/ModalCategoryDetail";

interface ListCategoryProps {
  project: any;
  phaseData: any;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>;
  dataCategory: any;
  setDataCategory: React.Dispatch<React.SetStateAction<any[]>>;
  groupId: any;
}

const ListCategory = ({
  project,
  phaseData,
  setPhaseData,
  dataCategory,
  setDataCategory,
  groupId,
}: ListCategoryProps) => {
  // console.log("dataCategory", dataCategory);
  const [isOpenModalDetail, setIsOpenModalDetail] = React.useState(false);
  const [isOpenModalCategoryDetail, setIsOpenModalCategoryDetail] =
    React.useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = React.useState<any | null>(
    null
  );

  const handleOpenModalDetail = (category: any) => {
    setSelectedCategory(category);
    // setIsOpenModalDetail(true);
    setIsOpenModalCategoryDetail(true);
  };

  const getBorderColorClass = (status: string) => {
    switch (status) {
      case "Todo":
        return "border-gray-500";
      case "Processing":
      case "Doing":
        return "border-yellow-500";
      case "Done":
      case "Complete":
        return "border-green-500";
      default:
        return "";
    }
  };

  return (
    // mới sửa khúc này
    <div className="pt-2 px-2 flex flex-col gap-2">
      {Array.isArray(dataCategory) &&
        dataCategory?.map((category: any, index: number) => (
          <div
            key={index}
            className="w-full h-10 relative px-3 py-3 border-neutral-200/100 bg-white transition hover:ring-2 cursor-pointer shadow-sm"
            style={{ borderRadius: "7px" }}
            onClick={() => handleOpenModalDetail(category)}
          >
            <p className="text-sm">{category.category_name}</p>

            <Hint
              sideOffset={10}
              description={`Hạng mục ${changeStatusFromEnToVn(
                category.category_status
              ).toLowerCase()}`}
              side={"left"}
            >
              <div
                className={`absolute top-5 -left-1 w-6 ${getBorderColorClass(
                  category.category_status
                )} border-2 rotate-90 `}
              ></div>
            </Hint>
          </div>
        ))}

      {isOpenModalCategoryDetail && selectedCategory && (
        <ModalCategoryDetail
          groupId={groupId}
          project={project}
          phaseData={phaseData}
          setPhaseData={setPhaseData}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setDataCategory={setDataCategory}
          open={isOpenModalCategoryDetail}
          onClose={() => {
            setIsOpenModalCategoryDetail(false);
          }}
        />
      )}
    </div>
  );
};

export default ListCategory;
