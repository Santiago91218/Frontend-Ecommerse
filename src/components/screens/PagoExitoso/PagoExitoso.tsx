import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/useCartStore";

const PagoExitoso = () => {
  const navigate = useNavigate();
  const vaciar = useCartStore((state) => state.vaciar);

  useEffect(() => {
    vaciar();
  }, [vaciar]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Gracias por tu compra</h1>
      <p>Tu pago fue procesado correctamente.</p>
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default PagoExitoso;
