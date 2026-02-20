import { useState } from 'react';

import { useModal } from '../../context/ModalContext';
import Login from './Login';
import Signup from './Signup';
import { X } from 'lucide-react';
import { Toast } from '../../components/ui/MUI';

export default function AuthModalController() {
  const [action, setAction] = useState('Register');
  const { modal, closeModal } = useModal();

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleAuthSuccess = (message) => {
    setToast({
      open: true,
      message: message || 'Success',
      severity: 'success',
    });
  };

  return (
    <>
      {modal === 'auth' && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-999"
          onClick={closeModal} 
        >
          <div
            className="rounded-xl w-[450px] max-w-[90%] relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <X
              onClick={closeModal}
              className={`text-white opacity-70 hover:opacity-80 cursor-pointer w-8 p-0 m-4 right-0 z-20 absolute`}
              size={32}
              strokeWidth={3}
              role="button"
            />
            <div className=" bg-primary backdrop-blur-lg border border-accent-secondary rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[70dvh] content-center">
              {action === 'Login' ? (
                <Signup onSuccess={handleAuthSuccess} />
              ) : (
                <Login onSuccess={handleAuthSuccess} />
              )}
              <p className="text-center text-secondary text-sm mt-6">
                {action === 'Login'
                  ? 'Have a account? '
                  : 'Don???t have an account? '}
                <button
                  onClick={() =>
                    action === 'Login'
                      ? setAction('Register')
                      : setAction('Login')
                  }
                  className="text-accent cursor-pointer hover:underline"
                >
                  {action}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleToastClose}
      />
    </>
  );
}
