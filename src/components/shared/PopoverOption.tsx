import React, { Fragment } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Popover, Transition } from "@headlessui/react";

interface MessageProps {
  solutions: any;
}

const PopoverOption: React.FC<MessageProps> = ({ solutions }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? "text-red" : "text-black"}
                group inline-flex items-cente
                px-3 py-2 text-base font-medium hover:text-red focus:outline-none 
                focus-visible:ring-2 focus-visible:ring-white/75`}
          >
            <BiDotsHorizontalRounded />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 -translate-y-3"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-10"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="popover absolute left-1/2 z-10 mt-3 w-screen max-w-max -translate-x-full transform px-4 sm:px-0">
              <div className="rounded-lg shadow-lg ring-1 ring-black/5">
                <div className="relative grid bg-white">
                  {solutions.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-row gap-2 items-center px-5 py-3 cursor-pointer hover:bg-gray-200"
                      onClick={() => item.onClick()}
                    >
                      {item?.icon}
                      {item?.name}
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default PopoverOption;
