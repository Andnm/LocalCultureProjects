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
  {
    label: "Môn học",
    value: "subject_code",
    options: [
      { value: "MKT304", label: "MKT304" },
      { value: "CCO201", label: "CCO201" },
      { value: "MPL201", label: "MPL201" },
      { value: "BRA301", label: "BRA301" },
      { value: "MCO201m", label: "MCO201m" },
      { value: "MEP201", label: "MEP201" },
      { value: "GRA497", label: "GRA497" },
      { value: "CSP201m", label: "CSP201m" },
      { value: "MCO206m", label: "MCO206m" },
      { value: "PRE202", label: "PRE202" },
    ],
  },
];

export const FILTER_GROUP_BY_ADMIN = [
  {
    label: "Trạng thái group",
    value: "group_status",
    options: [
      { label: "Đang hoạt động", value: "Active" },
      { label: "Đang rãnh rỗi", value: "Free" },
    ],
  },
];
