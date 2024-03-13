"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { GoProjectRoadmap } from "react-icons/go";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoChatboxEllipsesOutline, IoSettingsOutline } from "react-icons/io5";
import { LuHistory } from "react-icons/lu";
import { MdOutlineAnalytics, MdOutlineGridView } from "react-icons/md";

interface SidebarProps {
  dataPitching: any[];
  setDataPitching: React.Dispatch<React.SetStateAction<any[]>>;
  loadingPitching?: boolean;
}

const StudentSidebar: React.FC<SidebarProps> = ({
  dataPitching,
  setDataPitching,
  loadingPitching,
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const navItem = [
    {
      label: "Quản lý dự án",
      icon: <MdOutlineAnalytics className="w-5 h-5" />,
      href: "/student-board",
    },
    {
      label: "Lịch sử hoạt động",
      icon: <LuHistory className="w-5 h-5" />,
      href: "/student-board/#",
    },
    {
      label: "Dự án mẫu",
      icon: <GoProjectRoadmap className="w-5 h-5" />,
      href: "/student-board/#",
    },
  ];

  const routesInProject = [
    {
      label: "Công việc",
      icon: <MdOutlineGridView className="w-5 h-5" />,
      href: "/view",
    },
    {
      label: "Chat",
      icon: <IoChatboxEllipsesOutline className="w-5 h-5" />,
      href: "/chat",
    },
    {
      label: "Thông tin dự án",
      icon: <IoSettingsOutline className="w-5 h-5" />,
      href: "/setting",
    },
  ];

  const handleNavigate = (href: string, id?: number) => {
    console.log('id', id)
    if (id) {
      router.push(`/project/${id}/${href}`);
    } else {
      router.push(href);
    }
  };

  if (loadingPitching) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-[50%]" />
          <Skeleton className="h-8 w-10" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-x-2">
            <div className="w-8 h-8 relative shrink-0">
              <Skeleton className="h-full w-full absolute" />
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {navItem.map((route, index) => (
        <Button
          size="sm"
          onClick={() => handleNavigate(route.href)}
          className={cn(
            "w-full font-normal justify-start hover:bg-neutral-500/10 gap-2 rounded-md",
            pathName === route.href && "bg-sky-500/10 text-sky-700"
          )}
          variant="ghost"
          key={index}
        >
          {route.icon}
          {route.label}
        </Button>
      ))}

      <Separator className="bg-gray-400 my-4" />

      <div className="font-medium text-xs flex items-center mb-3">
        <span>Dự án gần đây</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto justify-end mr-1 cursor-pointer hover:bg-neutral-500/10"
        >
          <FiPlus className="h-4 w-4" />
        </Button>
      </div>

      {dataPitching.map(
        (pitching, index) =>
          pitching.register_pitching_status === "Selected" && (
            <Accordion type="multiple" key={index}>
              <AccordionItem value={`item-${index}`} className="border-none">
                <AccordionTrigger
                  className="flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 
          transition text-start no-underline hover:no-underline"
                  style={{ borderRadius: "6px" }}
                >
                  <div className="flex items-center gap-x-2">
                    <span className="font-medium text-sm">
                      {pitching.project.name_project}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 text-neutral-700">
                  {routesInProject.map((route, index) => (
                    <Button
                      size="sm"
                      onClick={() => handleNavigate(route.href, pitching.project.id)}
                      className={cn(
                        "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md",
                        pathName === route.href && "bg-sky-500/10 text-sky-700"
                      )}
                      variant="ghost"
                      key={index}
                    >
                      {route.icon}
                      {route.label}
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )
      )}
    </>
  );
};

export default StudentSidebar;
