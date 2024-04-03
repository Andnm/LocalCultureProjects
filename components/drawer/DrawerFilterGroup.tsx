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
import "./style.scss";
import { FILTER_GROUP_BY_LECTURER } from "@/src/constants/filter";

interface DrawerFilterProps {
  openDrawer: any;
  closeDrawerAction: any;
  filterOption: any;
  setFilterOption: any;
}

const DrawerFilterGroup = ({
  openDrawer,
  closeDrawerAction,
  filterOption,
  setFilterOption,
}: DrawerFilterProps) => {
  return (
    <Drawer
      overlay={false}
      placement="right"
      open={openDrawer}
      onClose={closeDrawerAction}
      className="p-4 drawer-filter-account"
      size={300}
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
        {FILTER_GROUP_BY_LECTURER.map((filterItem, index) => (
          <Accordion key={index} type="multiple">
            <AccordionItem value={`item-${index}`} className="border-none">
              <AccordionTrigger
                className="flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline"
                style={{ borderRadius: "6px" }}
              >
                <div className="flex items-center gap-x-2">
                  <span className="font-medium text-sm">
                    {filterItem.label}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-1 text-neutral-700">
                {filterItem.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className="flex items-center mb-1 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filterOption[filterItem.value]?.includes(
                        option.value
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFilterOption((prevFilterOption: any) => ({
                          ...prevFilterOption,
                          [filterItem.value]: isChecked
                            ? [
                                ...prevFilterOption[filterItem.value],
                                option.value,
                              ]
                            : prevFilterOption[filterItem.value].filter(
                                (value: string) => value !== option.value
                              ),
                        }));
                      }}
                      className="form-checkbox h-4 w-4 ml-5 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        <Button
          className={cn(
            "font-normal justify-start ph-10 mb-1 text-blue-900 bg-blue-300 hover:bg-blue-400 gap-2 rounded absolute bottom-10"
          )}
          variant="ghost"
          onClick={() =>
            setFilterOption({
              subject_code: [],
              register_pitching_status: [],
              relationship_status: [],
              searchValue: "",
            })
          }
        >
          Xoá lựa chọn
        </Button>
      </div>
    </Drawer>
  );
};

export default DrawerFilterGroup;
