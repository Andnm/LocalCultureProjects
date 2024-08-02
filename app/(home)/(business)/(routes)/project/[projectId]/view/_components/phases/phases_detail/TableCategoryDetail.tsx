import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  Radio,
  Spin,
  Table,
  Upload,
  type TableColumnsType,
} from "antd";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import { formatCurrency, formatDate } from "@/src/utils/handleFunction";
import { useAppDispatch } from "@/src/redux/store";
import { getCostInCategory } from "@/src/redux/features/costSlice";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { PaymentMethodEnum } from "@/src/utils/enum/payment.enum";

const { confirm } = Modal;

interface Props {
  dataPhase: any;
  getStatusColor: (status: string) => string;
  onClose: () => void;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; //cái này set cho data list
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
  handleOpenModalChoosePaymentMethod: () => void;
}

const TableCategoryDetail: React.FC<Props> = (props) => {
  const {
    dataPhase,
    getStatusColor,
    onClose,
    setPhaseData,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    handleOpenModalChoosePaymentMethod,
  } = props;
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();

  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true); //dùng để kiểm soát việc setIsLoading làm 1 lần
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    if (dataPhase && dataPhase.categories) {
      if (initialLoad) {
        setLoading(true);
        setInitialLoad(false);
      }
      Promise.all(
        dataPhase.categories.map(async (category: any) => {
          const costData = await callApiGetCostInCategory(category.id);
          const evidenceUrls =
            category.cost?.evidences?.map(
              (evidence: any) => evidence.evidence_url
            ) || [];

          const fileList = evidenceUrls.map((url: string, index: number) => ({
            uid: `${category.id}-${index}`,
            name: `Bằng chứng ${index + 1}`,
            status: "done",
            url: url,
          }));

          return {
            ...category,
            expected_cost: costData.payload.expected_cost,
            actual_cost: costData.payload.actual_cost,
            fileList: fileList,
          };
        })
      ).then((categoriesWithCosts) => {
        const sortedCategories = categoriesWithCosts.sort((a, b) => {
          return a.id - b.id;
        });
        // console.log("sortedCategories: ", sortedCategories);
        setCategoriesData(sortedCategories);

        setLoading(false);
      });
    }
  }, [dataPhase]);

  const callApiGetCostInCategory = async (categoryId: number): Promise<any> => {
    const response = await dispatch(getCostInCategory(categoryId));
    return response;
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Tên hạng mục",
      dataIndex: "category_name",
      key: "category_name",
      fixed: "left",
    },
    {
      title: "Trạng thái",
      dataIndex: "category_status",
      key: "category_status",
      render: (category_status: string) => (
        <span
          className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${getStatusColor(
            category_status
          )}`}
        >
          {category_status}
        </span>
      ),
      fixed: "left",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => formatDate(createdAt),
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      key: "detail",
    },
    {
      title: "Kết quả dự kiến",
      dataIndex: "result_expected",
      key: "result_expected",
    },
    {
      title: "Kết quả thực tế",
      dataIndex: "result_actual",
      key: "result_actual",
      render: (result_actual: string) => <TextNotUpdate data={result_actual} />,
    },
    {
      title: "Chi phí dự trù",
      dataIndex: "expected_cost",
      key: "expected_cost",
      width: "150px",
      render: (expected_cost: number) => (
        <TextNotUpdate data={formatCurrency(expected_cost)} />
      ),
      fixed: "right",
    },
    {
      title: "Chi phí thực tế",
      dataIndex: "actual_cost",
      key: "actual_cost",
      width: "150px",
      render: (actual_cost: number) => (
        <TextNotUpdate data={formatCurrency(actual_cost)} />
      ),
      fixed: "right",
    },
    {
      title: "Bằng chứng",
      dataIndex: "fileList",
      key: "fileList",
      width: "150px",
      render: (fileList: any[]) =>
        fileList.length > 0 ? (
          <Upload
            fileList={fileList}
            beforeUpload={() => false}
            showUploadList={{ showRemoveIcon: false }}
          />
        ) : (
          <TextNotUpdate data="(Chưa cập nhật)" />
        ),
      fixed: "right",
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          scroll={{ x: 1500 }}
          dataSource={categoriesData}
          rowKey="id"
          className="custom-table webkit-scrollbar"
          pagination={false}
          footer={() => (
            <div className="flex justify-end">
              <span>
                <strong className="font-bold relative right-3">TỔNG:</strong>
              </span>
              <span
                style={{ width: "150px" }}
                className="font-bold relative left-8"
              >
                <TextNotUpdate
                  data={formatCurrency(dataPhase.expected_cost_total)}
                />
              </span>
              <span
                style={{ width: "150px" }}
                className="font-bold relative left-8"
              >
                <TextNotUpdate
                  data={formatCurrency(dataPhase.actual_cost_total)}
                />
              </span>
              <span style={{ width: "150px", textAlign: "right" }}></span>
            </div>
          )}
        />
        {userLogin?.role_name === "Business" ||
          (userLogin?.role_name === "ResponsiblePerson" &&
            dataPhase?.phase_status === "Done" &&
            dataPhase?.cost_status !== "Transferred" && (
              <div className="flex justify-end mt-4">
                <Button
                  type="primary"
                  onClick={handleOpenModalChoosePaymentMethod}
                  className="mt-4"
                >
                  Tiến hành thanh toán giai đoạn
                </Button>
              </div>
            ))}
      </Spin>
    </div>
  );
};

export default TableCategoryDetail;
