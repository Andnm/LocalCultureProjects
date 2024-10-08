"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@material-tailwind/react";
import { useAppDispatch } from "@/src/redux/store";
import {
  clearBusinessInfo,
  getAllBusinessInfo,
  uploadFileBusinessInfo,
} from "@/src/redux/features/userSlice";
import toast from "react-hot-toast";
import { BusinessInfoListSheet } from "@/src/types/user.type";
import Table, { ColumnsType } from "antd/es/table";
import { Button, message, Modal, Pagination, Spin, Upload } from "antd";
import {
  UploadOutlined,
  FileExcelOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { CgRemove } from "react-icons/cg";
const { confirm } = Modal;

const BusinessInfo = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<BusinessInfoListSheet[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  //upload file status
  const [file, setFile] = useState<File | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async (page: number) => {
    setLoading(true);
    dispatch(getAllBusinessInfo())
      .then((resGetAll: any) => {
        if (getAllBusinessInfo.rejected.match(resGetAll)) {
          toast.error(`${resGetAll.payload}`);
        } else if (getAllBusinessInfo.fulfilled.match(resGetAll)) {
          const businessInfoList = resGetAll.payload;
          setData(
            businessInfoList.slice((page - 1) * pageSize, page * pageSize)
          );
          setTotalItems(businessInfoList.length);
        }
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handleTableChange = (page: number) => {
    setCurrentPage(page);
    fetchData(page);
  };

  const columns: ColumnsType<BusinessInfoListSheet> = [
    {
      title: "No",
      width: 50,
      key: "no",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
      fixed: "left",
    },
    {
      title: "Thông tin Doanh nghiệp/ Hộ kinh doanh",
      children: [
        {
          title: "Tên Doanh nghiệp/ Hộ kinh doanh",
          dataIndex: "businessName",
          key: "businessName",
          fixed: "left",
          width: 200,
        },
        {
          title: "Lĩnh vực kinh doanh",
          dataIndex: "businessField",
          key: "businessField",
          width: 180,
        },
        {
          title: "Giới thiệu ngắn về Doanh nghiệp/Hộ kinh doanh và sản phẩm",
          dataIndex: "shortIntro",
          key: "shortIntro",
          width: 500,
        },
        { title: "Địa chỉ", dataIndex: "address", key: "address", width: 500 },
        {
          title: "Website/ Fanpage",
          dataIndex: "website",
          key: "website",
          width: 500,
        },
      ],
    },
    {
      title: "Thông tin liên hệ người phụ trách",
      children: [
        {
          title: "Họ và tên người phụ trách",
          dataIndex: "contactName",
          key: "contactName",
        },
        { title: "Chức vụ", dataIndex: "position", key: "position" },
        {
          title: "Số điện thoại",
          dataIndex: "phoneNumber",
          key: "phoneNumber",
        },
        { title: "Email", dataIndex: "email", key: "email" },
        {
          title: "Thông tin liên hệ khác (nếu có)",
          dataIndex: "otherContactInfo",
          key: "otherContactInfo",
        },
      ],
    },
  ];

  const handleFileChange = (info: any) => {
    const uploadedFile = info.file;

    if (
      uploadedFile &&
      uploadedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setFile(uploadedFile);
      setIsModalVisible(true);
    } else {
      message.error("Bạn chỉ được đăng file excel!");
    }
  };

  const handleUploadConfirmation = async () => {
    if (file) {
      const formData = new FormData();

      formData.append("file", file);

      setIsUploading(true);

      const data = {
        file: file,
      };

      try {
        const result = await dispatch(uploadFileBusinessInfo(data)).unwrap();

        if (result) {
          message.success("Cập nhập dữ liệu thành công!");
          fetchData(currentPage);
        }
      } catch (error) {
        message.error("File upload thất bại!");
        toast.error(`${error}`);
      } finally {
        setIsUploading(false);
        setFile(null);
      }
    }
    setIsModalVisible(false);
  };

  const handleCancelUpload = () => {
    setFile(null);
    setIsModalVisible(false);
  };

  const handleExport = async () => {
    setIsUploading(true);
    try {
      const resGetAll = await dispatch(getAllBusinessInfo()).unwrap();

      const dataToExport = resGetAll.map(
        (item: BusinessInfoListSheet, index: number) => ({
          No: index + 1,
          "Tên Doanh nghiệp/ Hộ kinh doanh": item.businessName || "",
          "Lĩnh vực kinh doanh": item.businessField || "",
          "Giới thiệu ngắn về Doanh nghiệp/Hộ kinh doanh và sản phẩm":
            item.shortIntro || "",
          "Địa chỉ": item.address || "",
          "Website/ Fanpage": item.website || "",
          "Họ và tên": item.contactName || "",
          "Chức vụ": item.position || "",
          "Số điện thoại": item.phoneNumber || "",
          Email: item.email || "",
          "Thông tin liên hệ khác (nếu có)": item.otherContactInfo || "",
        })
      );

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "BusinessInfo");

      XLSX.writeFile(workbook, "business_info_export.xlsx");

      message.success("Xuất file thành công!");
    } catch (error) {
      message.error("Xuất file thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = async () => {
    setIsUploading(true);
    try {
      const resClearData = await dispatch(clearBusinessInfo()).unwrap();

      if (resClearData) {
        fetchData(currentPage);
      }
      message.success("Xóa dữ liệu thành công!");
    } catch (error) {
      message.error("Xóa dữ liệu thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-4 manager-project min-h-full">
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "start",
          gap: "5px",
        }}
      >
        <Upload
          accept=".xlsx"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button type="primary" icon={<UploadOutlined />}>
            Nhập File
          </Button>
        </Upload>

        <Button icon={<ExportOutlined />} onClick={handleExport}>
          Xuất File
        </Button>

        <Button
          icon={<CgRemove />}
          danger
          onClick={async () => {
            confirm({
              cancelText: "Quay lại",
              okText: "Xác nhận",
              title:
                "Bạn có chắc là muốn xóa hết dữ liệu về danh sách thông tin doanh nghiệp ngày? ",
              async onOk() {
                handleClear();
              },
              onCancel() {},
            });
          }}
        >
          Xóa dữ liệu
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="id"
          className="table-business"
          scroll={{ x: "max-content" }}
        />
      )}
      <Pagination
        current={currentPage}
        pageSize={10}
        total={totalItems}
        onChange={handleTableChange}
        style={{ marginTop: "16px", textAlign: "right" }}
      />

      <Modal
        open={isModalVisible}
        onOk={handleUploadConfirmation}
        onCancel={handleCancelUpload}
        okText="Chắc chắn"
        cancelText="Không"
        confirmLoading={isUploading}
      >
        <p>
          Bạn có chắc muốn tải lên hệ thống tất cả dữ liệu có trong file vừa mới
          đăng?
        </p>
      </Modal>

      {isUploading && <SpinnerLoading />}
    </Card>
  );
};

export default BusinessInfo;
