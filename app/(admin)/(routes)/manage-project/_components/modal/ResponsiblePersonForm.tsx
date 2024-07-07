import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Modal, Divider, message } from "antd";
import { Trash } from "lucide-react";
import { BiAddToQueue, BiPlus } from "react-icons/bi";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";
import { useAppDispatch } from "@/src/redux/store";
import {
  addMoreResponsiblePersonByAdmin,
  removeResponsiblePerson,
} from "@/src/redux/features/responsiblePersonSlice";
import {
  AddResponsiblePersonType,
  ProviderAccountType,
} from "@/src/types/user.type";
import toast from "react-hot-toast";
import {
  checkResponsibleInfo,
  providerAccount,
} from "@/src/redux/features/userSlice";
import ModalConfirmUpdateResponsible from "./ModalConfirmUpdateResponsible";
import ModalCheckConfirmCreateResponsible from "./ModalCheckConfirmCreateResponsible";

const { Option } = Select;
const { confirm } = Modal;

interface ResponsiblePersonFormProps {
  formAddResponsiblePerson: any;
  responsiblePersonList: any;
  setResponsiblePersonList: React.Dispatch<React.SetStateAction<any[]>>;
  editMode: boolean;
  isAdding: boolean;
  loadingSubmit: boolean;
  setLoadingSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProject: any;
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
}

const ResponsiblePersonForm: React.FC<ResponsiblePersonFormProps> = ({
  formAddResponsiblePerson,
  responsiblePersonList,
  setResponsiblePersonList,
  editMode,
  isAdding,
  loadingSubmit,
  setLoadingSubmit,
  setIsAdding,
  selectedProject,
  setDataTable,
}) => {
  const dispatch = useAppDispatch();
  const [
    openModalConfirmChangeResponsibleInfo,
    setOpenModalConfirmChangeResponsibleInfo,
  ] = useState<boolean>(false);
  const [openModalCheckConfirmCreate, setOpenModalCheckConfirmCreate] =
    useState<boolean>(false);

  const [isChangeResponsibleInfo, setIsChangeResponsibleInfo] =
    useState<boolean>(false);

  const [isCreateAccount, setIsCreateAccount] = useState<boolean>(false);
  //lưu response của check responsible
  const [resultDataCheck, setResultDataCheck] = useState<any>(null);

  // chia case (-1 ý là chưa biết)
  // 1. check là rỗng và createAccountCheck là -1  => hiện modal confirm tạo ngay => call api create
  // 2. check khác rỗng và createAccountCheck là -1  => hiện modal confirm change
  //                                             => hiện modal confirm tạo ngay => call api create
  // 3. check là rỗng và createAccountCheck là 0 => call api create
  // 4. check khác rỗng và createAccountCheck là 0 => hiện modal confirm change => call api create
  const [resultCase, setResultCase] = useState<number>(0);

  const [shouldCallAddResponsiblePerson, setShouldCallAddResponsiblePerson] =
    useState<boolean>(false);

  const handleRemoveResponsiblePerson = async (responsiblePerson: any) => {
    try {
      const res = await dispatch(
        removeResponsiblePerson({
          projectId: selectedProject?.id,
          userId: responsiblePerson?.user?.id,
        })
      );

      if (removeResponsiblePerson.fulfilled.match(res)) {
        setResponsiblePersonList((prevList: any) =>
          prevList.filter(
            (person: any) => person.user.id !== responsiblePerson.user.id
          )
        );

        setDataTable((prevDataTable: any[]) =>
          prevDataTable.map((item) => {
            if (item.id === selectedProject?.id) {
              return {
                ...item,
                user_projects: item.user_projects.filter(
                  (person: any) => person.user.id !== responsiblePerson.user.id
                ),
              };
            }
            return item;
          })
        );
        message.success(`Xóa ${responsiblePerson?.user?.fullname} thành công`);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Có lỗi xảy ra khi xóa dữ liệu");
    }
  };

  const handleCallApiAddMoreResponsiblePerson = async () => {
    try {
      setLoadingSubmit(true);

      const dataBody: AddResponsiblePersonType = {
        is_change_responsible_info: isChangeResponsibleInfo,
        is_create_account: isCreateAccount,
        email_responsible_person:
          formAddResponsiblePerson.getFieldValue("email"),
        fullname: formAddResponsiblePerson.getFieldValue("fullname"),
        other_contact: "",
        phone_number: formAddResponsiblePerson.getFieldValue("phone_number"),
        position: formAddResponsiblePerson.getFieldValue("position"),
        projectId: selectedProject?.id,
        user_project_status:
          formAddResponsiblePerson.getFieldValue("user_project_status") ||
          "Responsible_Person_View",
      };

      console.log("dataBody:");

      const res = await dispatch(addMoreResponsiblePersonByAdmin(dataBody));

      console.log("res: ", res);
      if (addMoreResponsiblePersonByAdmin.fulfilled.match(res)) {
        setResponsiblePersonList((prevList: any[]) => [
          ...prevList,
          res.payload,
        ]);

        setDataTable((prevDataTable: any[]) =>
          prevDataTable.map((item) => {
            if (item.id === selectedProject?.id) {
              return {
                ...item,
                user_projects: [...item.user_projects, res.payload],
              };
            }
            return item;
          })
        );
        setIsAdding(false);
        formAddResponsiblePerson.resetFields();

        message.success(`Thêm người phụ trách thành công!`);
      } else {
        toast.error(`${res.payload}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Có lỗi xảy ra khi thêm người phụ trách");
    } finally {
      setShouldCallAddResponsiblePerson(false);
      setLoadingSubmit(false);
    }
  };

  const handleBeforeCallApiAddMorePerson = async () => {
    try {
      const values = await formAddResponsiblePerson.validateFields();

      const responsiblePersonInfo = {
        fullname: formAddResponsiblePerson.getFieldValue("fullname"),
        phone_number: formAddResponsiblePerson.getFieldValue("phone_number"),
        position: formAddResponsiblePerson.getFieldValue("position"),
        email_responsible_person:
          formAddResponsiblePerson.getFieldValue("email"),
      };
      setLoadingSubmit(true);

      //   0 là false còn -1 là chưa biết (chưa biết thì mở modal confirm)
      const createAccountCheck =
        formAddResponsiblePerson.getFieldValue("user_project_status") ===
          undefined ||
        formAddResponsiblePerson.getFieldValue("user_project_status") ===
          "Responsible_Person_View"
          ? 0
          : -1;

      const responsibleResponseCheck = await dispatch(
        checkResponsibleInfo(responsiblePersonInfo)
      ).unwrap();

      setResultDataCheck({
        responsible: responsibleResponseCheck,
      });

      switch (true) {
        case createAccountCheck === -1 && responsibleResponseCheck.length === 0:
          setResultCase(1);
          setOpenModalCheckConfirmCreate(true);
          break;
        case createAccountCheck === -1 && responsibleResponseCheck.length > 0:
          setResultCase(2);
          setOpenModalCheckConfirmCreate(true);
          setOpenModalConfirmChangeResponsibleInfo(true);
          break;
        case createAccountCheck === 0 && responsibleResponseCheck.length === 0:
          setResultCase(3);
          setShouldCallAddResponsiblePerson(true);
          break;
        case createAccountCheck === 0 && responsibleResponseCheck.length > 0:
          setResultCase(4);
          setOpenModalConfirmChangeResponsibleInfo(true);
          break;
        default:
          setResultCase(5);
          break;
      }
    } catch (error) {
      console.log("error check: ", error);
      message.error("Có lỗi xảy ra khi thêm người phụ trách");
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    if (shouldCallAddResponsiblePerson) {
      handleCallApiAddMoreResponsiblePerson();
    }
  }, [shouldCallAddResponsiblePerson]);

  return (
    <div>
      {responsiblePersonList.map((responsiblePerson: any, index: number) => (
        <div key={index}>
          <div className="flex flex-row items-center gap-3 mb-3">
            <h3 className=" font-bold">Người phụ trách {index + 1}</h3>
            <Button
              danger
              onClick={() => {
                confirm({
                  cancelText: "Quay lại",
                  okText: "Xác nhận",
                  title: `Bạn có chắc là muốn xóa người phụ trách này (${responsiblePerson?.user?.fullname}) ra khỏi dự án? `,
                  onOk: async () => {
                    await handleRemoveResponsiblePerson(responsiblePerson);
                  },
                  onCancel: () => {},
                });
              }}
            >
              <Trash className="h-3 w-3" /> Xóa
            </Button>
            {responsiblePerson?.user?.password === undefined ||
              (responsiblePerson?.user?.password === null && (
                <Button
                  className="flex flex-row"
                  onClick={() => {
                    confirm({
                      cancelText: "Quay lại",
                      okText: "Xác nhận",
                      title:
                        "Bạn có chắc là muốn kích hoạt tài khoản cho người này? ",
                      async onOk() {
                        try {
                          const dataBody: ProviderAccountType = {
                            email: responsiblePerson.user.email,
                            fullname: responsiblePerson.user.fullname,
                            roleName: "ResponsiblePerson",
                          };
                          const resProviderAccount = await dispatch(
                            providerAccount(dataBody)
                          );
                          console.log("res: ", resProviderAccount);
                          if (
                            providerAccount.fulfilled.match(resProviderAccount)
                          ) {
                            message.success("Kích hoạt tài khoản thành công");
                          }else {
                            toast.error(`${resProviderAccount.payload}`)
                          }
                        } catch (error) {
                          message.error("Có lỗi xảy ra");
                        }
                      },
                      onCancel() {},
                    });
                  }}
                >
                  <BiAddToQueue className="h-3 w-3" /> Kích hoạt tài khoản
                </Button>
              ))}
          </div>
          <div className="grid grid-cols-3 px-4 ">
            <Form.Item label="Họ và tên" className="mx-3">
              <Input
                disabled={!editMode}
                value={responsiblePerson?.user?.fullname}
              />
            </Form.Item>
            <Form.Item label="Địa chỉ email" className="mx-3">
              <Input
                disabled={!editMode}
                value={responsiblePerson?.user?.email}
              />
            </Form.Item>
            <Form.Item label="Số điện thoại" className="mx-3">
              <Input
                disabled={!editMode}
                value={responsiblePerson?.user?.phone_number}
              />
            </Form.Item>
            <Form.Item label="Chức vụ" className="mx-3">
              <Input
                disabled={!editMode}
                value={responsiblePerson?.user?.position}
              />
            </Form.Item>

            <Form.Item label="Phân quyền" className="mx-3">
              <Select
                disabled={!editMode}
                value={responsiblePerson?.user_project_status}
              >
                <Option value="Responsible_Person_View">Xem</Option>
                <Option value="Responsible_Person_Edit">Chỉnh sửa</Option>
              </Select>
            </Form.Item>
          </div>
        </div>
      ))}

      <Button
        icon={<BiPlus />}
        onClick={() => {
          setIsAdding((prev) => !prev);
          formAddResponsiblePerson.resetFields();
        }}
        className="mx-5 h-full ml-7"
        type="dashed"
      >
        Thêm người phụ trách
      </Button>

      {isAdding && (
        <>
          <Divider
            className=""
            style={{
              borderWidth: "medium",
              borderColor: "#EEEEEE",
            }}
          ></Divider>
          <h5 className="text-center">Thêm người phụ trách</h5>
          <Form form={formAddResponsiblePerson} layout="vertical">
            <div className="grid grid-cols-3 px-4">
              <Form.Item
                className="mx-3"
                name="fullname"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: `Vui lòng nhập họ và tên`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mx-3"
                name="email"
                label="Địa chỉ email"
                rules={[
                  {
                    required: true,
                    message: `Vui lòng nhập email`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mx-3"
                name="phone_number"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: `Vui lòng nhập số điện thoại`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mx-3"
                name="position"
                label="Chức vụ"
                rules={[
                  {
                    required: true,
                    message: `Vui lòng nhập số chức vụ`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                className="mx-3"
                name="user_project_status"
                label="Phân quyền"
              >
                <Select defaultValue={"Responsible_Person_View"}>
                  <Option value="Responsible_Person_View">Xem</Option>
                  <Option value="Responsible_Person_Edit">Chỉnh sửa</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item>
              <div className="flex justify-end gap-4 mr-3">
                {loadingSubmit && <SpinnerLoading />}
                <Button
                  onClick={() => {
                    setIsAdding(false);
                  }}
                  style={{ marginLeft: "8px" }}
                >
                  Hủy
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    confirm({
                      cancelText: "Quay lại",
                      okText: "Xác nhận",
                      title: "Bạn có chắc thêm người phụ trách này? ",
                      async onOk() {
                        await handleBeforeCallApiAddMorePerson();
                      },
                      onCancel() {},
                    });
                  }}
                >
                  Thêm
                </Button>
              </div>
            </Form.Item>
          </Form>
          <Divider
            className=""
            style={{
              borderWidth: "medium",
              borderColor: "#EEEEEE",
            }}
          ></Divider>
        </>
      )}
      {openModalCheckConfirmCreate && (
        <ModalCheckConfirmCreateResponsible
          open={openModalCheckConfirmCreate}
          onClose={() => {
            setOpenModalCheckConfirmCreate(false);
          }}
          resultCase={resultCase}
          setIsCreateAccount={setIsCreateAccount}
          setShouldCallAddResponsiblePerson={setShouldCallAddResponsiblePerson}
        />
      )}

      {openModalConfirmChangeResponsibleInfo && (
        <ModalConfirmUpdateResponsible
          open={openModalConfirmChangeResponsibleInfo}
          onClose={() => {
            setOpenModalConfirmChangeResponsibleInfo(false);
          }}
          data={resultDataCheck?.responsible}
          resultCase={resultCase}
          setIsChangeResponsibleInfo={setIsChangeResponsibleInfo}
          setShouldCallAddResponsiblePerson={setShouldCallAddResponsiblePerson}
        />
      )}
    </div>
  );
};

export default ResponsiblePersonForm;
