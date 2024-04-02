export const FILTER_ACCOUNT_BY_ADMIN = [
  {
    label: "Vai trò",
    value: "role_name",
    options: [
      { label: "Student", value: "Student" },
      { label: "Business", value: "Business" },
      { label: "Other", value: "Other" },
    ],
  },
  {
    label: "Trạng thái",
    value: "status",
    options: [
      { label: "Active", value: "Active" },
      { label: "Inactive", value: "Inactive" },
    ],
  },
];

export const FILTER_GROUP_BY_LECTURER = [
  {
    label: "Trạng thái dự án",
    value: "register_pitching_status",
    options: [
      { label: "Đã được chọn", value: "Selected" },
      { label: "Đã bị từ chối", value: "Rejected" },
      { label: "Đang chờ xác nhận", value: "Pending" },
    ],
  },
  {
    label: "Trạng thái tham gia nhóm",
    value: "relationship_status",
    options: [
      { label: "Đã tham gia", value: "Joined" },
      { label: "Đã từ chối", value: "Rejected" },
      { label: "Đang chờ xét duyệt", value: "Pending" },
    ],
  },
]

export const FILTER_GROUP_BY_ADMIN = [
  {
    label: "Trạng thái group",
    value: "group_status",
    options: [
      { label: "Đang hoạt động", value: "Active" },
      { label: "Đang rãnh rỗi", value: "Free" },
    ],
  },
  
]