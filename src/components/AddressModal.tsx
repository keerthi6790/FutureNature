import styles from "../styles/AddressModal.module.scss";

const AddressModal = ({ onClose }) => {
  return (
    <>
      <div onClick={onClose} className={styles.overlay} />
      <div className={styles.modal}>
        <button onClick={onClose} className={styles.closeButton}>
          &times;
        </button>
      </div>
    </>
  );
};

export default AddressModal;
