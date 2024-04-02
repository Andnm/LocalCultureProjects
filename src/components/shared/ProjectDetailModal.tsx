import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { CSSProperties, Fragment } from "react";

interface ModalProps {
  open: boolean;
  title: React.ReactNode;
  body: React.ReactNode;
  actionClose?: () => void;
  actionConfirm?: () => void;
  buttonClose?: string;
  buttonConfirm?: string;
  status?: any;
  styleWidth?: any;
}

export default function ProjectDetailModal({
  open,
  title,
  body,
  actionClose,
  buttonClose,
  actionConfirm,
  buttonConfirm,
  status,
  styleWidth,
}: ModalProps) {
  const closeByClickBackground = () => {
    if (actionClose) {
      actionClose();
    }
  };

  const styleOverlay: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  };

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeByClickBackground}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 blur-sm opacity-20" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center relative z-50">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`relative z-40 w-full ${
                    styleWidth ? styleWidth: "max-w-6xl"
                  } transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all`}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                  >
                    {title}
                    <X className="cursor-pointer" onClick={actionClose} />
                  </Dialog.Title>

                  <div className="mt-2">{body}</div>

                  {status === "Pending" && (
                    <div className="mt-4 flex gap-4 justify-end">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={actionClose}
                        style={{ borderRadius: "10px" }}
                      >
                        {buttonClose}
                      </button>

                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={actionConfirm}
                        style={{ borderRadius: "10px" }}
                      >
                        {buttonConfirm}
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
              <div className="overlay" style={styleOverlay}></div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
