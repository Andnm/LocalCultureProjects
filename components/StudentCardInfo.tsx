import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentCardInfoProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
  dataStudent?: any;
}

export const StudentCardInfo = ({
  children,
  side = "bottom",
  sideOffset = 0,
  dataStudent,
}: StudentCardInfoProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          side={side}
          className="text-sm break-words bg-white"
        >
          <div className="w-full bg-gray-100 px-10 pt-10 pb-2">
            <div className="relative mt-16 max-w-sm mx-auto ">
              <div className="rounded overflow-hidden shadow-md bg-white">
                <div className="absolute -mt-20 w-full flex justify-center">
                  <div className="h-32 w-32">
                    <img
                      src={dataStudent?.user?.avatar_url}
                      className="rounded-full object-cover h-full w-full shadow-md"
                    />
                  </div>
                </div>
                <div className="px-6 mt-16">
                  <h1 className="font-bold text-3xl text-center mb-1">
                    {dataStudent?.user?.fullname}
                  </h1>
                  <p className="text-gray-800 text-sm text-center">
                    {dataStudent?.user?.email}
                  </p>
                  <div className="flex text-center text-gray-600 text-base pt-3 mb-3 font-normal justify-between">
                    {dataStudent?.user?.description ? (
                      <p>
                        Mô tả bản thân:
                        {dataStudent?.user?.description}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
