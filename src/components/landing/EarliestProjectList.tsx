import { getAllProjectByEveryOne } from "@/src/redux/features/projectSlice";
import { useAppDispatch, useAppSelector } from "@/src/redux/store";
import { formatDate } from "@/src/utils/handleFunction";
import { socketInstance } from "@/src/utils/socket/socket-provider";
import React from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EarliestProjectList = () => {
  const [dataProjectList, setDataProjectList] = React.useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [isLoadingProjectList, setIsLoadingProjectList] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoadingProjectList(true)
    dispatch(getAllProjectByEveryOne()).then((result) => {
      if (getAllProjectByEveryOne.fulfilled.match(result)) {
        socketInstance.on("getProjects", (data: any) => {
          const newListProjects = data?.projects
            ?.filter((project: any) => {
              const expirationDate = new Date(
                project.project_registration_expired_date
              );
              const currentDate = new Date();
              return expirationDate > currentDate;
            })
            ?.sort((a: any, b: any) => {
              const dateA = new Date(a.project_start_date);
              const dateB = new Date(b.project_start_date);
              return dateA.getTime() - dateB.getTime();
            })
            ?.slice(0, 4);
          setDataProjectList(newListProjects);
        });
      } else {
        toast.error("Có lỗi xảy ra khi tải danh sách dự án!");
      }
      setIsLoadingProjectList(false)
    });
  }, []);

  return (
    <div style={{ margin: "auto 0" }}>
      <div
        className="mb-5 mt-5"
        style={{ fontSize: "20px", fontWeight: "bold" }}
      >
        Một số dự án mới nhất
      </div>

      <div className="grid grid-cols-3 gap-2">
        {isLoadingProjectList ? (
          <>
            <div className="w-auto h-32 shrink-0">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-auto h-32 shrink-0 ">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="w-auto h-32 shrink-0 ">
              <Skeleton className="h-full w-full" />
            </div>
          </>
        ) : (
          Array.isArray(dataProjectList) &&
          dataProjectList?.slice(0, 3)?.map((project, index) => (
            <Link
              href={`/project-list/detail/${project.id}`}
              className="flex flex-row py-4 px-4 border-2 gap-2"
              style={{ borderRadius: "10px" }}
              key={index}
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-gray-200">
                <img
                  src={project?.business?.avatar_url}
                  alt={project?.business?.fullname}
                  className="h-full w-full object-cover object-center rounded-full"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex flex-col overflow-hidden justify-between text-base font-medium text-gray-900">
                    <h3 className="overflow-hidden">{project?.name_project}</h3>
                    <p className="text-sm text-gray-400 italic">
                      {project?.specialized_field}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{""}</p>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">
                    Ngày hết hạn đăng kí:{" "}
                    {formatDate(project?.project_registration_expired_date)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="my-7 flex justify-center">
        <Link
          className="bg-blue-white border border-gray-500 hover:bg-gray-700 text-black hover:text-white 
        font-bold py-2 px-4 rounded cursor-pointer w-fit"
          href="/project-list"
        >
          Hiển thị thêm
        </Link>
      </div>
    </div>
  );
};

export default EarliestProjectList;
