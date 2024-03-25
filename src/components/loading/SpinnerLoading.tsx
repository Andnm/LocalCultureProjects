import React from "react";
import "@/src/styles/spinner-loading.scss";

const SpinnerLoading = () => {
  return (
    <div
      className="fixed flex items-center justify-center"
      style={{
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SpinnerLoading;
