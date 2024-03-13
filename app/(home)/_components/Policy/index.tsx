import Link from "next/link";
import React from "react";

const index = () => {
  const navLinks = [
    {
      display: "Cam kết phê duyệt",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-verify-listing.svg",
    },
    {
      display: "Dẫn đầu số lượng",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-many-listing.svg",
    },
    {
      display: "Hỗ trợ nhiệt tình",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-save-money.svg",
    },
    {
      display: "Nhiều điều bất ngờ",
      src: "https://s3-cdn.rever.vn/p/v2.48.39/images/icon-save-money-star.svg",
    },
  ];

  return (
    <div className="policy-section pt-5">
      <div className="grid grid-cols-4 gap-4">
        {navLinks.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <img src={item.src} alt="img" />
            <p className="text-center font-semibold mt-3">{item.display}</p>
          </div>
        ))}
      </div>

      <div className="my-7 flex justify-center">
        <Link
          className="bg-blue-white border border-gray-500 hover:bg-gray-700 text-black hover:text-white 
        font-bold py-2 px-4 rounded cursor-pointer w-fit"
          href="/about-us"
        >
          Tìm hiểu thêm
        </Link>
      </div>
    </div>
  );
};

export default index;
