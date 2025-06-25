import { useEffect, useState } from "react";
import { IOrdenCompra } from "../../../types/IOrdenCompra";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Header";
import styles from "./ScreenUser.module.css";
import { getOrdenesPorUsuario } from "../../../services/ordenService";

export const ScreenUser = () => {
  const [ordenesUsuario, setOrdenesUsuario] = useState<IOrdenCompra[]>([]);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const userString = localStorage.getItem("usuario");
        const user = userString ? JSON.parse(userString) : null;

        if (user) {
          const data = await getOrdenesPorUsuario(user.id);
          const ordenesOrdenadas = data.sort(
            (a: IOrdenCompra, b: IOrdenCompra) =>
              new Date(b.fechaCompra).getTime() -
              new Date(a.fechaCompra).getTime()
          );
          setOrdenesUsuario(ordenesOrdenadas);
        } else {
          console.error("Usuario no encontrado en localStorage");
        }
      } catch (error) {
        console.error("Error al obtener las ordenes:", error);
      }
    };

    fetchOrdenes();
  }, []);

  const ordenesAgrupadas = ordenesUsuario.reduce((acc, orden) => {
    const fecha = new Date(orden.fechaCompra).toISOString().slice(0, 10);
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(orden);
    return acc;
  }, {} as Record<string, IOrdenCompra[]>);

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className={styles.contentTittle}>
            <h2>Registro de Compras</h2>
          </div>

          <div className={styles.containerTable}>
            {Object.keys(ordenesAgrupadas).length > 0 ? (
              Object.entries(ordenesAgrupadas).map(([fecha, ordenes]) => (
                <div key={fecha} className={styles.groupContainer}>
                  <p className={styles.fechaCompra}>Compra del {fecha}</p>
                  {ordenes.map((orden) => (
                    <div key={orden.id} className={styles.item}>
                      <div className={styles.containerData}>
                        <div className={styles.productosSeccion}>
                          <p>
                            <strong>Productos:</strong>
                          </p>
                          <ul>
                            {orden.detalles.map((detalle) => (
                              <li key={detalle.id}>
                                {detalle.producto.nombre} - Cantidad:{" "}
                                {detalle.cantidad}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={styles.totalSeccion}>
                          <p>
                            <strong>Total:</strong> ${orden.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className={styles.text}>No has realizado ninguna compra</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
