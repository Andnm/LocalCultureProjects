import TableCategoryDetail from "@/app/(home)/(business)/(routes)/project/[projectId]/view/_components/phases/phases_detail/TableCategoryDetail";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import { getPhaseByProjectId } from "@/src/redux/features/phaseSlice";
import { useAppDispatch } from "@/src/redux/store";
import {
  changeStatusFromEnToVn,
  formatCurrency,
  formatDate,
} from "@/src/utils/handleFunction";
import { Descriptions, Spin, Tabs } from "antd";
import React, { useEffect, useState } from "react";

interface Props {
  selectedProject: any;
}

const ViewPhaseDetailByAdmin: React.FC<Props> = (props) => {
  const { selectedProject } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [phaseDataList, setPhaseDataList] = useState<any>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getPhaseByProjectId(selectedProject?.id)).then((result) => {
      console.log("result: ", result);
      const sortedPhaseData = [...result.payload]?.sort(
        (a, b) => a?.phase_number - b?.phase_number
      );
      console.log("sortedPhaseData: ", sortedPhaseData);
      setPhaseDataList(sortedPhaseData);
      setLoading(false);
    });
  }, []);

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
    <div>
      <Spin spinning={loading}>
        {loading ? (
          <></>
        ) : phaseDataList?.length === 0 ? (
          <p className="text-black">Sinh viên chưa tạo giai đoạn nào cả</p>
        ) : (
          phaseDataList?.map((dataPhase: any, index: number) => {
            return (
              <>
                <div>
                  <h3 className="font-bold text-lg">
                    Chi tiết giai đoạn {dataPhase?.phase_number}
                  </h3>
                  <Descriptions className="px-5" layout="horizontal">
                    <Descriptions.Item
                      label="Trạng thái giai đoạn"
                      className="phase_label"
                    >
                      <span
                        className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(
                          dataPhase.phase_status
                        )}`}
                      >
                        {dataPhase.phase_status}
                      </span>
                    </Descriptions.Item>
                    <Descriptions.Item label=""> </Descriptions.Item>
                    <Descriptions.Item label=""> </Descriptions.Item>

                    <Descriptions.Item
                      label="Tổng chi phí dự trù"
                      className="phase_label"
                    >
                      <p className="font-bold">
                        {" "}
                        {formatCurrency(dataPhase?.expected_cost_total)}
                      </p>
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Tổng chi phí thực tế"
                      className="phase_label"
                    >
                      <p className="font-bold">
                        <TextNotUpdate
                          data={formatCurrency(dataPhase?.actual_cost_total)}
                        />
                      </p>
                    </Descriptions.Item>
                    {dataPhase?.cost_status !== null ? (
                      <Descriptions.Item
                        label="Trạng thái chuyển tiền"
                        className="phase_label"
                      >
                        <span
                          className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(
                            dataPhase.cost_status
                          )}`}
                        >
                          {changeStatusFromEnToVn(dataPhase?.cost_status)}
                        </span>
                      </Descriptions.Item>
                    ) : (
                      <Descriptions.Item label=""> </Descriptions.Item>
                    )}

                    <Descriptions.Item
                      label="Thời gian bắt đầu"
                      className="phase_label"
                    >
                      {formatDate(dataPhase?.phase_start_date)}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Thời gian kết thúc dự kiến"
                      className="phase_label"
                    >
                      {formatDate(dataPhase?.phase_expected_end_date)}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Thời gian kết thúc thực tế"
                      className="phase_label"
                    >
                      <TextNotUpdate
                        data={formatDate(dataPhase?.phase_actual_end_date)}
                      />
                    </Descriptions.Item>
                  </Descriptions>

                  <Descriptions className="px-5" layout="vertical">
                    {dataPhase?.business_feeback && (
                      <Descriptions.Item
                        label="Feedback từ doanh nghiệp"
                        className="phase_label"
                      >
                        <pre className="text-gray-700 whitespace-pre-wrap break-words font-sans text-justify">
                          {dataPhase?.business_feeback}
                        </pre>
                      </Descriptions.Item>
                    )}

                    {dataPhase?.lecturer_feedback && (
                      <Descriptions.Item
                        label="Feedback từ giảng viên"
                        className="phase_label"
                      >
                        {dataPhase?.lecturer_feedback}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </div>

                <TableCategoryDetail
                  dataPhase={dataPhase}
                  getStatusColor={getStatusColor}
                  onClose={() => {}}
                  setPhaseData={setPhaseDataList}
                  selectedPaymentMethod={""}
                  setSelectedPaymentMethod={() => {}}
                  handleOpenModalChoosePaymentMethod={() => {}}
                />
              </>
            );
          })
        )}
        
      </Spin>
    </div>
  );
};

export default ViewPhaseDetailByAdmin;
