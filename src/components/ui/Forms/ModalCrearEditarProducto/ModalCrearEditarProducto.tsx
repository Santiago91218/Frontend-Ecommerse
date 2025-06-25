import { FC, useEffect, useState } from "react";
import {
  GeneroProducto,
  IProducto,
  TipoProducto,
} from "../../../../types/IProducto";
import styles from "./ModalCrearEditarProducto.module.css";
import { ServiceCategoria } from "../../../../services/categoriaService";
import { ICategoria } from "../../../../types/ICategoria";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  producto?: IProducto | null;
  onSubmit?: (producto: IProducto) => void;
}

const ModalCrearEditarProducto: FC<IProps> = ({
  closeModal,
  producto,
  onSubmit,
}) => {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [formState, setFormState] = useState<Omit<IProducto, "id">>({
    disponible: producto?.disponible ?? true,
    nombre: producto?.nombre || "",
    tipoProducto: producto?.tipoProducto || TipoProducto.REMERA,
    generoProducto: producto?.generoProducto || GeneroProducto.MASCULINO,
    categoria: producto?.categoria || { id: 0, nombre: "", descripcion: "" },
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const serviceCategoria = new ServiceCategoria();
        const categoriasData = await serviceCategoria.getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar categorías", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (producto?.id) {
        await onSubmit?.({ ...formState, id: producto.id });
        Swal.fire({
          title: "Producto editado!",
          icon: "success",
        });
      } else {
        const newProducto = { ...formState };
        await onSubmit?.(newProducto as IProducto);
        Swal.fire({
          title: "Producto creado!",
          icon: "success",
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error al guardar el producto", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el producto.",
        icon: "error",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");

      setFormState((prev) => {
        const parentValue = prev[parentKey as keyof typeof prev];

        if (typeof parentValue === "object" && parentValue !== null) {
          return {
            ...prev,
            [parentKey]: {
              ...parentValue,
              [childKey]: value,
            },
          };
        }

        return prev;
      });
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{producto ? "Editar producto" : "Crear producto"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Título</label>
            <input
              placeholder="Ingrese el nombre"
              type="text"
              name="nombre"
              value={formState.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Categoría</label>

            <select
              value={formState.categoria.id}
              onChange={(e) => {
                console.log(e.target);
                const id = Number(e.target.value);
                const categoria = categorias.find((cat) => cat.id === id);
                if (categoria) {
                  setFormState((prev) => ({
                    ...prev,
                    categoria: categoria,
                  }));
                }
              }}
              required
            >
              <option disabled value={0}>
                {"Select categoria"}
              </option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Tipo</label>
            <select
              name="tipoProducto"
              value={formState.tipoProducto}
              onChange={handleChange}
              required
            >
              <option value={TipoProducto.REMERA}>Remera</option>
              <option value={TipoProducto.ZAPATILLAS}>Zapatillas</option>
              <option value={TipoProducto.BUZO}>Buzo</option>
              <option value={TipoProducto.PANTALON}>Pantalón</option>
              <option value={TipoProducto.CAMPERA}>Campera</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Género</label>
            <select
              name="generoProducto"
              value={formState.generoProducto}
              onChange={handleChange}
              required
            >
              <option value={GeneroProducto.MASCULINO}>Masculino</option>
              <option value={GeneroProducto.FEMENINO}>Femenino</option>
              <option value={GeneroProducto.INFANTIL}>Infantil</option>
            </select>
          </div>

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

export default ModalCrearEditarProducto;
