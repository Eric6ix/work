// src/components/modal/sendMessage/SendMessageModal.jsx
import Modal from '../Modal';
import './SendMessageModalStyle.css';

const SendMessageModal = ({ onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Enviar Mensagem">
      <form>
        <label>Título:</label>
        <input type="text" />
        <label>Conteúdo:</label>
        <textarea />
        <button type="submit">Enviar</button>
      </form>
    </Modal>
  );
};

export default SendMessageModal;
