// src/components/modal/sendMessage/SendMessageModal.jsx
import Modal from '../Modal';
import './SendMessageModalStyle.css';

const SendMessageModal = ({ onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode montar um FormData com os dados do formulário e os arquivos
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Enviar Mensagem">
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <input placeholder='Qual o título da sua mensagem?' type="text" name="title" required />

        <textarea placeholder='Digite o conteúdo da mensage aqui.' name="content" required />

        <div className="file-box-content">
          <label>Anexar arquivos (.pdf, .xml):</label>
        <input type="file" name="attachments" multiple accept=".pdf,.xml"/>
        </div>
 
        <button type="submit">Enviar</button>
      </form>
    </Modal>
  );
};

export default SendMessageModal;
