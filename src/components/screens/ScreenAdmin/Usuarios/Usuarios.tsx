import { useEffect, useState } from "react";
import styles from "./Usuarios.module.css";
import { IUsuario } from "../../../../types/IUsuario";
import { AdminTable } from "../../../ui/AdminTable/AdminTable";
import { ModalCrearEditarUsuario } from "../../../ui/Forms/ModalCrearEditarUsuario/ModalCrearEditarUsuario";
import { ServiceUsuario } from "../../../../services/usuarioService";
import Swal from "sweetalert2";
import { IUsuarioDTO } from "../../../../types/IUsuarioDTO";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Usuarios = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarios, setUsuarios] = useState<IUsuarioDTO[]>([]);
  const [page, setPage] = useState(0); 
  const [totalPaginas, setTotalPaginas] = useState(0); 
  const [usuarioActivo, setUsuarioActivo] = useState<IUsuarioDTO | null>(null);
  const usuarioService = new ServiceUsuario();

  useEffect(() => {
    fetchUsuarios(page);
  }, [page]);

  const fetchUsuarios = async (pagina: number) => {
    try {
      const data = await usuarioService.getUsuariosPaginado(pagina);
      setUsuarios(data.content);
      setTotalPaginas(data.totalPages);
    } catch (error) {
      console.error("Error al cargar ususarios paginadas", error);
    }
  };

  const handleEdit = (usuario: IUsuarioDTO) => {
    setUsuarioActivo(usuario);
    setModalOpen(true);
  };

  const handleDelete = async (usuario: IUsuarioDTO) => {
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
        await usuarioService.eliminarUsuario(usuario.id!);
        await fetchUsuarios(page);
        Swal.fire({
          title: "¡Eliminado!",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (usuario: IUsuario) => {
    try {
      if (usuario.id) {
        await usuarioService.editarUsuarioDTO(usuario.id, usuario);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? usuario : u))
        );
      } else {
        const nuevoUsuario = await usuarioService.crearUsuario(usuario);
        setUsuarios((prev) => [...prev, nuevoUsuario]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error al guardar usuario", error);
    }
  };

  return (
    <div className={styles.container}>
      <AdminTable<IUsuarioDTO>
        data={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderItem={(usuario) => (
          <div className={styles.item}>
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
            </p>
            <p>
              <strong>Email:</strong> {usuario.email}
            </p>
            <p>
              <strong>Rol:</strong> {usuario.rol}
            </p>
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
        <ModalCrearEditarUsuario
          usuario={usuarioActivo}
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
