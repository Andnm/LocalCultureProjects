'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const LecturerLayout = (props: { children: React.ReactNode }) => {
  const pathName: any = usePathname();

  return (
    <>
      <nav className=" border-gray-200 py-1 bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
          <div
            className="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <Link
                href="/lecturer-board"
                className={`cursor-pointer block py-2 px-7 ${
                  pathName === "/lecturer-board"
                    ? "text-white bg-blue-400 rounded"
                    : "text-gray-500 rounded hover:bg-blue-400 hover:text-white transition"
                }`}
              >
                Nhóm
              </Link>

              <Link
                href="/lecturer-board/project"
                className={`cursor-pointer block py-2 px-7 ${
                  pathName === "/lecturer-board/project"
                    ? "text-white bg-blue-400 rounded"
                    : "text-gray-500 rounded hover:bg-blue-400 hover:text-white transition"
                }`}
              >
                Dự án
              </Link>
            </ul>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl px-6 mt-4 mx-auto">{props.children}</div>
    </>
  );
};

export default LecturerLayout;
