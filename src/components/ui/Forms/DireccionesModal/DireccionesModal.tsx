import { FC, useEffect, useState } from "react";
import styles from "./DireccionesModal.module.css";
import {
  crearDireccion,
  getDireccionesPorUsuario,
} from "../../../../services/direccionService";
import { IDireccion } from "../../../../types/IDireccion";

interface Props {
  cerrar: () => void;
  seleccionarDireccion: (dir: IDireccion) => void;
}

const DireccionesModal: FC<Props> = ({ cerrar, seleccionarDireccion }) => {
  const [direcciones, setDirecciones] = useState<IDireccion[]>([]);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: "",
    numero: "",
    localidad: "",
    provincia: "",
    pais: "",
    codigoPostal: "",
  });

  const storedUser = localStorage.getItem("usuario");
  const usuarioId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    const cargar = async () => {
      if (!usuarioId) return;
      const res = await getDireccionesPorUsuario(usuarioId);
      setDirecciones(res);
      if (res.length > 0 && seleccionada === null) setSeleccionada(res[0].id);
    };
    cargar();
  }, []);

  const guardar = () => {
    const dir = direcciones.find((d) => d.id === seleccionada);
    if (dir) {
      seleccionarDireccion(dir);
      cerrar();
    }
  };

  const manejarNuevaDireccion = async () => {
    const camposVacios = Object.values(nuevaDireccion).some(
      (v) => v.trim() === ""
    );
    if (camposVacios) {
      alert("Completá todos los campos.");
      return;
    }

    setLoadingGuardar(true);

    const direccionCompleta = {
      ...nuevaDireccion,
      disponible: true,
      departamento: "",
      usuario: { id: usuarioId },
    };

    try {
      const creada = await crearDireccion(direccionCompleta);
      setDirecciones((prev) => [...prev, creada]);
      setSeleccionada(creada.id);
      setMostrarFormulario(false);
      setNuevaDireccion({
        calle: "",
        numero: "",
        localidad: "",
        provincia: "",
        pais: "",
        codigoPostal: "",
      });
    } catch (error) {
      console.error("Error al crear dirección:", error);
      alert("Ocurrió un error al guardar la dirección.");
    } finally {
      setLoadingGuardar(false);
    }
  };

  return (
    <div className={styles.fondoModal}>
      <div className={styles.modal}>
        <h2 className={styles.titulo}>Elegí dónde recibir tus compras</h2>

        {mostrarFormulario ? (
          <div className={styles.formulario}>
            {[
              "Calle",
              "Número",
              "Localidad",
              "Provincia",
              "País",
              "Código Postal",
            ].map((label, idx) => {
              const key = Object.keys(nuevaDireccion)[
                idx
              ] as keyof typeof nuevaDireccion;
              return (
                <input
                  key={key}
                  type="text"
                  placeholder={label}
                  className={styles.input}
                  value={nuevaDireccion[key]}
                  onChange={(e) =>
                    setNuevaDireccion({
                      ...nuevaDireccion,
                      [key]: e.target.value,
                    })
                  }
                />
              );
            })}

            <div className={styles.botonesFila}>
              <button
                onClick={() => setMostrarFormulario(false)}
                className={styles.botonCancelar}
              >
                Cancelar
              </button>
              <button
                onClick={manejarNuevaDireccion}
                className={styles.botonGuardar}
                disabled={loadingGuardar}
              >
                {loadingGuardar ? "Guardando..." : "Guardar dirección"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.listaDirecciones}>
              {direcciones.map((dir) => (
                <label
                  key={dir.id}
                  className={`${styles.opcionDireccion} ${
                    seleccionada === dir.id ? styles.opcionActiva : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="direccion"
                    className={styles.radio}
                    checked={seleccionada === dir.id}
                    onChange={() => setSeleccionada(dir.id)}
                  />
                  <div>
                    <p className={styles.labelDireccion}>
                      {dir.calle} {dir.numero}
                    </p>
                    <p className={styles.textoDireccion}>
                      CP: {dir.codigoPostal} - {dir.localidad}, {dir.provincia},{" "}
                      {dir.pais}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setMostrarFormulario(true)}
              className={styles.agregarLink}
            >
              + Agregar nueva dirección
            </button>

            <div className={styles.botonesFinal}>
              <button onClick={cerrar} className={styles.botonCancelar}>
                Cancelar
              </button>
              <button onClick={guardar} className={styles.botonGuardar}>
                Guardar cambios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DireccionesModal;
