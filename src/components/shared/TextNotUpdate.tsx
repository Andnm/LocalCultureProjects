import React from "react";

interface TextNotUpdateProps {
  data?: string;
}

const TextNotUpdate: React.FC<TextNotUpdateProps> = ({ data }) => {
  return data ? (
    <p >{data}</p>
  ) : (
    <p className="italic">(Chưa cập nhập)</p>
  );
};

export default TextNotUpdate;
