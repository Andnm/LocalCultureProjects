import React, { useState } from "react";
import { Button, Spin } from "antd";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { FeedbackType } from "@/src/types/feedback.type";
import { CiEdit } from "react-icons/ci";

interface Props {
  setTypeFeedbackModal: React.Dispatch<React.SetStateAction<number>>;
  setIsOpenModalFeedback: React.Dispatch<React.SetStateAction<boolean>>;
  closeDrawer: () => void;
  feedbackData: FeedbackType;
  setFeedbackData: React.Dispatch<React.SetStateAction<FeedbackType>>;
}

const Feedback: React.FC<Props> = (props) => {
  const {
    setTypeFeedbackModal,
    setIsOpenModalFeedback,
    closeDrawer,
    feedbackData,
    setFeedbackData,
  } = props;

  const [userLogin, setUserLogin] = useUserLogin();

  const handleOpenModalFeedBackProject = (typeNumber: number) => {
    closeDrawer();
    setTypeFeedbackModal(typeNumber);
    setIsOpenModalFeedback(true);
  };

  const isBusinessOrResponsiblePerson =
    userLogin?.role_name === "Business" ||
    userLogin?.role_name === "ResponsiblePerson";

  const renderContent = () => {
    if (feedbackData.coordination_work === "") {
      if (isBusinessOrResponsiblePerson) {
        return (
          <Button
            onClick={() => {
              handleOpenModalFeedBackProject(1);
            }}
          >
            Bấm vào để tạo cập nhập
          </Button>
        );
      } else {
        return <p>Doanh nghiệp chưa tạo đánh giá!</p>;
      }
    } else {
      return (
        <div className="inline-block">
          <div className="flex items-center">
            <Button
              onClick={() => {
                handleOpenModalFeedBackProject(2);
              }}
            >
              Bấm vào để xem
            </Button>
            {isBusinessOrResponsiblePerson && (
              <Button
                className="ml-4"
                icon={<CiEdit />}
                onClick={() => {
                  handleOpenModalFeedBackProject(3);
                }}
              />
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="mt-20">
      Đánh giá từ doanh nghiệp: <span className="ml-2"></span>
      {renderContent()}
    </div>
  );
};

export default Feedback;
