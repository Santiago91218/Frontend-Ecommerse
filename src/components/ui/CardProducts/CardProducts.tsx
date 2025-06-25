import styles from "./CardProducts.module.css";
import { FC } from "react";
import { useNavigate } from "react-router";
import { IDescuento } from "../../../types/IDescuento";
import { IDetalleDTO } from "../../../types/detalles/IDetalleDTO";

interface IProps {
  products: IDetalleDTO;
}

const CardProducts: FC<IProps> = ({ products }) => {
  const navigate = useNavigate();

  const isDescuentoActivo = (descuento: IDescuento | undefined): boolean => {
    if (!descuento) return false;

    const hoy = new Date();
    const fechaInicio = new Date(descuento.fechaInicio);
    const fechaFin = new Date(descuento.fechaFin);

    return hoy >= fechaInicio && hoy <= fechaFin;
  };

  const descuentoActivo = isDescuentoActivo(products.precio.descuento);

  const handleNavigate = (id: number) => {
    navigate(`/product/${id}`);
  };

  const calcularDescuento = (
    precioVenta: number,
    porcentajeDescuento: number
  ) => {
    if (porcentajeDescuento <= 0) {
      return precioVenta;
    }
    return precioVenta - precioVenta * (porcentajeDescuento / 100);
  };

  if (!products || !products.producto) {
    return <div>Producto no disponible</div>;
  }
  return (
    <>
      <div className={styles.productCard}>
        <div className={styles.productImage}>
          {descuentoActivo && (
            <div className={styles.divDescuento}>
              <p>- {products.precio.descuento.descuento}%</p>
            </div>
          )}

          {products.imagenPrincipal ? (
            <img
              src={products.imagenPrincipal.url || "Imagen del producto"}
              alt={products.imagenPrincipal.alt || "Imagen del producto"}
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
          ) : (
            <div className={styles.imagePlaceholder}>Sin imagen</div>
          )}
        </div>

        <div className={styles.productDetails}>
          <div className={styles.productInfo}>
            <p className={styles.productName}>
              {products.producto.nombre} {products.color}
            </p>
            <p className={styles.productPrice}>
              {descuentoActivo ? (
                <>
                  <span className={styles.precioTachado}>
                    ${products.precio.precioVenta}
                  </span>
                  <span className={styles.totalDescuento}>
                    $
                    {calcularDescuento(
                      products.precio.precioVenta,
                      products.precio.descuento.descuento
                    )}
                  </span>
                </>
              ) : (
                <>${products.precio.precioVenta}</>
              )}
            </p>
          </div>

          <div className={styles.productActions}>
            <button
              className={styles.productButton}
              onClick={() => handleNavigate(products.id!)}
            >
              Ver más
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardProducts;
