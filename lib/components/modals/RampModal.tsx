import { Transition, Dialog, TransitionChild, DialogPanel } from "@headlessui/react"
import { Fragment, useEffect } from "react"
import useWalletTwo from "../../hooks/useWalletTwo";

export default function RampModal() {
  /*const { 
    isRampModalOpen, setIsRampModalOpen,
    rampIframe, setRampIframe,
    rampIframeOnFinish, setRampIframeOnFinish,
    rampIframeOnCancel, setRampIframeOnCancel,
  } = useWalletTwo();

  useEffect(() => {
    if (!isRampModalOpen) {
      setIsRampModalOpen?.(false);
      setRampIframeOnCancel?.(() => {});
      setRampIframeOnFinish?.(() => {});
    }

    /*const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://wallet.wallettwo.com") return;
      if (event.data.type === "transaction_complete" || event.data.type === "transaction_cancelled") {
        if(event.data.type === "transaction_complete" ) txIframeOnFinish?.();
        window.removeEventListener("message", handleMessage);
        setTimeout(() => {
          setIsTransactionModalOpen?.(false);
        }, 1000);
      }
    }

    
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    }
  }, [isRampModalOpen]);

  return (<Transition show={isRampModalOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={() => setIsRampModalOpen?.(false)}>
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
              {rampIframe && (
                <iframe
                  src={rampIframe.src}
                  id={rampIframe.id}
                  className="w-full min-w-[600px] min-h-[650px] border-0"
                  title="WalletTwo Transaction"
                />
              )}
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </Transition>)*/
  return (<></>);
}