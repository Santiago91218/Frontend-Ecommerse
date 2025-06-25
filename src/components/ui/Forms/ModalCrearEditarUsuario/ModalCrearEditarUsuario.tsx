import { FC, useState } from "react";
import styles from "./ModalCrearEditarUsuario.module.css";
import { IUsuario, RolUsuario } from "../../../../types/IUsuario";
import { IUsuarioDTO } from "../../../../types/IUsuarioDTO";
import Swal from "sweetalert2";

interface IProps {
  usuario?: IUsuarioDTO | null;
  closeModal: () => void;
  onSubmit?: (usuario: IUsuario) => void;
}

export const ModalCrearEditarUsuario: FC<IProps> = ({
  usuario,
  closeModal,
  onSubmit,
}) => {
  const [formState, setFormState] = useState<IUsuario>({
    id: usuario?.id ?? Date.now(),
    nombre: usuario?.nombre || "",
    email: usuario?.email || "",
    rol: usuario?.rol || RolUsuario.CLIENTE,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onSubmit?.(formState);
      Swal.fire({
        title: "Usuario editado!",
        icon: "success",
      });
      closeModal();
    } catch (error) {
      console.error("Error al guardar el usuario", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el usuario.",
        icon: "error",
      });
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>{usuario ? "Editar Usuario" : "Crear Usuario"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            value={formState.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <select
            name="rol"
            value={formState.rol}
            onChange={handleChange}
            required
          >
            <option value={RolUsuario.ADMINISTRADOR}>Administrador</option>
            <option value={RolUsuario.CLIENTE}>Cliente</option>
          </select>

          <div className={styles.actions}>
            <button
              className={styles.cancelButton}
              type="button"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button className={styles.submitButton} type="submit">
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
