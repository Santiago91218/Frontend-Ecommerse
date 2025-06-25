import Header from "../../../ui/Header/Header";
import Footer from "../../../ui/Footer/Footer";
import styles from "./ScreenKids.module.css";
import SidebarFilter from "../../../ui/SidebarFilter/SidebarFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IDetalleDTO } from "../../../../types/detalles/IDetalleDTO";
import { ServiceDetalle } from "../../../../services/serviceDetalle";
import { useFilterStore } from "../../../../store/filterStore";
import CardProducts from "../../../ui/CardProducts/CardProducts";

const ScreenKids = () => {
  const [productosInfantil, setProductosInfantil] = useState<IDetalleDTO[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { orden, categoria, tipoProducto, talle, minPrecio, maxPrecio } =
    useFilterStore();
  useEffect(() => {
    const detalleService = new ServiceDetalle();
    detalleService
      .getDetallesGeneroProduct("INFANTIL")
      .then(setProductosInfantil);
  });

  const productosFiltrados = productosInfantil.filter((producto) => {
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
      <div className={styles.screenKids}>
        <Header />

        <div className={styles.bannerImages}>
          <img
            src="https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/h_1110,c_limit/17783f55-98a7-4483-b0eb-c3a44d2261b4/el-mejor-calzado-nike-para-ni%C3%B1os.jpg"
            alt=""
          />
          <img
            src="https://static.nike.com/a/images/f_auto,cs_srgb/w_1536,c_limit/494ab9f8-072f-49f7-a2c7-05772993c1a2/nike-para-ni%C3%B1os.jpg"
            alt=""
          />
          <img
            src="https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/h_484,c_limit/4906ab21-937a-4a9a-997a-ae95ec24bd70/los-mejores-calcetines-de-nike-para-ni%C3%B1os.jpg"
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

export default ScreenKids;
