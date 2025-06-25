import { useEffect } from "react";
import Swal from "sweetalert2";

const PagoFallido = () => {
  useEffect(() => {
    Swal.fire("Pago fallido", "No se pudo procesar el pago", "error");
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Pago fallido</h1>
      <p>Hubo un error al procesar tu compra. Por favor, intentá nuevamente.</p>
      <a href="/carrito">Volver al carrito</a>
    </div>
  );
};

export default PagoFallido;
