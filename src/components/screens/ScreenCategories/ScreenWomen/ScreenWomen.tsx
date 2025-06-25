import Header from "../../../ui/Header/Header";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenWomen.module.css";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IDetalleDTO } from "../../../../types/detalles/IDetalleDTO";
import { ServiceDetalle } from "../../../../services/serviceDetalle";
import { useFilterStore } from "../../../../store/filterStore";
import CardProducts from "../../../ui/CardProducts/CardProducts";

const ScreenWomen = () => {
  const [productosMujer, setProductosMujer] = useState<IDetalleDTO[] | any>([]);
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();
  useEffect(() => {
    const detalleService = new ServiceDetalle();
    detalleService.getDetallesGeneroProduct("FEMENINO").then(setProductosMujer);
  }, []);

  const productosFiltrados = productosMujer.filter((producto: IDetalleDTO) => {
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
  });

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
      <div className={styles.screenWomen}>
        <Header />

        <div className={styles.bannerImages}>
          <img
            src="https://nikearprod.vtexassets.com/arquivos/ids/1336341-1000-1000?v=638730634456330000&width=1000&height=1000&aspect=true"
            alt=""
          />
          <img
            src="https://nikearprod.vtexassets.com/arquivos/ids/1265747-1000-1000?v=638697032679300000&width=1000&height=1000&aspect=true"
            alt=""
          />
          <img
            src="https://nikearprod.vtexassets.com/arquivos/ids/1291643-1000-1000?v=638723801035300000&width=1000&height=1000&aspect=true"
            alt=""
          />
        </div>

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

export default ScreenWomen;
