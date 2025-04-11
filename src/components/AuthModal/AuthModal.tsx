import React from 'react'

import cl from './AuthModal.module.sass'

interface ModalProps {
  message: string
  onClose: () => void
}

const AuthModal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className={cl.modalOverlay}>
      <div className={cl.modalContent}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
}

export default AuthModal
