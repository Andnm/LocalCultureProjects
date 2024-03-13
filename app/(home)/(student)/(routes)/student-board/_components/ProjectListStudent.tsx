import { DialogViewProject } from "@/components/alert-dialog/DialogViewProject";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import React from "react";

interface PitchingProjectListProps {
  dataPitching: any[];
  setDataPitching: React.Dispatch<React.SetStateAction<any[]>>;
  loadingPitching?: boolean;
}

const ProjectListStudent: React.FC<PitchingProjectListProps> = ({
  dataPitching,
  setDataPitching,
  loadingPitching,
}) => {
  const getProjectNameByStatusOfStudent = (status: string) => {
    switch (status) {
      case "Pending":
        return "Dự án đang chờ doanh nghiệp phê duyệt";
      case "Selected":
        return "Dự án đã được doanh nghiệp chọn";
      case "Rejected":
        return "Dự án đã bị doanh nghiệp từ chối";
      default:
        return "Tên dự án không xác định";
    }
  };

  const groupProjectsByStatus = () => {
    const groupedProjects: Record<string, any[]> = {};

    dataPitching.forEach((pitching) => {
      const status = getProjectNameByStatusOfStudent(pitching.register_pitching_status);
      if (!groupedProjects[status]) {
        groupedProjects[status] = [];
      }
      groupedProjects[status].push(pitching);
    });

    return groupedProjects;
  };

  const renderProjectsByStatus = () => {
    const groupedProjects = groupProjectsByStatus();

    if (!dataPitching || dataPitching.length === 0) {
      return (
        <div className="text-center text-lg text-neutral-700">
          Bạn chưa tham gia dự án nào cả.
        </div>
      );
    }

    return Object.entries(groupedProjects).map(([status, pitchings]) => (
      <div key={status}>
        <div className="flex items-center font-semibold text-lg text-neutral-700 mb-4">
          <p className="">{status}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pitchings.map((pitching) =>
            pitching.register_pitching_status === "Selected" ? (
              <Link
                key={pitching.id}
                href={`/project/${pitching.project.id}/view`}
                className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
                style={{
                  backgroundImage: `url('https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg')`,
                }}
              >
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                <p className="inline-flex w-full overflow-hidden relative font-semibold text-white">
                  {pitching.project.name_project}
                </p>
              </Link>
            ) : (
              <Link
              key={pitching.id}
              href={`/project/${pitching.project.id}/chat`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{
                backgroundImage: `url('https://ss-images.saostar.vn/2020/02/15/6994345/7campusdhfpttphcm.jpg')`,
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="inline-flex w-full overflow-hidden relative font-semibold text-white">
                {pitching.project.name_project}
              </p>
            </Link>
            )
          )}
        </div>
      </div>
    ));
  };

  if (loadingPitching) {
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
    <div>
      <div className="space-y-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700">
          <p className="uppercase">Danh sách dự án</p>
        </div>
        {renderProjectsByStatus()}
      </div>
    </div>
  );
};

export default ProjectListStudent;
