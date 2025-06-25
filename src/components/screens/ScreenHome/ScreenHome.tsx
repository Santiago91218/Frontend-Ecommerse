import { useEffect, useState } from "react";
import Footer from "../../ui/Footer/Footer";
import Header from "../../ui/Header/Header";
import styles from "./ScreenHome.module.css";
import { IDetalleDTO } from "../../../types/detalles/IDetalleDTO";
import ProductCarousel from "../../ui/ProductCarousel/ProductCarousel";
import { ServiceDetalle } from "../../../services/serviceDetalle";

const ScreenHome = () => {
  const [productos, setProductos] = useState<IDetalleDTO[]>([]);
  const detalleService = new ServiceDetalle();

  useEffect(() => {
    fetchDetalles();
  }, []);

  const fetchDetalles = async () => {
    try {
      const result = await detalleService.getProductosDestacados();
      setProductos(result);
    } catch (error) {
      console.error("Error al hacer fetch:", error);
    }
  };

  return (
    <>
      <div className={styles.screenHome}>
        <div className={styles.headerContainer}>
          <Header />
        </div>

        <div className={styles.bannerSection}>
          <div className={styles.bannerText}>
            <p>12 cuotas sin interés con cualquier método de pago!!</p>
          </div>

          <div className={styles.bannerImages}>
            <img
              src="https://nikearprod.vtexassets.com/assets/vtex.file-manager-graphql/images/a27af53f-f331-4258-9177-7b4a308addb9___2aa67d42bbb69bf96f09df3d7700a6ae.jpg"
              alt="Banner 1"
            />
            <img
              src="https://nikearprod.vtexassets.com/assets/vtex.file-manager-graphql/images/b7d46e94-1335-4beb-bffe-cce0f681504b___e4369c93f6bddcbc47da4613bfe90c19.jpg"
              alt="Banner 2"
            />
            <img
              src="https://nikearprod.vtexassets.com/assets/vtex.file-manager-graphql/images/f4fb112c-4ba4-4b0c-a89e-5cbd241bc6e6___c696d1323fae6357856311327db412bb.jpg"
              alt="Banner 3"
            />
          </div>
        </div>
        <div className={styles.whySection}>
          <h1 className={styles.whyTitle}>
            ¿Por qué elegir <span className={styles.highlight}>LOOKz</span>?
          </h1>
          <p className={styles.whyText}>
            En <span className={styles.highlight}>LOOKz</span>, no solo vendemos
            indumentaria: vivimos la cultura urbana. Seleccionamos lo mejor en{" "}
            <span className={styles.highlight}>
              estilo, comodidad y tendencia
            </span>{" "}
            para que te expreses con cada paso.
          </p>
        </div>
        <div className={styles.featuredSection}>
          <h3 className={styles.featuredTitle}>Productos Destacados:</h3>
          <div className={styles.featuredProducts}>
            <ProductCarousel products={productos} />
          </div>
        </div>
        <div className={styles.footerSection}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ScreenHome;
