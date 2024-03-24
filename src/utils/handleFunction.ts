import * as moment from "moment-timezone";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validatePassword = (password: string) => {
  return String(password).match(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,}$/
  );
};

export const getDateTimeDifference = (utcTimeString: string): string => {
  const currentUtcTime = moment.utc();

  const targetUtcTime = moment.utc(utcTimeString);

  const duration = moment.duration(targetUtcTime.diff(currentUtcTime));

  const absoluteDuration = Math.abs(duration.asSeconds());

  if (absoluteDuration < 60) {
    return `${Math.round(absoluteDuration)} giây`;
  } else if (absoluteDuration < 3600) {
    return `${Math.round(absoluteDuration / 60)} phút`;
  } else if (absoluteDuration < 86400) {
    return `${Math.round(absoluteDuration / 3600)} giờ`;
  } else if (absoluteDuration < 604800) {
    return `${Math.round(absoluteDuration / 86400)} ngày`;
  } else if (absoluteDuration < 2419200) {
    return `${Math.round(absoluteDuration / 604800)} tuần`;
  } else if (absoluteDuration < 29030400) {
    return `${Math.round(absoluteDuration / 2419200)} tháng`;
  } else {
    return `${Math.round(absoluteDuration / 29030400)} năm`;
  }
};

export const convertTimestampToDate = (
  seconds: number,
  nanoseconds: number
) => {
  if (!seconds || !nanoseconds) {
    return "N/A";
  }

  const date = new Date(seconds * 1000 + nanoseconds / 1000000);

  return date?.toISOString();
};

export const formatDate = (inputDate: string | undefined) => {
  if (!inputDate) {
    return "N/A";
  }

  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getColorByProjectStatus = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-blue-200 text-blue-900";
    case "Public":
      return "bg-violet-200 text-violet-900";
    case "Active":
    case "Processing":
      return "bg-yellow-200 text-yellow-900";
    case "Done":
    case "Active":
      return "bg-green-200 text-green-900";
    case "Expired":
      return "bg-red-200 text-red-900";
    case "End":
    case "Inactive":
      return "bg-gray-200 text-gray-900";
    case "Rejected":
      return "bg-red-200 text-red-900";
    default:
      return "bg-green-200 text-green-900";
  }
};

export const formatCurrency = (amount?: number | null): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "(Chưa cập nhập)";
  }

  const formattedAmount = amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedAmount;
};

export const formatNumberWithCommas = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const convertCommaStringToNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, ""));
};

export const changeStatusFromEnToVn = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "not transferred":
      return "Chưa chuyển";
    case "transferred":
      return "Đã chuyển";
    case "received":
      return "Đã nhận";
    case "processing":
      return "Đang hoạt động";
    case "warning":
      return "Đang bị cảnh báo";
    case "done":
      return "Đã xong";
    case "public":
      return "Đang công khai";
    case "todo":
      return "cần được làm";
    case "doing":
      return "đang làm";
    case "joined":
      return "Đang tham gia";
    case "member":
      return "Thành viên";
    case "leader":
      return "Trưởng nhóm";
    case "lecturer":
      return "Giảng viên";
    case "pending":
      return "Đang chờ";
    case "selected":
      return "Đã được chọn";
    default:
      return "Trạng thái không xác định";
  }
};

export const changeStatusPitchingFromEnToVn = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Đang chờ phê duyệt";
    case "rejected":
      return "Đã bị từ chối";
    case "selected":
      return "Đã được chọn";
    default:
      return "Không xác định";
  }
};

export const generateFileNameImage = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const fileName = `image_${hours}${minutes}${seconds}_${day}${month}${year}`;
  return fileName;
};

export const truncateString = (input: string, maxLength: number): string => {
  if (input?.length > maxLength) {
    return `${input?.substring(0, maxLength)}...`;
  }
  return input;
};

export const generateFallbackAvatar = (
  fullname: string | undefined
): string => {
  const fallbackColor = "#FF9966";
  const initials = fullname?.charAt(0).toUpperCase() || "";
  const svgString = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
    <rect width="100%" height="100%" fill="${fallbackColor}" />
    <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="50">
      ${initials}
    </text>
  </svg>
`;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  return dataUrl;
};

interface StatusInfo {
  color: string;
  text: string;
}

export const getRelationshipStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case "Pending":
      return { color: "purple", text: "Đang chờ xét duyệt" };
    case "Joined":
      return { color: "green", text: "Đã tham gia" };
    case "Outed":
      return { color: "gray", text: "Đã rời nhóm" };
    case "Rejected":
      return { color: "red", text: "Từ chối lời mời" };
    default:
      return { color: "black", text: "Trạng thái không xác định" };
  }
};

export const extractNumberAtIndex = (
  str: string,
  index: number
): number | null => {
  const parts = str.split("-");
  const targetPart = parts[index - 1];

  if (targetPart === undefined) {
    return null;
  }

  const targetNumber = parseInt(targetPart.trim(), 10);

  if (isNaN(targetNumber)) {
    return null;
  }

  return targetNumber;
};

export const extractLastName = (fullName: string): string => {
  const nameArray: string[] = fullName.split(" ");

  const lastName: string = nameArray[0];

  return lastName;
};

export const sortData = (
  column: string,
  direction: "asc" | "desc",
  dataTable: any[],
  setDataTable: any
) => {
  const sortedData = [...dataTable];

  sortedData.sort((a, b) => {
    let valueA = a[column];

    let valueB = b[column];

    switch (column) {
      case "role_name":
        valueA = a.role?.role_name || "";
        valueB = b.role?.role_name || "";
        break;
      case "business.fullname":
        valueA = a.business?.fullname || "";
        valueB = b.business?.fullname || "";
      case "responsible_person.fullname":
        valueA = a.responsible_person?.fullname || "";
        valueB = b.responsible_person?.fullname || "";
      default:
        valueA = a[column];
        valueB = b[column];
    }

    if (direction === "asc") {
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    } else {
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    }
  });

  setDataTable(sortedData);
};

export const handleLowerCaseNonAccentVietnamese = (str: string) => {
  str = str.toLowerCase();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};
