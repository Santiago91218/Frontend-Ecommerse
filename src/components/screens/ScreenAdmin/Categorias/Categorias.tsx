import { useEffect, useState } from "react";
import styles from "./Categorias.module.css";
import { ModalCrearEditarCategoria } from "../../../ui/Forms/ModalCrearEditarCategoria/ModalCrearEditarCategoria";
import { ICategoria } from "../../../../types/ICategoria";
import { AdminTable } from "../../../ui/AdminTable/AdminTable";
import { ServiceCategoria } from "../../../../services/categoriaService";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Swal from "sweetalert2";

export const Categorias = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [page, setPage] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [categoriaActiva, setCategoriaActiva] = useState<ICategoria | null>(
    null
  );
  const categoriaService = new ServiceCategoria();

  useEffect(() => {
    fetchCategorias(page);
  }, [page]);

  const fetchCategorias = async (pagina: number) => {
    try {
      const data = await categoriaService.getCategoriasPaginado(pagina);
      setCategorias(data.content);
      setTotalPaginas(data.totalPages);
    } catch (error) {
      console.error("Error al cargar categorias paginadas", error);
    }
  };

  const handleAdd = () => {
    setCategoriaActiva(null);
    setModalOpen(true);
  };

  const handleEdit = (categoria: ICategoria) => {
    setCategoriaActiva(categoria);
    setModalOpen(true);
  };

  const handleDelete = async (categoria: ICategoria) => {
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
        await categoriaService.eliminarCategoria(categoria.id);
        await fetchCategorias(page);
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar categoría", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (categoria: ICategoria) => {
    try {
      if (categoria.id) {
        await categoriaService.editarCategoria(categoria.id, categoria);
      } else {
        await categoriaService.crearCategoria(categoria);
      }
      fetchCategorias(page);
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar categoría", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminTable<ICategoria>
        data={categorias}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderItem={(cat) => (
          <p>
            <strong>Nombre:</strong> {cat.nombre}
          </p>
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
        <ModalCrearEditarCategoria
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          categoria={categoriaActiva}
        />
      )}
    </div>
  );
};
