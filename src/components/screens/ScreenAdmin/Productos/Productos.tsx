import { useEffect, useState } from "react";
import styles from "./Productos.module.css";
import { IProducto } from "../../../../types/IProducto";
import { AdminTable } from "../../../ui/AdminTable/AdminTable";
import ModalCrearEditarFormAdmin from "../../../ui/Forms/ModalCrearEditarProducto/ModalCrearEditarProducto";
import { ServiceProducto } from "../../../../services/productService";
import { ModalCrearTalle } from "../../../ui/Forms/ModalCrearTalle/ModalCrearTalle";
import { IDetalle } from "../../../../types/detalles/IDetalle";
import { ServiceDetalle } from "../../../../services/serviceDetalle";
import { ArrowLeft, ArrowRight, ImagePlus, Pencil, Trash2 } from "lucide-react";
import { ModalCrearEditarDetalle } from "../../../ui/Forms/ModalCrearEditarDetalle/ModalCrearEditarDetalle";
import { ModalAgregarImagen } from "../../../ui/Forms/ModalAgregarImagen/ModalAgregarImagen";
import Swal from "sweetalert2";

export const Productos = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState<IProducto[]>([]);
  const [productoActivo, setProductoActivo] = useState<IProducto | null>(null);
  const [page, setPage] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [modalTalle, setModalTalle] = useState<boolean>(false);
  const [modalDetalle, setModalDetalle] = useState<boolean>(false);
  const [modalAddImagen, setModalAddImagen] = useState<boolean>(false);
  const [productoExpandido, setProductoExpandido] = useState<number | null>(
    null
  );
  const [detallesPorProducto, setDetallesPorProducto] = useState<
    Record<number, IDetalle[]>
  >({});
  const [productoActivoDetalle, setProductoActivoDetalle] =
    useState<IProducto | null>(null);
  const [detalleActivo, setDetalleActivo] = useState<IDetalle | null>(null);
  const productoService = new ServiceProducto();
  const detalleService = new ServiceDetalle();

  const fetchProductos = async (pagina: number) => {
    try {
      const data = await productoService.getProductosPaginado(pagina);
      setProductos(data.content);
      setTotalPaginas(data.totalPages);
    } catch (error) {
      console.error("Error al cargar productos paginadas", error);
    }
  };

  useEffect(() => {
    fetchProductos(page);
  }, [page]);

  const handleAdd = () => {
    setProductoActivo(null);
    setModalOpen(true);
  };

  const handleEdit = (producto: IProducto) => {
    setProductoActivo(producto);
    setModalOpen(true);
  };

  const handleDelete = async (producto: IProducto) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await productoService.eliminarProducto(producto.id);
        await fetchProductos(page);
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  const handleDeleteDetalle = async (detalle: IDetalle) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
      });

      if (result.isConfirmed) {
        await detalleService.eliminarDetalle(detalle.id!);
        await getDetallesProductos(detalle.producto.id);
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  const getDetallesProductos = async (productoId: number) => {
    try {
      const detalles = await detalleService.getDetallesPorProducto(productoId);
      setDetallesPorProducto((prev) => ({ ...prev, [productoId]: detalles }));
    } catch (error) {
      console.error("Error al cargar detalles del producto", error);
    }
  };

  const handleRefreshDetalles = async (productoId: number) => {
    await getDetallesProductos(productoId);
  };

  const toggleDetalle = async (id: number) => {
    if (productoExpandido === id) {
      setProductoExpandido(null);
    } else {
      if (!detallesPorProducto[id]) {
        await getDetallesProductos(id);
      }
      setProductoExpandido(id);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (producto: IProducto) => {
    try {
      if (producto.id) {
        await productoService.editarProducto(producto.id, producto);
        setProductos((prev) =>
          prev.map((u) => (u.id === producto.id ? producto : u))
        );
      } else {
        const nuevoProducto = await productoService.crearProducto(producto);
        setProductos((prev) => [...prev, nuevoProducto]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el Producto", error);
    }
  };

  const handleCreateDetalle = (producto: IProducto) => {
    setProductoActivoDetalle(producto);
    setModalDetalle(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerButtonsFunctions}>
        <button
          onClick={() => {
            setModalTalle(true);
          }}
        >
          Añadir Talle
        </button>
      </div>
      <AdminTable<IProducto>
        data={productos}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onArrow={(producto) => toggleDetalle(producto.id)}
        onDelete={handleDelete}
        onAddItem={handleCreateDetalle}
        expandedId={productoExpandido}
        renderItem={(producto) => (
          <div
            key={producto.id}
            className={`${styles.item} ${
              productoExpandido === producto.id ? styles.expanded : ""
            }`}
          >
            <div className={styles.dd}>
              <div>
                <p>
                  <strong>{producto.nombre}</strong>
                </p>
                <p>
                  {producto.tipoProducto} | {producto.generoProducto} |
                  Categoría: {producto.categoria.nombre}
                </p>
              </div>
            </div>
            {productoExpandido === producto.id && (
              <div className={styles.detalleContainer}>
                {detallesPorProducto[producto.id] ? (
                  detallesPorProducto[producto.id].length > 0 ? (
                    detallesPorProducto[producto.id].map((detalle) => (
                      <div key={detalle.id} className={styles.detalleItem}>
                        <p>Talle: {detalle.talle?.talle}</p>
                        <p>Stock: {detalle.stock}</p>
                        <p>Color: {detalle.color}</p>
                        <div className={styles.containerButtons}>
                          <span
                            onClick={() => {
                              setDetalleActivo(detalle);
                              setModalAddImagen(true);
                            }}
                          >
                            <ImagePlus size={22} />
                          </span>
                          <span
                            onClick={() => {
                              setProductoActivoDetalle(producto);
                              setDetalleActivo(detalle);
                              setModalDetalle(true);
                            }}
                          >
                            <Pencil size={22} />
                          </span>
                          <span
                            onClick={() => {
                              handleDeleteDetalle(detalle);
                            }}
                          >
                            <Trash2 size={22} />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.text}>
                      No hay detalles para este producto
                    </p>
                  )
                ) : (
                  <p>Cargando detalles...</p>
                )}
              </div>
            )}
          </div>
        )}
      />
      <div className={styles.pagination}>
        <ArrowLeft
          className={styles.arrow}
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
        />
        <span>
          Página {page + 1} de {totalPaginas}
        </span>
        <ArrowRight
          className={styles.arrow}
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, totalPaginas - 1))
          }
        />
      </div>
      {modalOpen && (
        <ModalCrearEditarFormAdmin
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          producto={productoActivo}
        />
      )}
      {modalTalle && (
        <ModalCrearTalle
          closeModal={() => {
            setModalTalle(false);
          }}
        />
      )}
      {modalDetalle && productoActivoDetalle && (
        <ModalCrearEditarDetalle
          closeModal={() => {
            setModalDetalle(false);
            setProductoActivoDetalle(null);
            setDetalleActivo(null);
          }}
          producuto={productoActivoDetalle}
          detalle={detalleActivo}
          onSubmit={async () => {
            await handleRefreshDetalles(productoActivoDetalle!.id);
          }}
        />
      )}
      {modalAddImagen && (
        <ModalAgregarImagen
          detalle={detalleActivo!}
          closeModal={async () => {
            setModalAddImagen(false);
            if (detalleActivo?.producto.id) {
              await getDetallesProductos(detalleActivo.producto.id);
            }
          }}
        />
      )}
    </div>
  );
};
