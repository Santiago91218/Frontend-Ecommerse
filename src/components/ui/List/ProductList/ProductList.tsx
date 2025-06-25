import { FC } from "react";
import { IDetalleDTO } from "../../../../types/detalles/IDetalleDTO";
import styles from "./ProductList.module.css";
import CardProducts from "../../CardProducts/CardProducts";

interface IProps {
  products: IDetalleDTO[];
}

const ProductList: FC<IProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <div>No hay productos disponibles</div>;
  }
  return (
    <div className={styles.list}>
      {products.map((product) => (
        <CardProducts key={product.id} products={product} />
      ))}
    </div>
  );
};

export default ProductList;
