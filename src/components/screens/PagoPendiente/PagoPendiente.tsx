import { useEffect } from "react";
import Swal from "sweetalert2";

const PagoPendiente = () => {
  useEffect(() => {
    Swal.fire(
      "🕒 Pago pendiente",
      "Tu pago está en proceso de revisión",
      "info"
    );
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Pago pendiente</h1>
      <p>Estamos esperando la confirmación de tu pago.</p>
    </div>
  );
};

export default PagoPendiente;
