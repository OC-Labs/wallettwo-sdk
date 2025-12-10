import { Transition, Dialog, TransitionChild, DialogPanel } from "@headlessui/react"
import { Fragment, useEffect } from "react"
import useWalletTwo from "./useWalletTwo";

export default function TransactionModal() {
  const { isTransactionModalOpen, setIsTransactionModalOpen, txIframe } = useWalletTwo();

  useEffect(() => {
    if (!isTransactionModalOpen) return;

    const handleMessage = (event: MessageEvent) => {
      console.log("Message received in TransactionModal:", event);
      if (event.origin !== "https://wallet.wallettwo.com") return;
      if (event.data.event === "transaction_complete" || event.data.event === "transaction_cancelled") {
        setIsTransactionModalOpen?.(false);
        window.removeEventListener("message", handleMessage);
      }
    }
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    }
  }, [isTransactionModalOpen, setIsTransactionModalOpen]);

  return (<Transition show={isTransactionModalOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={() => setIsTransactionModalOpen?.(false)}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className={`transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all`}>
            <div className="h-full w-full" id="wallettwo-transaction-modal-container">
              {txIframe && (
                <iframe
                  src={txIframe.src}
                  id={txIframe.id}
                  className="w-full min-w-[600px] min-h-[250px] border-0"
                  title="WalletTwo Transaction"
                />
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>)
}