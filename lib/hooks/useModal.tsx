import { useStoreModal } from "../store";

export default function useModal(modalName: string) {
  const modal = useStoreModal((state) => state.getModal(modalName));
  const openModalStore = useStoreModal((state) => state.openModal);
  const closeModalStore = useStoreModal((state) => state.closeModal);

  const open = (props?: Record<string, unknown>) => openModalStore(modalName, props);

  const close = () => closeModalStore(modalName);

  return { modal, open, close, isOpen: modal?.isOpen || false };
}