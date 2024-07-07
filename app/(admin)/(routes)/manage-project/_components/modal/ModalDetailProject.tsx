"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Upload,
  message,
  Tabs,
  Divider,
} from "antd";
import { BiAddToQueue, BiEdit, BiPlus } from "react-icons/bi";
import { UploadOutlined } from "@ant-design/icons";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "@/src/utils/configFirebase";
import { Check, Trash } from "lucide-react";
import StatusCell from "../StatusCell";
import { formatDate } from "@/src/utils/handleFunction";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import BusinessInfoForm from "./BusinessInfoForm";
import ProjectDetailsForm from "./ProjectDetailForm";
import ResponsiblePersonForm from "./ResponsiblePersonForm";

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataTable: any;
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  selectedProject: any;
  setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
  status: string;
  actionConfirm?: any;
}

const ModalDetailProject: React.FC<Props> = (props) => {
  const {
    onSubmit,
    open,
    onClose,
    dataTable,
    setDataTable,
    selectedProject,
    setSelectedProject,
    status,
    actionConfirm,
  } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [businessUser, setBusinessUser] = React.useState<any>();
  const [responsiblePersonList, setResponsiblePersonList] = React.useState<
    any[]
  >([]);

  //xử lý thêm người phụ trách
  const [formAddResponsiblePerson] = Form.useForm();
  const [isAdding, setIsAdding] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      form.setFieldsValue({
        ...selectedProject,
        // business_id: businessUser?.id,
        // responsible_person_id: responsiblePersonList[0]?.id,
      });

      if (selectedProject.document_related_link) {
        setFileList([
          {
            uid: "-1",
            name: "document",
            status: "done",
            url: selectedProject.document_related_link[0],
          },
        ]);
      }

      setBusinessUser(
        selectedProject?.user_projects?.find(
          (up: any) => up.user.role_name === "Business"
        )?.user
      );

      console.log(
        "business data: ",
        selectedProject?.user_projects?.find(
          (up: any) => up.user.role_name === "Business"
        )?.user
      );

      setResponsiblePersonList(
        selectedProject.user_projects
          .filter((up: any) => up.user.role_name === "ResponsiblePerson")
          .map((up: any) => up)
      );
    }
  }, [selectedProject]);

  const handleFormSubmit = async (values: any) => {
    setConfirmLoading(true);
    let documentLink = selectedProject.document_related_link;

    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      const storageRef = ref(storage, `documents/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await uploadTask;
        documentLink = await getDownloadURL(storageRef);
      } catch (error) {
        message.error("File upload failed");
        setConfirmLoading(false);
        return;
      }
    }

    const updatedProject = {
      ...selectedProject,
      ...values,
      document_related_link: documentLink,
    };

    const updatedDataTable = dataTable.map((project: any) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setDataTable(updatedDataTable);
    setSelectedProject(updatedProject);
    onClose();
    setConfirmLoading(false);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <Modal
      style={{ top: 10 }}
      width={1200}
      title={
        <div className="inline-block m-auto">
          <div className="flex items-center">
            {editMode ? (
              <>Chỉnh sửa thông tin chi tiết</>
            ) : (
              <>
                <p>Thông tin chi tiết</p>
                <Button
                  type="text"
                  icon={<BiEdit />}
                  onClick={() => setEditMode((prev) => !prev)}
                  style={{ marginLeft: 10 }}
                />
              </>
            )}
          </div>
        </div>
      }
      open={open}
      confirmLoading={confirmLoading}
      onCancel={() => {
        onClose();
        form.resetFields();
        formAddResponsiblePerson.resetFields();
        setEditMode(false);
        setIsAdding(false);
      }}
      footer={[
        editMode && [
          <>
            <Button
              className="btn-submit"
              key="cancel"
              type="text"
              onClick={() => {
                setEditMode((prev) => !prev);
                setIsAdding(false);
              }}
            >
              Huỷ
            </Button>
            <Button
              className="btn-submit btn-continue-with-new-info"
              key="update"
              onClick={async () => {
                confirm({
                  cancelText: "Quay lại",
                  okText: "Xác nhận",
                  title:
                    "Bạn có chắc là muốn thay đổi những nội dung đã chỉnh sửa?",
                  async onOk() {},
                  onCancel() {},
                });
              }}
            >
              Thay đổi
            </Button>
          </>,
        ],
        status === "Pending" && (
          <Button
            danger
            onClick={async () => {
              confirm({
                cancelText: "Quay lại",
                okText: "Xác nhận",
                title: "Bạn có chắc là muốn phê duyệt dự án này? ",
                async onOk() {
                  actionConfirm();
                },
                onCancel() {},
              });
            }}
          >
            <Check className="h-3 w-3" /> Xác nhận phê duyệt
          </Button>
        ),
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        ref={formRef}
        onFinish={handleFormSubmit}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Thông tin doanh nghiệp" key="1">
            {/* doanh nghiệp  */}
            <BusinessInfoForm
              form={form}
              businessUser={businessUser}
              editMode={editMode}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Đề tài" key="2">
            {/* đề tài */}
            <ProjectDetailsForm
              form={form}
              fileList={fileList}
              editMode={editMode}
              status={status}
              handleUploadChange={handleUploadChange}
              selectedProject={selectedProject}
            />
          </Tabs.TabPane>

          <Tabs.TabPane tab="Người phụ trách" key="3">
            {/* người phụ trách */}
            <ResponsiblePersonForm
              editMode={editMode}
              formAddResponsiblePerson={formAddResponsiblePerson}
              isAdding={isAdding}
              loadingSubmit={loadingSubmit}
              setLoadingSubmit={setLoadingSubmit}
              responsiblePersonList={responsiblePersonList}
              setResponsiblePersonList={setResponsiblePersonList}
              setIsAdding={setIsAdding}
              selectedProject={selectedProject}
              setDataTable={setDataTable}
            />
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default ModalDetailProject;
