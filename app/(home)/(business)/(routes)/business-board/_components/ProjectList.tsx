import { AlertDialogCreateProject } from "@/components/alert-dialog/AlertDialogCreateProject";
import { DialogViewProject } from "@/components/alert-dialog/DialogViewProject";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React from "react";
import { IoHelpCircleOutline } from "react-icons/io5";

interface ProjectListProps {
  dataProjects: any[];
  setDataProjects: React.Dispatch<React.SetStateAction<any[]>>;
  loadingProject?: boolean;
  loadingProjectList?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  dataProjects,
  setDataProjects,
  loadingProject,
  loadingProjectList,
}) => {
  const getProjectNameByStatus = (status: string) => {
    switch (status) {
      case "Pending":
        return "Dự án đang chờ phê duyệt";
      case "Public":
        return "Dự án đang công khai";
      case "Processing":
        return "Dự án đang hoạt động";
      case "End":
        return "Dự án đã kết thúc";
      case "Done":
        return "Dự án đã hoàn thành";
      case "Expired":
        return "Dự án đã hết hạn";
      default:
        return "Tên dự án không xác định";
    }
  };

  const groupProjectsByStatus = () => {
    const groupedProjects: Record<string, any[]> = {};

    if (dataProjects && Array.isArray(dataProjects)) {
      dataProjects.forEach((project) => {
        const status = getProjectNameByStatus(project?.project_status);
        if (!groupedProjects[status]) {
          groupedProjects[status] = [];
        }
        groupedProjects[status].push(project);
      });
    } else {
      console.error("dataProjects is not an array or is undefined");
    }

    // console.log(groupedProjects);

    return groupedProjects;
  };

  const renderProjectsByStatus = () => {
    const groupedProjects = groupProjectsByStatus();

    const reversedGroupedProjects = Object.entries(groupedProjects).reverse();

    return reversedGroupedProjects.map(([status, projects]) => (
      <div key={status}>
        <div className="flex items-center font-semibold text-lg text-neutral-700 mb-4">
          <p className="">{status}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((project) =>
            project.project_status !== "Pending" ? (
              <Link
                key={project.id}
                href={`/project/${project.id}/view`}
                className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                style={{
                  backgroundImage: `url('https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg')`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                <p className="inline-flex w-full overflow-hidden relative font-semibold text-white">
                  {project.name_project}
                </p>
              </Link>
            ) : (
              <DialogViewProject project={project} key={project.id}>
                <div
                  role="button"
                  className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-start p-2
                  hover:opacity-50 transition"
                  style={{
                    backgroundColor: "rgb(229 231 235)",
                  }}
                >
                  <p className="inline-flex items-start text-base font-bold w-full overflow-hidden text-black">
                    {project.name_project}
                  </p>
                </div>
              </DialogViewProject>
            )
          )}
        </div>
      </div>
    ));
  };

  if (loadingProjectList) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full" />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <p className="uppercase">dự án của bạn</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AlertDialogCreateProject
          dataProjects={dataProjects}
          setDataProjects={setDataProjects}
        >
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center
                   transition"
            style={{ backgroundColor: "rgb(229 231 235)" }}
          >
            <p className="text-sm">Tạo dự án mới</p>

            <Hint
              sideOffset={40}
              description={`Bấm vào đây để khởi tạo dự án mới`}
              side={"top"}
            >
              <IoHelpCircleOutline className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </AlertDialogCreateProject>
      </div>

      {renderProjectsByStatus()}
    </div>
  );
};

export default ProjectList;
