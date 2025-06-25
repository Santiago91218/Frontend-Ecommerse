import { FC, useEffect, useState, useRef } from "react";
import { IDireccion } from "../../../types/IDireccion";
import { IUsuario } from "../../../types/IUsuario";
import { getDireccionesPorUsuario } from "../../../services/direccionService";
import styles from "./DireccionesCliente.module.css";

interface IProps {
  usuario: IUsuario;
  direccionSeleccionadaId: number | null;
  setDireccionSeleccionadaId: (id: number) => void;
  onAgregarDireccionClick: () => void;
  recargar: boolean;
}

const DireccionesCliente: FC<IProps> = ({
  usuario,
  direccionSeleccionadaId,
  setDireccionSeleccionadaId,
  onAgregarDireccionClick,
  recargar,
}) => {
  const [direcciones, setDirecciones] = useState<IDireccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cargarDirecciones = async () => {
      try {
        const direccionesUsuario = await getDireccionesPorUsuario(usuario.id);
        if (Array.isArray(direccionesUsuario)) {
          setDirecciones(direccionesUsuario);
          if (
            direccionesUsuario.length > 0 &&
            direccionSeleccionadaId === null
          ) {
            setDireccionSeleccionadaId(direccionesUsuario[0].id);
          }
        } else {
          setDirecciones([]);
        }
      } catch {
        setDirecciones([]);
      } finally {
        setLoading(false);
      }
    };

    cargarDirecciones();
  }, [usuario.id, recargar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p className={styles.loading}>Cargando...</p>;

  const direccionActual = direcciones.find(
    (d) => d.id === direccionSeleccionadaId
  );

  return (
    <div className={styles.contenedor} ref={dropdownRef}>
      <p className={styles.titulo}>Dirección</p>

      {direcciones.length === 0 ? (
        <p className={styles.noDirecciones}>No hay direcciones registradas.</p>
      ) : (
        <div className={styles.dropdownContainer}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={styles.dropdownBoton}
          >
            {direccionActual ? (
              <span>
                {direccionActual.calle} {direccionActual.numero},{" "}
                {direccionActual.localidad}, {direccionActual.provincia}
              </span>
            ) : (
              <span className={styles.placeholder}>
                Seleccioná una dirección
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownLista}>
              {direcciones.map((direccion) => (
                <div
                  key={direccion.id}
                  onClick={() => {
                    setDireccionSeleccionadaId(direccion.id);
                    setDropdownOpen(false);
                  }}
                  className={`${styles.itemLista} ${
                    direccionSeleccionadaId === direccion.id
                      ? styles.itemSeleccionado
                      : ""
                  }`}
                >
                  {direccion.calle} {direccion.numero}, {direccion.localidad},{" "}
                  {direccion.provincia}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={styles.botonAgregar}
        onClick={onAgregarDireccionClick}
      >
        + Agregar nueva dirección
      </button>
    </div>
  );
};

export default DireccionesCliente;
