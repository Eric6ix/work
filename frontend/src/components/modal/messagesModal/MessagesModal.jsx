// src/components/modal/messagesModal/MessagesModal.jsx
import Modal from '../Modal'; // Caminho relativo
import './MessagesModalStyle.css';

const MessagesModal = ({ onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Mensagens Recebidas">
      <ul>
        <li>Mensagem 1</li>
        <li>Mensagem 2</li>
        <li>Mensagem 3</li>
      </ul>
    </Modal>
  );
};

export default MessagesModal;
