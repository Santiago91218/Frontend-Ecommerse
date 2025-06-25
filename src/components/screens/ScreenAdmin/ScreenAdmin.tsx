import styles from "./ScreenAdmin.module.css";
import { useEffect, useState } from "react";
import { detalleStore } from "../../../store/detalleStore";
import { HeaderAdmin } from "../../ui/HeaderAdmin/HeaderAdmin";
import { Productos } from "./Productos/Productos";
import Footer from "../../ui/Footer/Footer";
import { Categorias } from "./Categorias/Categorias";
import { Usuarios } from "./Usuarios/Usuarios";

type Tab = "productos" | "categorias" | "usuarios";

const ScreenAdmin = () => {
  const [activeTab, setActiveTab] = useState<Tab>("productos");

  const setDetalle = detalleStore((state) => state.setDetalle);

  const cargarContenido = () => {
    switch (activeTab) {
      case "productos":
        return <Productos />;
      case "categorias":
        return <Categorias />;
      case "usuarios":
        return <Usuarios />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchPedido = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token disponible");
        return;
      }
      const response = await fetch("http://localhost:8080/detalles/DTO", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setDetalle(data);
    };
    fetchPedido();
  }, []);

  return (
    <>
      <HeaderAdmin />
      <div className={styles.adminContainer}>
        <div className={styles.adminContent}>
          <nav className={styles.adminTabs}>
            <button
              className={`${activeTab === "productos" ? styles.active : ""}`}
              onClick={() => setActiveTab("productos")}
            >
              Productos
            </button>
            <button
              className={`${activeTab === "categorias" ? styles.active : ""}`}
              onClick={() => setActiveTab("categorias")}
            >
              Categorías
            </button>
            <button
              className={`${activeTab === "usuarios" ? styles.active : ""}`}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuarios
            </button>
          </nav>

          <div className={styles.tabContent}>{cargarContenido()}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ScreenAdmin;
