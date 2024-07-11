import React, { useRef, useState } from "react";
import {
  Avatar,
  Descriptions,
  Divider,
  Dropdown,
  Image,
  Modal,
  Rate,
  Menu,
  MenuProps,
} from "antd";
import { Form } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TextNotUpdate from "@/src/components/shared/TextNotUpdate";
import { changeStatusFromEnToVn, formatDate } from "@/src/utils/handleFunction";
import { Table } from "antd";
import type { TableProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { BiCheck, BiDetail } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import StatusCell from "../../manage-project/_components/StatusCell";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/src/redux/store";
import { kickMemberByAdmin } from "@/src/redux/features/groupSlice";
import SpinnerLoading from "@/src/components/loading/SpinnerLoading";

const { confirm } = Modal;
const { Column } = Table;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  dataGroup: any;
  setSelectedGroup: React.Dispatch<React.SetStateAction<any[]>>;
  setDataTable: React.Dispatch<React.SetStateAction<any[]>>;
  dataTable: any;
}

export const items: MenuProps["items"] = [
  {
    key: "1",
    danger: true,
    label: <p className="text-red-600">Xoá khỏi nhóm</p>,
    icon: <MdOutlineCancel className="text-red-600" />,
  },
];

const ModalGroupDetail: React.FC<Props> = (props) => {
  const { onSubmit, open, onClose, dataGroup, setDataTable, dataTable } = props;
  const dispatch = useAppDispatch();

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const formRef = useRef(null);
  const [form] = Form.useForm();

  const [selectedMember, setSelectedMember] = useState<any>();

  const createMenu = (record: any) => {
    return (
      <Menu onClick={({ key }) => handleMenuClick(key, record)}>
        {items?.map((item: any) => (
          <Menu.Item key={item?.key} icon={item?.icon}>
            {item?.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const handleMenuClick = async (key: string, record: any) => {
    setSelectedMember(record);
    switch (key) {
      case "1":
        confirm({
          cancelText: "Hủy",
          okText: "Xác nhận",

          title: "Bạn có chắc là muốn cho người này ra khỏi nhóm?",
          async onOk() {
            setLoadingSubmit(true);
            dispatch(
              kickMemberByAdmin({
                userId: record?.user?.id,
                groupId: dataGroup?.id,
              })
            )
              .then((res) => {
                if (kickMemberByAdmin.fulfilled.match(res.payload)) {
                  toast.success("Xoá thành viên thành công!");

                  const filteredMembers = dataGroup.members.filter(
                    (member: any) => member.user.id !== record.user.id
                  );

                  dataGroup.members = filteredMembers;
                  setDataTable([...dataGroup]);
                } else {
                  // console.log("error:", res.payload);
                  toast.error(`${res.payload}`);
                }
              })
              .finally(() => {
                setLoadingSubmit(false);
              });
          },
          onCancel() {},
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Modal
        width={1200}
        title={<span className="inline-block m-auto">Thông tin chi tiết</span>}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        footer={false}
      >
        <div className="">
          <h3 className="font-bold">Tên nhóm: {dataGroup?.group_name}</h3>
          <p className="">Thời gian tạo: {formatDate(dataGroup?.createdAt)}</p>
          <div className="mt-4">
            <Table dataSource={dataGroup?.members}>
              <Column
                title="Thành viên"
                dataIndex="user"
                key="member"
                render={(text, record: any) => (
                  <div className="flex items-center gap-3">
                    <Avatar src={`${record?.user?.avatar_url}`} size="large">
                      {record?.user?.email?.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-normal">{record?.user?.fullname}</p>

                      <p className="opacity-70">{record?.user?.email}</p>
                    </div>
                  </div>
                )}
                fixed="left"
              />
              <Column
                title="Tình trạng tham gia"
                dataIndex="relationship_status"
                key="relationship_status"
                render={(text, record: any) => (
                  <StatusCell status={record?.relationship_status} />
                )}
              />
              <Column
                title="Vai trò trong nhóm"
                dataIndex="role_in_group"
                key="role_in_group"
                render={(text, record: any) => (
                  <p>{changeStatusFromEnToVn(record?.role_in_group)}</p>
                )}
              />
              <Column
                title="Thời gian tham gia"
                dataIndex="createdAt"
                key="createdAt"
                render={(text, record: any) => (
                  <p>{formatDate(record?.createdAt)}</p>
                )}
              />

              <Column
                title="Hành động"
                dataIndex=""
                key="action"
                render={(text, record: any) => (
                  <>
                    <Dropdown overlay={createMenu(record)} trigger={["click"]}>
                      <a onClick={(e) => e.preventDefault()}>
                        <EllipsisOutlined style={{ fontSize: "20px" }} />
                      </a>
                    </Dropdown>
                  </>
                )}
                align="center"
              />
            </Table>
          </div>
        </div>

        {loadingSubmit && <SpinnerLoading />}
      </Modal>
    </>
  );
};

export default ModalGroupDetail;
