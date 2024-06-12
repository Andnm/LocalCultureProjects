"use client";

import React from "react";
import ScrollGuide from "@/src/components/landing/ScrollGuide";
import { IoIosSearch } from "react-icons/io";
import { MdFilterList } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { getAllProjectByEveryOne } from "@/src/redux/features/projectSlice";
import { formatDate, generateFallbackAvatar } from "@/src/utils/handleFunction";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import DrawerFilter from "@/components/drawer/DrawerFilter";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useRouter } from "next/navigation";
import CustomModal from "@/src/components/shared/CustomModal";

//có 2 trang là ProjectList lận
//trang này là show all project list ở ngoài landing page
//còn trang kia là show all project list của business
const ProjectList = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [dataProjectList, setDataProjectList] = React.useState<any[]>([]);
  const [isOpenModalWarningLogin, setIsOpenModalWarningLogin] =
    React.useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [userLogin, setUserLogin] = useUserLogin();
  const { loadingProjectList } = useAppSelector((state) => state.project);

  const handleProjectClick = (project_id: any) => {
    if (!userLogin) {
      setIsOpenModalWarningLogin(true);
    } else {
      router.push(`/project-list/detail/${project_id}`);
    }
  };

  const [filterOption, setFilterOption] = React.useState<any>({
    business_type: [],
    business_sector: [],
    searchValue: "",
  });

  React.useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        const delta = event.deltaY || event.detail || (event as any).wheelDelta;
        container.scrollLeft += delta;
      };

      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  // React.useEffect(() => {
  //   dispatch(getAllProjectByEveryOne()).then((result) => {
  //     if (getAllProjectByEveryOne.fulfilled.match(result)) {
  //       console.log("result", result.payload);
  //       // getProjects
  //       const newListProjects = result.payload[1]?.sort((a: any, b: any) => {
  //         const dateA = new Date(a.createdAt);
  //         const dateB = new Date(b.createdAt);
  //         return dateA.getTime() - dateB.getTime();
  //       });
  //       setDataProjectList(newListProjects);

  //       socketInstance.on("getProjects", (data: any) => {
  //         console.log("data socket", data);
  //         const newListProjects = data?.projects?.sort((a: any, b: any) => {
  //           const dateA = new Date(a.createdAt);
  //           const dateB = new Date(b.createdAt);
  //           return dateA.getTime() - dateB.getTime();
  //         });
  //         setDataProjectList(newListProjects);
  //       });
  //     } else {
  //       toast.error("Có lỗi xảy ra khi tải danh sách dự án!");
  //     }
  //   });
  // }, []);

  React.useEffect(() => {
    dispatch(getAllProjectByEveryOne()).then((result) => {
      if (getAllProjectByEveryOne.fulfilled.match(result)) {
        console.log("result", result.payload);
        // getProjects
        const newListProjects = result.payload[1]?.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        setDataProjectList(newListProjects);

        socketInstance.on("getProjects", (data: any) => {
          // console.log("data socket", data);
          if (data && data.projects) {
            const newListProjects = data.projects.sort((a: any, b: any) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });
            setDataProjectList(newListProjects);
          } else {
            console.log("No projects data or error occurred from socket");
            if (newListProjects) {
              setDataProjectList(newListProjects);
            }
          }
        });
      } else {
        toast.error("Có lỗi xảy ra khi tải danh sách dự án!");
      }
    });
  }, []);

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const openDrawerAction = () => setOpenDrawer(true);
  const closeDrawerAction = () => setOpenDrawer(false);

  const handleFilter = (array: any) => {
    let fiteredArray = array;
    if (
      filterOption?.business_model &&
      filterOption?.business_model?.length > 0
    ) {
      fiteredArray = fiteredArray?.filter((item: any) =>
        filterOption?.business_model?.includes(
          item?.business_model?.toLowerCase()
        )
      );
    }
    if (
      filterOption?.business_type &&
      filterOption?.business_type?.length > 0
    ) {
      fiteredArray = fiteredArray?.filter((item: any) =>
        filterOption?.business_type?.includes(
          item?.business_type?.toLowerCase()
        )
      );
    }
    if (
      filterOption?.specialized_field &&
      filterOption?.specialized_field?.length > 0
    ) {
      fiteredArray = fiteredArray?.filter((item: any) =>
        filterOption?.specialized_field?.includes(
          item?.specialized_field?.toLowerCase()
        )
      );
    }
    if (filterOption.searchValue) {
      fiteredArray = fiteredArray.filter((item: any) =>
        item.name_project
          .toLowerCase()
          .includes(filterOption.searchValue.toLowerCase())
      );
    }
    return fiteredArray;
  };

  return (
    <>
      <div className="my-1 flex gap-2 justify-end mr-10">
        <div className="relative flex items-center border-b-2 border-gray-500 w-56 h-10 bg-white overflow-hidden">
          <div className="grid place-items-center h-full w-12 text-gray-300">
            <IoIosSearch />
          </div>

          <input
            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
            type="text"
            id="search"
            placeholder="Gõ thứ gì đó ..."
            value={filterOption.searchValue}
            onChange={(e) =>
              setFilterOption((prevFilterOption: any) => ({
                ...prevFilterOption,
                searchValue: e.target.value,
              }))
            }
          />
        </div>

        <Button
          className="gap-2 border-2"
          onClick={openDrawerAction}
          style={{ borderRadius: 15 }}
        >
          <MdFilterList className="w-5 h-5" />
          Bộ lọc
        </Button>

        {openDrawer && (
          <DrawerFilter
            openDrawer={openDrawer}
            closeDrawerAction={closeDrawerAction}
            filterOption={filterOption}
            setFilterOption={setFilterOption}
          />
        )}
      </div>

      <main
        className="flex-1 overflow-x-hidden overflow-y-hidden"
        ref={containerRef}
      >
        <div className="flex" style={{ height: "calc(100vh - 140px)" }}>
          <div
            className="text-center max-w-xs flex items-center px-5"
            style={{ height: "80%" }}
          >
            <p className="text-2xl font-bold text-black-500">
              Tìm kiếm dự án phù hợp với bạn tại đây
            </p>
          </div>

          <div className="flex flex-wrap flex-col ml-10 pt-3">
            {loadingProjectList ? (
              <>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
                <div className="w-80 h-36 relative shrink-0 mb-4 ml-4">
                  <Skeleton className="h-full w-full absolute" />
                </div>
              </>
            ) : Array.isArray(dataProjectList) && dataProjectList.length > 0 ? (
              handleFilter(dataProjectList)?.map((project: any, index: any) => (
                <div
                  onClick={() => handleProjectClick(project.id)}
                  className="flex flex-row py-4 px-4 mb-4 mr-4 border-2 gap-2 cursor-pointer"
                  key={index}
                  style={{ borderRadius: "10px", width: 500, height: 148 }}
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                    <img
                      src={
                        project?.business?.avatar_url
                          ? project?.business?.avatar_url
                          : generateFallbackAvatar(project?.business?.fullname)
                      }
                      alt={project?.business?.email}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <h3 className="overflow-hidden font-semibold">
                      {project?.name_project}
                    </h3>
                    <p className="overflow-hidden text-sm text-gray-400 ">
                      Doanh nghiệp: {project?.business?.fullname}
                    </p>
                    <p className="text-gray-500">
                      Thời gian diễn ra: {project?.project_implement_time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="text-gray-500 flex justify-center items-center text-xl"
                style={{ height: "80%" }}
              >
                Hiện tại chưa có dự án nào được đăng!
              </div>
            )}
          </div>
        </div>
      </main>

      {isOpenModalWarningLogin && (
        <CustomModal
          open={isOpenModalWarningLogin}
          title={<h2 className="text-2xl font-semibold">Cảnh báo đăng nhập</h2>}
          body={`Vui lòng đăng nhập trước khi xem thông tin chi tiết dự án`}
          actionClose={() => setIsOpenModalWarningLogin(false)}
          actionConfirm={() => setIsOpenModalWarningLogin(false)}
          buttonConfirm={"Xác nhận"}
          styleWidth={"max-w-xl"}
          status={"Pending"}
        />
      )}
      <ScrollGuide containerRef={containerRef} />
    </>
  );
};

export default ProjectList;
