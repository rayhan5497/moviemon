import { createContext, useContext, useEffect, useState } from 'react';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null);

  const openModal = (type) => setModal(type);
  const closeModal = () => setModal(null);

  useEffect(() => {
    const shouldOpenUserModal = localStorage.getItem('openUserModal') === '1';
    if (shouldOpenUserModal) {
      localStorage.removeItem('openUserModal');
      setModal('user');
    }

    const handleOpenUserModal = () => setModal('user');
    window.addEventListener('openUserModal', handleOpenUserModal);
    return () =>
      window.removeEventListener('openUserModal', handleOpenUserModal);
  }, []);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
