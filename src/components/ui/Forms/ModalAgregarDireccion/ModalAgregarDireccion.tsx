import { FC, useEffect, useState } from "react";
import styles from "./ModalAgregarDireccion.module.css";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { IUsuario } from "../../../../types/IUsuario";
import { crearDireccion } from "../../../../services/direccionService";

interface IProps {
  usuario: IUsuario;
  onDireccionAgregada: () => void;
  onClose: () => void;
}

const schema = Yup.object().shape({
  calle: Yup.string().required("La calle es obligatoria"),
  numero: Yup.string().required("El número es obligatorio"),
  departamento: Yup.string(),
  codigoPostal: Yup.string().required("El código postal es obligatorio"),
  localidad: Yup.string().required("La localidad es obligatoria"),
  provincia: Yup.string().required("La provincia es obligatoria"),
  pais: Yup.string().required("El país es obligatorio"),
});

const ModalAgregarDireccion: FC<IProps> = ({
  usuario,
  onDireccionAgregada,
  onClose,
}) => {
  const [form, setForm] = useState({
    calle: "",
    numero: "",
    departamento: "",
    codigoPostal: "",
    localidad: "",
    provincia: "",
    pais: "Argentina",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [provincias, setProvincias] = useState<string[]>([]);
  const [localidades, setLocalidades] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((res) => res.json())
      .then((data) => {
        const nombres = data.provincias.map((p: any) => p.nombre);
        setProvincias(nombres);
      });
  }, []);

  useEffect(() => {
    if (form.provincia) {
      fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=${form.provincia}&campos=nombre&max=200`
      )
        .then((res) => res.json())
        .then((data) => {
          const nombresUnicos = [
            ...new Set(data.localidades.map((l: any) => l.nombre)),
          ] as string[];
          setLocalidades(nombresUnicos);
        });
    } else {
      setLocalidades([]);
      setForm((prev) => ({ ...prev, localidad: "" }));
    }
  }, [form.provincia]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = async (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    try {
      await schema.validateAt(name, form);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schema.validate(form, { abortEarly: false });

      const nuevaDireccion = {
        ...form,
        disponible: true,
        departamento:
          form.departamento.trim() === "" ? "N/C" : form.departamento,
        usuarios: [],
        usuario: { id: usuario.id },
      };

      await crearDireccion(nuevaDireccion);

      Swal.fire({
        title: "Dirección guardada",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: false,
        backdrop: false,
      });

      onDireccionAgregada();
      onClose();
    } catch (err: any) {
      if (err.inner) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((e: any) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Agregar nueva dirección</h2>
        <form onSubmit={handleSubmit}>
          {[
            {
              id: "pais",
              label: "País",
              type: "select",
              options: ["Argentina"],
            },
            {
              id: "provincia",
              label: "Provincia",
              type: "select",
              options: provincias,
            },
            {
              id: "localidad",
              label: "Localidad",
              type: "select",
              options: localidades,
              disabled: !form.provincia,
            },
            { id: "codigoPostal", label: "Código Postal" },
            { id: "calle", label: "Calle" },
            { id: "numero", label: "Número" },
            { id: "departamento", label: "Departamento (opcional)" },
          ].map(({ id, label, type, options, disabled }) => (
            <div className={styles.formGroup} key={id}>
              <label htmlFor={id}>{label}</label>
              {type === "select" ? (
                <select
                  id={id}
                  name={id}
                  value={(form as any)[id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={disabled}
                >
                  <option value="">Seleccione una opción</option>
                  {options?.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={id}
                  name={id}
                  value={(form as any)[id]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
              {errors[id] && <span className={styles.error}>{errors[id]}</span>}
            </div>
          ))}

          <div className={styles.botones}>
            <button
              type="button"
              className={`${styles.boton} ${styles.botonCancelar}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.boton} ${styles.botonAgregar}`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarDireccion;
