import { Transition, Dialog } from "@headlessui/react"
import useModal from "../../hooks/useModal"
import { Fragment } from "react"
import { ChevronLeft, X } from "lucide-react"

export default function Modal({ 
  name,
  title = "",
  children,
  className = '',
  closeButton = true,
  backButton = false,
  onBack,
  titleClassName = "",
  ...props
}: { 
  name: string,
  title?: string | React.ReactNode,
  children?: React.ReactNode,
  className?: string,
  closeButton?: boolean,
  backButton?: boolean,
  onBack?: () => void,
  titleClassName?: string
}) {
  const depositModal = useModal(name)

  const handleClose = () => depositModal.close()
  const handleBack = () => (onBack ? onBack() : depositModal.close())

  const showHeader = backButton || title || closeButton

  return (
    <Transition show={depositModal.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
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
              className={`
                transform overflow-y-auto
                max-h-[90vh]
                rounded-2xl bg-white p-6 sm:p-8 shadow-xl transition-all
                ${className || ''}
              `}
              {...props}
            >
              {showHeader && (
                <div className="flex items-center gap-3">
                  {backButton ? (
                    <div>
                      <button
                        className="!px-2 !py-1"
                        onClick={handleBack}
                      >
                        <ChevronLeft className="h-4 w-4 text-black" />
                      </button>

                    </div>
                  ) : (null)}

                  <div className={`flex-1 ${backButton ? "text-center" : "text-left"}`}>
                    {title ? (
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        <p className={titleClassName}>
                          {title}
                        </p>
                      </Dialog.Title>
                    ) : null}
                  </div>

                  {closeButton ? (
                    <div>
                      <button
                        className="!px-2 !py-1"
                        onClick={handleClose}
                      >
                        <X className="h-4 w-4 text-black" />
                      </button>
                    </div>

                  ) : (
                    <div className="h-9 w-9" />
                  )}
                </div>
              )}

              <div className={`${showHeader ? "mt-4" : ""} w-full h-full`}>
                {children || (
                  <p className="text-sm text-gray-500">
                    Modal Content
                  </p>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
