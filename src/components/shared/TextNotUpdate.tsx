import React from "react";

interface TextNotUpdateProps {
  data?: string;
}
const TextNotUpdate: React.FC<TextNotUpdateProps> = ({ data }) => {
  return (
    <p className={data && data !== "(Chưa cập nhập)" ? "" : "italic"}>
      {data && data !== "(Chưa cập nhập)" ? data : "(Chưa cập nhập)"}
    </p>
  );
};

export default TextNotUpdate;
