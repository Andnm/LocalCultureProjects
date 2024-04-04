"use client";
import React from "react";
import { Drawer, IconButton } from "@material-tailwind/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DrawerFilterProps {
  openDrawer: any;
  closeDrawerAction: any;
  filterOption: any;
  setFilterOption: any;
}

const DrawerFilter = ({
  openDrawer,
  closeDrawerAction,
  filterOption,
  setFilterOption,
}: DrawerFilterProps) => {
  const renderCheckIcon = (array: any, value: any) => {
    return (
      <span className="flex items-center">
        {/* Circle */}
        <span className="h-5 w-5 rounded-full border border-neutral-700 border-2 mr-2">
          {array?.includes(value?.toLowerCase()) && (
            // Check icon in the center of the circle
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4 text-green-500 font-bold"
              style={{ margin: "auto", strokeWidth: "3" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
      </span>
    );
  };

  const toggleBusiness_sector = (field: any) => {
    setFilterOption((prevFilterOption: any) => {
      const fieldLower = field?.toLowerCase();
      const fieldIndex = prevFilterOption?.business_sector?.indexOf(fieldLower);

      if (fieldIndex !== -1) {
        // Field is already in the array, so remove it
        return {
          ...prevFilterOption,
          business_sector: prevFilterOption?.business_sector?.filter(
            (f: any) => f !== fieldLower
          ),
        };
      } else {
        // Field is not in the array, so add it
        return {
          ...prevFilterOption,
          business_sector: [...prevFilterOption?.business_sector, fieldLower],
        };
      }
    });
  };

  const toggleBusiness_type = (field: any) => {
    setFilterOption((prevFilterOption: any) => {
      const fieldLower = field?.toLowerCase();
      const fieldIndex = prevFilterOption?.business_type?.indexOf(fieldLower);

      if (fieldIndex !== -1) {
        // Field is already in the array, so remove it
        return {
          ...prevFilterOption,
          business_type: prevFilterOption?.business_type?.filter(
            (f: any) => f !== fieldLower
          ),
        };
      } else {
        // Field is not in the array, so add it
        return {
          ...prevFilterOption,
          business_type: [...prevFilterOption?.business_type, fieldLower],
        };
      }
    });
  };

  return (
    <Drawer
      overlay={false}
      placement="right"
      open={openDrawer}
      onClose={closeDrawerAction}
      className="p-4 shadow-md w-[500px] z-50"
      size={700}
    >
      <div className="mb-6 flex items-center justify-between ">
        <h1 className="text-black font-bold text-2xl">Bộ lọc</h1>
        <IconButton variant="text" onClick={closeDrawerAction}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </div>

      <div>
        {/* Linh vực kinh doanh, business_sector:*/}
        <Accordion type="multiple">
          <AccordionItem value={`item-2`} className="border-none">
            <AccordionTrigger
              className="flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 
          transition text-start no-underline hover:no-underline"
              style={{ borderRadius: "6px" }}
            >
              <div className="flex items-center gap-x-2">
                {/* business_model, b2c b2b*/}
                <span className="font-medium text-sm">Lĩnh vực kinh doanh</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_sector("Nông nghiệp")}
              >
                {renderCheckIcon(filterOption.business_sector, "Nông nghiệp")}
                Nông nghiệp
              </Button>

              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_sector("Thủ công nghiệp")}
              >
                {renderCheckIcon(
                  filterOption.business_sector,
                  "Thủ công nghiệp"
                )}
                Thủ công nghiệp
              </Button>

              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_sector("Du lịch")}
              >
                {renderCheckIcon(filterOption.business_sector, "Du lịch")}
                Du lịch
              </Button>

              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_sector("Khác")}
              >
                {renderCheckIcon(filterOption.business_sector, "Khác")}
                Khác
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Hướng đi của dự án, business_type Plan (Lên kế hoạch), Project (Triển khai dự án)*/}
        <Accordion type="multiple">
          <AccordionItem value={`item-3`} className="border-none">
            <AccordionTrigger
              className="flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 
          transition text-start no-underline hover:no-underline"
              style={{ borderRadius: "6px" }}
            >
              <div className="flex items-center gap-x-2">
                {/* business_model, b2c b2b*/}
                <span className="font-medium text-sm">Hướng đi của dự án</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_type("Plan")}
              >
                {renderCheckIcon(filterOption.business_type, "Plan")}
                Lên kế hoạch
              </Button>

              <Button
                className={cn(
                  "w-full font-normal justify-start pl-10 mb-1 hover:bg-neutral-500/10 gap-2 rounded-md"
                )}
                variant="ghost"
                onClick={() => toggleBusiness_type("Project")}
              >
                {renderCheckIcon(filterOption.business_type, "Project")}
                Triển khai dự án
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          className={cn(
            "font-normal justify-start ph-10 mb-1 text-blue-900 bg-blue-300 hover:bg-blue-400 gap-2 rounded absolute bottom-20"
          )}
          variant="ghost"
          onClick={() =>
            setFilterOption({
              business_model: [],
              business_type: [],
              specialized_field: [],
              searchValue: filterOption?.searchValue,
            })
          }
        >
          Xoá lựa chọn
        </Button>
      </div>
    </Drawer>
  );
};

export default DrawerFilter;
