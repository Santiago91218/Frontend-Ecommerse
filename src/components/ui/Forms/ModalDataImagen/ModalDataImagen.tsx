import { FC, useState } from "react";
import styles from "./ModalDataImagen.module.css";
import { ServiceImagen } from "../../../../services/imagenService";
import { IDetalle } from "../../../../types/detalles/IDetalle";
import { IImagen } from "../../../../types/IImagen";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  detalle: IDetalle;
  onImagenCreada: () => void;
}

export const ModalDataImagen: FC<IProps> = ({
  closeModal,
  detalle,
  onImagenCreada,
}) => {
  const [formState, setFormState] = useState<{ url: string; alt: string }>({
    url: "",
    alt: "",
  });
  const imgService = new ServiceImagen();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload: IImagen = {
        ...formState,
        detalle,
      };

      await imgService.crearImagen(payload);
      Swal.fire({
        title: "Imagen Añadida!",
        icon: "success",
      });
      closeModal();
      onImagenCreada();
    } catch (error) {
      console.error("Error al crear imagen", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar Imagen.",
        icon: "error",
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>Agregar Imagen</h2>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <input
            className={styles.formInput}
            onChange={handleChange}
            type="text"
            name="url"
            value={formState.url}
            placeholder="Ingrese la URL de la imagen"
            required
          />
          <input
            className={styles.formInput}
            onChange={handleChange}
            type="text"
            name="alt"
            value={formState.alt}
            placeholder="Ingrese el alt"
            required
          />

          <div className={styles.buttonContainer}>
            <button
              type="button"
              className={styles.cancelButton}
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
