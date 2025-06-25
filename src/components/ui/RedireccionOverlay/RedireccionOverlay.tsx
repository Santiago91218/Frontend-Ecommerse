import styles from "./RedireccionOverlay.module.css";

const RedireccionOverlay = () => {
  return (
    <div className={styles.overlay}>
      <img src="/logo-lookz.png" alt="Lookz" className={styles.logo} />
      <img
        src="/logo-mercadopago.png"
        alt="Mercado Pago"
        className={styles.logo}
      />
      <p className={styles.texto}>Redirigiendo a Mercado Pago...</p>
    </div>
  );
};

export default RedireccionOverlay;
