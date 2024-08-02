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
  Descriptions,
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
import { extractProjectDates, formatDate } from "@/src/utils/handleFunction";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import BusinessInfoForm from "./BusinessInfoForm";
import ProjectDetailsForm from "./ProjectDetailForm";
import ResponsiblePersonForm from "./ResponsiblePersonForm";
import { useAppDispatch } from "@/src/redux/store";
import { updateProjectByAdmin } from "@/src/redux/features/projectSlice";
import toast from "react-hot-toast";
import TableCategoryDetail from "@/app/(home)/(business)/(routes)/project/[projectId]/view/_components/phases/phases_detail/TableCategoryDetail";
import ViewPhaseDetailByAdmin from "../other_project_detail/ViewPhaseDetailByAdmin";
import RegisterPitchingDetailByAdmin from "../other_project_detail/RegisterPitchingDetailByAdmin";

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
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
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
        business_id: businessUser?.id,
        // responsible_person_id: responsiblePersonList[0]?.id,
      });

      if (selectedProject?.document_related_link) {
        setFileList([
          {
            uid: "-1",
            name: "document",
            status: "done",
            url: selectedProject?.document_related_link[0],
          },
        ]);
      }

      setBusinessUser(
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

  const handleFormUpdateProjectSubmit = async () => {
    setConfirmLoading(true);
    let documentLink = selectedProject.document_related_link[0];

    if (fileList.length > 0 && fileList[0]?.originFileObj) {
      const file = fileList[0]?.originFileObj;
      const storageRef = ref(storage, `khoduan/${file.name}`);
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

    const projectTimeline = extractProjectDates(
      form.getFieldValue("project_implement_time")
    );

    const updatedProject = {
      is_created_by_admin: true,
      businessName: businessUser.fullname,
      businessEmail: businessUser.email,
      name_project: form.getFieldValue("name_project"),
      business_type: form.getFieldValue("business_type"),
      purpose: form.getFieldValue("purpose"),
      target_object: form.getFieldValue("target_object"),
      note: form.getFieldValue("note"),
      document_related_link: [documentLink],
      request: form.getFieldValue("request"),
      project_implement_time: form.getFieldValue("project_implement_time"),
      project_start_date: projectTimeline.project_start_date,
      is_extent: false,
      project_expected_end_date: projectTimeline.project_expected_end_date,
      expected_budget: form.getFieldValue("expected_budget"),
      is_first_project: selectedProject.is_first_project,
      id: selectedProject?.id,
    };

    const resUpdate = await dispatch(
      updateProjectByAdmin({ id: selectedProject?.id, data: updatedProject })
    );

    if (updateProjectByAdmin.fulfilled.match(resUpdate)) {
      const updatedDataTable = dataTable.map((project: any) =>
        project.id === updatedProject.id ? resUpdate.payload : project
      );
      setDataTable(updatedDataTable);
      setSelectedProject(updatedProject);
      onClose();
      toast.success("Cập nhập dự án thành công!");
    } else {
      toast.error(`${resUpdate.payload}`);
    }
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
        status === "Pending" && (
          <Button
            danger
            key="confirm"
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
        onFinish={handleFormUpdateProjectSubmit}
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

            {editMode && (
              <>
                <div className="flex justify-end">
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
                        async onOk() {
                          await handleFormUpdateProjectSubmit();
                        },
                        onCancel() {},
                      });
                    }}
                  >
                    Thay đổi
                  </Button>
                </div>
              </>
            )}
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

          {status !== "Pending" && (
            <Tabs.TabPane tab="Nhóm đăng kí pitching" key="4">
              <RegisterPitchingDetailByAdmin
                selectedProject={selectedProject}
              />
            </Tabs.TabPane>
          )}

          {status !== "Pending" && status !== "Public" && (
            <Tabs.TabPane tab="Chi tiết quá trình" key="5">
              <ViewPhaseDetailByAdmin selectedProject={selectedProject} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Form>
    </Modal>
  );
};

export default ModalDetailProject;
