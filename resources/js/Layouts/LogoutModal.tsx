import React, { useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import { MdLogout } from 'react-icons/md';
import { useTranslation } from '@/Contexts/TranslationContext';
import { motion, AnimatePresence } from 'framer-motion';

interface LogoutModalProps {
  showLogoutModal: boolean;
  setShowLogoutModal: (show: boolean) => void;
  darkMode: boolean;
}

export default function LogoutModal({ showLogoutModal, setShowLogoutModal, darkMode }: LogoutModalProps) {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLogoutModal(false);
      }
    };

    if (showLogoutModal) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLogoutModal, setShowLogoutModal]);

  if (!showLogoutModal) return null;

  const confirmLogout = () => {
    router.post(route('logout'));
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const modalBgClass = darkMode ? 'bg-dark-surface bg-opacity-80' : 'bg-light-surface bg-opacity-80';
  const modalContentBgClass = darkMode ? 'bg-dark-surface bg-opacity-70' : 'bg-light-surface bg-opacity-70';
  const iconBgClass = darkMode ? 'bg-red-900 bg-opacity-50' : 'bg-red-100';
  const iconTextClass = darkMode ? 'text-red-300' : 'text-red-600';
  const titleTextClass = darkMode ? 'text-gray-200' : 'text-gray-900';
  const descriptionTextClass = darkMode ? 'text-gray-400' : 'text-gray-500';
  const footerBgClass = darkMode ? 'bg-gray-800 bg-opacity-50' : 'bg-gray-50 bg-opacity-50';
  const confirmButtonClass = 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white';
  const cancelButtonClass = darkMode
    ? 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600'
    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <AnimatePresence>
      {showLogoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-filter backdrop-blur-sm"
              aria-hidden="true"
            ></motion.div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`inline-block align-bottom ${modalBgClass} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full backdrop-filter backdrop-blur-lg border border-gray-200 dark:border-gray-700`}
              ref={modalRef}
            >
              <div className={`${modalContentBgClass} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBgClass} sm:mx-0 sm:h-10 sm:w-10`}>
                    <MdLogout className={`h-6 w-6 ${iconTextClass}`} aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className={`text-lg leading-6 font-semibold ${titleTextClass}`} id="modal-title">
                      {t('logoutModal.title')}
                    </h3>
                    <div className="mt-2">
                      <p className={`text-sm ${descriptionTextClass}`}>{t('logoutModal.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`${footerBgClass} px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse`}>
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${confirmButtonClass} text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out`}
                  onClick={confirmLogout}
                >
                  {t('logoutModal.confirmButton')}
                </button>
                <button
                  type="button"
                  className={`mt-3 w-full inline-flex justify-center rounded-md border ${cancelButtonClass} shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-150 ease-in-out`}
                  onClick={cancelLogout}
                >
                  {t('logoutModal.cancelButton')}
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}