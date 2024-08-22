import { FeedbackType } from "@/src/types/feedback.type";
import { Button, Modal } from "antd";
import React from "react";
const { confirm } = Modal;

interface ModalProps {
  typeFeedbackModal: number;
  open: boolean;
  onClose: () => void;
  feedbackData: FeedbackType;
  setFeedbackData: React.Dispatch<React.SetStateAction<FeedbackType>>;
}

const ModelFeedbackProject: React.FC<ModalProps> = (props) => {
  //typeFeedbackModal
  // 1 là create
  // 2 là view
  // 3 là update
  const { typeFeedbackModal, open, onClose, feedbackData, setFeedbackData } =
    props;

  const handleInputChange = (e: any, field: string) => {
    let value = e.target.value;

    if (field === "general_assessment") {
      value = Number(value);
    }

    if (typeFeedbackModal !== 2) {
      setFeedbackData({
        ...feedbackData,
        [field]: value,
      });
    }
  };

  const handleCallApiCreateFeedbackProject = async () => {
    onClose();
  };

  const handleCallApiUpdateFeedbackProject = async () => {
    onClose();
  };

  const renderFooter = () => {
    switch (typeFeedbackModal) {
      case 1: // Create
        return (
          <Button
            type="primary"
            onClick={async () => {
              confirm({
                cancelText: "Quay lại",
                okText: "Xác nhận",
                title: "Bạn có chắc là muốn tạo nhận xét này? ",
                async onOk() {
                  await handleCallApiCreateFeedbackProject();
                },
                onCancel() {},
              });
            }}
          >
            Đăng nhận xét
          </Button>
        );
      case 2: // View
        return <></>;
      case 3: // Update
        return (
          <Button
            type="primary"
            onClick={async () => {
              confirm({
                cancelText: "Quay lại",
                okText: "Xác nhận",
                title: "Bạn có chắc là muốn cập nhập nhận xét này? ",
                async onOk() {
                  await handleCallApiUpdateFeedbackProject();
                },
                onCancel() {},
              });
            }}
          >
            Thay đổi nhận xét
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      width={"1200px"}
      title={""}
      open={open}
      style={{ top: 10 }}
      onCancel={() => {
        onClose();
      }}
      footer={renderFooter()}
    >
      <div className="stage-container flex flex-col justify-center items-center">
        <h4 className="title text-xl font-medium text-center">
          PHIẾU LẤY Ý KIẾN NHẬN XÉT CỦA DOANH NGHIỆP VỀ KẾT QUẢ THỰC HIỆN ĐỀ
          TÀI/DỰ ÁN CỦA SINH VIÊN
        </h4>

        <div className="stage-3">
          <div className="form-group-material mt-0">
            <textarea
              rows={3}
              required={true}
              className="form-control"
              spellCheck="false"
              placeholder=""
              value={feedbackData.coordination_work}
              onChange={(e) => handleInputChange(e, "coordination_work")}
              disabled={typeFeedbackModal === 2}
            />
            <label style={{ fontSize: "15px" }}>
              Về công tác phối hợp giữa Giảng viên, sinh viên và Doanh nghiệp{" "}
              <span className="text-red-700">*</span>
            </label>
          </div>

          <>
            <fieldset
              className="border border-gray-300 px-4"
              style={{ borderRadius: "8px" }}
            >
              <legend
                className="text-lg"
                style={{ fontSize: "15px", color: "#6d859f" }}
              >
                Về kết quả thực hiện so với yêu cầu đề ra{" "}
                <span className="text-red-700">*</span>
              </legend>
              <div className="pb-2">
                <div className="flex flex-row justify-around">
                  {["Đạt", "Không đạt"].map((option) => (
                    <label
                      key={option}
                      className="inline-flex items-center cursor-pointer"
                      style={{
                        fontSize: "15px",
                        color:
                          feedbackData.compare_results === option
                            ? "#000"
                            : "#ced4da",
                      }}
                    >
                      <input
                        type="radio"
                        name="compare_results"
                        value={option}
                        checked={feedbackData.compare_results === option}
                        onChange={(e) =>
                          handleInputChange(e, "compare_results")
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          </>

          <div className="form-group-material mt-4">
            <textarea
              rows={3}
              required={true}
              className="form-control"
              spellCheck="false"
              placeholder=""
              value={feedbackData.comment}
              onChange={(e) => handleInputChange(e, "comment")}
              disabled={typeFeedbackModal === 2}
            />
            <label style={{ fontSize: "15px" }}>
              Nhận xét/Góp ý về đề tài/dự án{" "}
              <span className="text-red-700">*</span>
            </label>
          </div>

          <div className="form-group-material mt-4">
            <textarea
              rows={3}
              required={true}
              className="form-control"
              spellCheck="false"
              placeholder=""
              value={feedbackData.suggest_improvement}
              onChange={(e) => handleInputChange(e, "suggest_improvement")}
              disabled={typeFeedbackModal === 2}
            />
            <label style={{ fontSize: "15px" }}>
              Đề xuất cải tiến hoặc hướng phát triển{" "}
              <span className="italic">(Nếu có)</span>
            </label>
          </div>

          <>
            <fieldset
              className="border border-gray-300 px-4"
              style={{ borderRadius: "8px" }}
            >
              <legend
                className="text-lg"
                style={{ fontSize: "15px", color: "#6d859f" }}
              >
                Đánh giá chung (theo thang điểm 10){" "}
                <span className="text-red-700">*</span>
              </legend>
              <div className="pb-2">
                <div className="flex flex-row justify-around">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((option) => (
                    <label
                      key={option}
                      className="inline-flex items-center cursor-pointer"
                      style={{
                        fontSize: "15px",
                        color:
                          feedbackData.general_assessment === option
                            ? "#000"
                            : "#ced4da",
                      }}
                    >
                      <input
                        type="radio"
                        name="general_assessment"
                        value={option}
                        checked={feedbackData.general_assessment === option}
                        onChange={(e) =>
                          handleInputChange(e, "general_assessment")
                        }
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          </>

          <>
            <fieldset
              className="border border-gray-300 px-4 mt-2"
              style={{ borderRadius: "8px" }}
            >
              <legend
                className="text-lg"
                style={{ fontSize: "15px", color: "#6d859f" }}
              >
                Về kết quả thực hiện so với yêu cầu đề ra{" "}
                <span className="text-red-700">*</span>
              </legend>
              <div className="pb-2">
                <div className="flex flex-row justify-around">
                  {["Đồng ý", "Không đồng ý"].map((option) => (
                    <label
                      key={option}
                      className="inline-flex items-center cursor-pointer"
                      style={{
                        fontSize: "15px",
                        color:
                          feedbackData.conclusion === option
                            ? "#000"
                            : "#ced4da",
                      }}
                    >
                      <input
                        type="radio"
                        name="conclusion"
                        value={option}
                        checked={feedbackData.conclusion === option}
                        onChange={(e) => handleInputChange(e, "conclusion")}
                        className="mr-2"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </fieldset>
          </>
        </div>
      </div>
    </Modal>
  );
};

export default ModelFeedbackProject;
