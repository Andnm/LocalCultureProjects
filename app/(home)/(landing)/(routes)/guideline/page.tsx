"use client";

import React, { useEffect, useRef, useState } from "react";
import Footer from "@/src/components/landing/Footer";
import { CHOOSE_LIST_ROLE_GUIDELINE } from "@/src/constants/register";
import "./style.scss";

const Guideline = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const studentRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const lecturerRef = useRef<HTMLDivElement>(null);

  const handleSelectedRole = (value: any) => {
    setSelectedRole(value);
    switch (value) {
      case "Student":
        studentRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Business":
      case "ResponsiblePerson":
        businessRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "Lecturer":
        lecturerRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  const scrollToTop: any = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="container py-6">
        <h2 className="text-center font-bold text-3xl">
          Hướng dẫn sử dụng cho?
        </h2>

        <div className="choose-guideline-role-background">
          <div className="choose-guideline-role-container">
            <div className="list-role">
              {CHOOSE_LIST_ROLE_GUIDELINE.map((item, index) => (
                <div
                  className="card-item"
                  key={index}
                  onClick={() => handleSelectedRole(item.value)}
                >
                  <div className="card-item-image">
                    <img src={item.img} alt="img" />
                  </div>

                  <h6 className="card-item-role-name text-lg font-medium">
                    {item.roleName}
                  </h6>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={studentRef} className="py-8 px-36">
          <h2 className="text-center font-bold text-3xl mb-4">Sinh viên</h2>
          <div className="grid grid-cols-1 gap-8 items-start">
            <div>
              <h3 className="italic font-bold text-xl mb-3">1. Đăng ký tài khoản</h3>
              <h4 className="my-2 px-7">
                1.1 Chọn đăng nhập dưới dạng Sinh viên & nhập các thông tin tài
                khoản
              </h4>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53633365420_a8a4b3a9a7_k.jpg"
                  style={{
                    width: "600px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h4 className="my-2 px-7">
                1.2 Xác nhận đăng ký tài khoản thông qua email đã cung cấp
              </h4>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">
                2. Tạo nhóm & Chọn đề tài
              </h3>
              <h4 className="my-2 px-7">
                2.1 Nhóm trưởng: Tạo nhóm, mời thành viên thông qua Tab “Quản lý
                nhóm”
              </h4>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53632029527_34a48c0c32_k.jpg"
                  style={{
                    width: "600px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>

              <h4 className="my-2 px-7">
                2.2 Lựa chọn & đăng ký thực hiện dự án phù hợp với môn học & mời
                giảng viên hướng dẫn
              </h4>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">3. Thực hiện dự án</h3>
              <h4 className="my-2 px-7">
                3.1 Cập nhật tiến độ dự án định kỳ trên website
              </h4>
            

              <h4 className="my-2 px-7">
                3.2 Sau khi hoàn thành dự án, đăng tải báo cáo tổng kết lên
                website & nhận đánh giá từ Doanh nghiệp và GVHD
              </h4>
            </div>
          </div>
        </div>

        <div ref={businessRef} className="py-8 px-36">
          <h2 className="text-center font-bold text-3xl mb-4">Doanh nghiệp</h2>
          <div className="grid grid-cols-1 gap-8 items-start">
            <div>
              <h3 className="italic font-bold text-xl mb-3">
                1. Đăng ký tài khoản & Đăng tải đề bài
              </h3>
              <h4 className="my-2 px-7">Cách 1:</h4>
              <p className="my-2 px-10">
                - Chọn Đăng ký dưới dạng Doanh nghiệp & nhập thông tin tài khoản
              </p>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53633365420_a8a4b3a9a7_k.jpg"
                  style={{ width: "600px", height: "00px", objectFit: "cover" }}
                />
              </div>
              <p className="my-2 px-10">
                - Chọn Đăng ký dưới dạng Doanh nghiệp & nhập thông tin tài khoản
              </p>

              <h4 className="my-2 px-7">Cách 2:</h4>
              <p className="my-2 px-10">
                - Chọn Đăng tải đề bài & nhập thông tin đề bài, bao gồm email
                được dùng để xác nhận đăng ký tài khoản
              </p>
              <p className="my-2 px-10">
                - Xác nhận đăng ký tài khoản thông qua email đã cung cấp
              </p>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">
                2. Chọn nhóm sinh viên thực hiện dự án
              </h3>
              <h4 className="my-2 px-7">
                2.1 Xét duyệt nhóm sinh viên sẽ thực hiện dự án thông qua
                Portfolio/Proposal mà sinh viên đăng tải lên hệ thống và trao
                đổi với sinh viên thông qua tính năng Nhắn tin (nếu cần)
              </h4>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53633260624_5e86f16c0e_k.jpg"
                  style={{
                    width: "600px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">3. Quản lý dự án</h3>
              <h4 className="my-2 px-7">
                3.1 Theo dõi tiến độ dự án được nhóm sinh viên cập nhật định kỳ
                trên website. Doanh nghiệp có quyền yêu cầu dừng dự án trong
                trường hợp có sự thay đổi về định hướng truyền thông/nhóm sinh
                viên không đáp ứng được yêu cầu từ Doanh nghiệp (cần có sự trao
                đổi và thống nhất với GVHD và admin)
              </h4>

              <h4 className="my-2 px-7">
                3.2 Đánh giá kết quả thực hiện dự án của sinh viên thông qua báo
                cáo tổng kết dự án của nhóm sinh viên
              </h4>
            </div>
          </div>
        </div>

        <div ref={lecturerRef} className="py-8 px-36">
          <h2 className="text-center font-bold text-3xl mb-4">Giảng viên</h2>

          <div className="grid grid-cols-1 gap-8 items-start">
            <div>
              <h3 className="italic font-bold text-xl mb-3">1. Đăng nhập </h3>
              <h4 className="my-2 px-7">1.1 Đăng nhập bằng email FE</h4>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">2. Quản lý nhóm</h3>
              <h4 className="my-2 px-7">
                2.1 Nhận lời mời tham gia nhóm của sinh viên
              </h4>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53633132628_a9efd1fe3d_k.jpg"
                  style={{
                    width: "600px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className="h-4"></div>
              <div className="w-full mx-auto flex justify-center">
                <img
                  src="https://live.staticflickr.com/65535/53632919071_c87d23392c_k.jpg"
                  style={{
                    width: "600px",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            <div>
              <h3 className="italic font-bold text-xl mb-3">3. Quản lý dự án</h3>
              <h4 className="my-2 px-7">
                3.1 Theo dõi độ dự án được nhóm sinh viên cập nhật định kỳ trên
                website
              </h4>

              <h4 className="my-2 px-7">
                3.2 Đánh giá và chấm điểm báo cáo tổng kết dự án của sinh viên
                sau khi hoàn thành dự án
              </h4>
            </div>
          </div>
        </div>
      </div>

      {showScrollButton && (
        <button onClick={scrollToTop} className="scroll-to-top-btn">
          <span>↑</span>
        </button>
      )}

      <Footer />
    </>
  );
};

export default Guideline;
