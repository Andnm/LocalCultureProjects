import React from "react";
import { ProjectType } from "@/src/types/project.type";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineGridView } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserLogin } from "@/src/hook/useUserLogin";
import { useAppDispatch } from "@/src/redux/store";
import { getAllRegisterPitchingByBusiness } from "@/src/redux/features/pitchingSlice";

interface BoardTitleFormProps {
  dataProject?: ProjectType;
}

const ViewSidebar = ({ dataProject }: BoardTitleFormProps) => {
  const [userLogin, setUserLogin] = useUserLogin();
  const [dataGroupPitching, setDataGroupPitching] = React.useState<any>([]);

  const router = useRouter();
  const pathName = usePathname();
  const dispatch = useAppDispatch();

  //xử lý để cắt đường dẫn navigate cho đúng
  const thirdSlashIndex = pathName.indexOf("/", pathName.indexOf("/") + 1);
  const fourthSlashIndex =
    thirdSlashIndex !== -1 ? pathName.indexOf("/", thirdSlashIndex + 1) : -1;
  const currentPath =
    fourthSlashIndex !== -1
      ? pathName.substring(0, fourthSlashIndex + 1)
      : pathName;

  const isStudent = userLogin?.role_name === "Student";

  const initialRoutesInProject = [
    {
      label: "Công việc",
      icon: <MdOutlineGridView className="w-5 h-5" />,
      href: `${currentPath}view`,
    },
    {
      label: "Nhóm đăng kí Pitching",
      icon: <HiOutlineUserGroup className="w-5 h-5" />,
      href: `${currentPath}group`,
    },
    {
      label: "Tin nhắn",
      icon: <IoChatboxEllipsesOutline className="w-5 h-5" />,
      href: `${currentPath}chat`,
    },
    {
      label: "Thông tin dự án",
      icon: <IoSettingsOutline className="w-5 h-5" />,
      href: `${currentPath}setting`,
    },
  ];

  const routesInProject = isStudent
    ? initialRoutesInProject.filter((route) => route.label !== "Nhóm")
    : initialRoutesInProject;

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="flex flex-col ">
      <p className="w-64 h-14 bg-black/50 top-17 flex items-center justify-start font-bold text-lg text-white overflow-hidden">
        <span className="inline-block px-10 max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {dataProject?.name_project}
        </span>
      </p>

      <div className="flex flex-col">
        {routesInProject.map((route, index) => (
          <Button
            size="sm"
            onClick={() => handleNavigate(route.href)}
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md",
              pathName.includes(route.href) && "bg-sky-100 text-sky-700"
            )}
            variant="ghost"
            key={index}
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ViewSidebar;
