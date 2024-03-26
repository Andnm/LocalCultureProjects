"use client";

const LandingError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src="/something_wrong.svg" alt="Error" className="w-80 h-auto mb-2" />
      <p className="text-red-500 font-semibold">
        Đã có lỗi xảy ra. Vui lòng thử lại sau!
      </p>
    </div>
  );
};

export default LandingError;
