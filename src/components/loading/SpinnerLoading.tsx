import React from "react";
import "@/src/styles/spinner-loading.scss";

const SpinnerLoading = () => {
  return (
    <>
      <div className="blur-bg-overlay-loading"></div>

      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default SpinnerLoading;
