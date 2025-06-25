import { Search } from "lucide-react";
import Header from "../../../ui/Header/Header";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import styles from "./ScreenDestacados.module.css";
import Footer from "../../../ui/Footer/Footer";
import { ServiceDetalle } from "../../../../services/serviceDetalle";
import { useEffect, useState } from "react";
import { IDetalleDTO } from "../../../../types/detalles/IDetalleDTO";
import { useFilterStore } from "../../../../store/filterStore";
import CardProducts from "../../../ui/CardProducts/CardProducts";

export const ScreenDestacados = () => {
  const [productosDestacados, setProductosDestacados] = useState<IDetalleDTO[]>(
    []
  );
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();
  const detalleService = new ServiceDetalle();

  const getProducts = async () => {
    const productosDestacados = await detalleService.getProductosDestacados();
    setProductosDestacados(productosDestacados);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const productosFiltrados = productosDestacados.filter(
    (producto: IDetalleDTO) => {
      const nombre = producto.producto.nombre.toLowerCase();
      const coincideBusqueda = nombre.includes(inputText.toLowerCase());

      const coincideCategoria =
        categoria.length === 0 ||
        categoria.includes(producto.producto.categoria.nombre.toLowerCase());

      const coincideTipo =
        tipoProducto.length === 0 ||
        tipoProducto.includes(producto.producto.tipoProducto);

      const coincideTalle =
        talle.length === 0 ||
        (producto.talle
          ? talle.includes(producto.talle.talle.toLowerCase())
          : true);

      const precioVenta = producto.precio.precioVenta;

      const coincideMinPrecio = minPrecio === null || precioVenta >= minPrecio;
      const coincideMaxPrecio = maxPrecio === null || precioVenta <= maxPrecio;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideTipo &&
        coincideTalle &&
        coincideMinPrecio &&
        coincideMaxPrecio
      );
    }
  );

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    if (orden.includes("ascendente")) {
      return a.precio.precioVenta - b.precio.precioVenta;
    }
    if (orden.includes("descendente")) {
      return b.precio.precioVenta - a.precio.precioVenta;
    }
    return 0;
  });

  const handleChangeInputSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <>
      <div className={styles.screenDestacados}>
        <Header />

        <div className={styles.mainContent}>
          <div className={styles.sidebar}>
            <SidebarFilter />
          </div>
          <div className={styles.productsSection}>
            <div className={styles.searchBar}>
              <input
                value={inputText}
                onChange={handleChangeInputSearch}
                type="search"
                placeholder="Buscar producto"
              />
              <Search />
            </div>
            <div className={styles.productCards}>
              {productosOrdenados.map((producto: IDetalleDTO) => (
                <CardProducts key={producto.id} products={producto} />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};
