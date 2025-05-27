'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';

import Modal from './index';

interface ModalContextProps {
  // eslint-disable-next-line no-unused-vars
  show: (content: ReactNode) => void;
  hide: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const show = (content: ReactNode) => {
    setModalContent(content);
    setShowModal(true);
  };

  const hide = () => {
    setShowModal(false);

    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ show, hide, isOpen: showModal }}>
      {children}

      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
