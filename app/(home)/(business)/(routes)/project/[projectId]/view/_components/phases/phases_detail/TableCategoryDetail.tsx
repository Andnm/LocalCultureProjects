import React, { useEffect, useState } from "react";
import { Button, Modal, Spin, Table, type TableColumnsType } from "antd";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import { formatCurrency, formatDate } from "@/src/utils/handleFunction";
import { useAppDispatch } from "@/src/redux/store";
import { getCostInCategory } from "@/src/redux/features/costSlice";
import { useUserLogin } from "@/src/hook/useUserLogin";

const { confirm } = Modal;

interface Props {
  dataPhase: any;
  getStatusColor: (status: string) => string;
  onClose: () => void;
  setPhaseData: React.Dispatch<React.SetStateAction<any[]>>; //cái này set cho data list
}

const TableCategoryDetail: React.FC<Props> = (props) => {
  const { dataPhase, getStatusColor, onClose, setPhaseData } = props;
  const dispatch = useAppDispatch();
  const [userLogin, setUserLogin] = useUserLogin();

  const [loading, setLoading] = useState<boolean>(false);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  useEffect(() => {
    if (dataPhase && dataPhase.categories) {
      setLoading(true);
      Promise.all(
        dataPhase.categories.map(async (category: any) => {
          const costData = await callApiGetCostInCategory(category.id);
          return {
            ...category,
            expected_cost: costData.payload.expected_cost,
            actual_cost: costData.payload.actual_cost,
          };
        })
      ).then((categoriesWithCosts) => {
        const sortedCategories = categoriesWithCosts.sort((a, b) => {
          return a.id - b.id;
        });
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
      render: (expected_cost: number) => (
        <TextNotUpdate data={formatCurrency(expected_cost)} />
      ),
      fixed: "right",
    },
    {
      title: "Chi phí thực tế",
      dataIndex: "actual_cost",
      key: "actual_cost",
      render: (actual_cost: number) => (
        <TextNotUpdate data={formatCurrency(actual_cost)} />
      ),
      fixed: "right",
    },
    {
      title: "Bằng chứng",
      dataIndex: "evidence",
      key: "evidence",
      render: (evidence: string) => <TextNotUpdate data={evidence} />,
      fixed: "right",
    },
  ];

  const handlePaymentClick = async () => {
    // Implement the payment process logic here
    console.log("Proceeding to phase payment");
  };

  return (
    <div>
      <h3 className="font-bold">Các hạng mục</h3>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          scroll={{ x: 1500 }}
          dataSource={categoriesData}
          rowKey="id"
          className="custom-table webkit-scrollbar"
          pagination={false}
        />
        {userLogin?.role_name !== "Business" &&
          dataPhase?.phase_status !== "Transferred" && (
            <div className="flex justify-end mt-4">
              <Button
                type="primary"
                onClick={async () => {
                  confirm({
                    cancelText: "Quay lại",
                    okText: "Xác nhận",
                    title:
                      "Bạn có chắc là muốn thực hiện thanh toán cho giai đoạn này?",
                    async onOk() {
                      await handlePaymentClick();
                    },
                    onCancel() {},
                  });
                }}
                className="mt-4"
              >
                Tiến hành thanh toán giai đoạn
              </Button>
            </div>
          )}
      </Spin>
    </div>
  );
};

export default TableCategoryDetail;