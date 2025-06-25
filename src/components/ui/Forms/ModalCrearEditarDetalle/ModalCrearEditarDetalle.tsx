import { FC, useEffect, useState } from "react";
import { IDetalle } from "../../../../types/detalles/IDetalle";
import styles from "./ModalCrearEditarDetalle.module.css";
import { ServiceTalle } from "../../../../services/talleService";
import { ITalle } from "../../../../types/ITalle";
import { ServiceDetalle } from "../../../../services/serviceDetalle";
import { ServicePrecio } from "../../../../services/servicePrecio";
import { ServiceDescuento } from "../../../../services/serviceDescuento";
import { IPrecio } from "../../../../types/IPrecio";
import { IProducto } from "../../../../types/IProducto";
import Swal from "sweetalert2";

interface IProps {
  closeModal: () => void;
  detalle?: IDetalle | null;
  producuto: IProducto;
  onSubmit?: (detalle: IDetalle) => void;
}

export const ModalCrearEditarDetalle: FC<IProps> = ({
  closeModal,
  detalle,
  onSubmit,
  producuto,
}) => {
  const [formState, setFormState] = useState<Omit<IDetalle, "id">>({
    color: detalle?.color || "",
    descripcion: detalle?.descripcion || "",
    estado: detalle?.estado ?? true,
    imagenes: detalle?.imagenes ?? [],
    precio: detalle?.precio || {
      precioCompra: 0,
      precioVenta: 0,
      descuento: {
        fechaInicio: "",
        fechaFin: "",
        descuento: 0,
      },
    },
    producto: detalle?.producto || producuto,
    stock: detalle?.stock || 0,
    talle: { id: 0, talle: "" },
    destacado: detalle?.destacado ?? false,
  });

  const [tallesDisponibles, setTallesDisponibles] = useState<ITalle[]>([]);
  const [usarDescuento, setUsarDescuento] = useState<boolean>(
    !!detalle?.precio?.descuento?.id
  );
  const serviceTalle = new ServiceTalle();
  const serviceDetalle = new ServiceDetalle();
  const servicePrecio = new ServicePrecio();
  const serviceDescuento = new ServiceDescuento();

  useEffect(() => {
    const getAllTalles = async () => {
      const talles = await serviceTalle.getTalles();
      setTallesDisponibles(talles);
    };
    getAllTalles();
  }, []);

  const handleGuardarDetalle = async (detalle: IDetalle) => {
    try {
      let descuentoId = 0;
      if (detalle.precio.descuento && detalle.precio.descuento.descuento > 0) {
        if (detalle.precio.descuento.id && detalle.precio.descuento.id > 0) {
          await serviceDescuento.editarDescuento(detalle.precio.descuento);
          descuentoId = detalle.precio.descuento.id;
        } else {
          const responseDescuento = await serviceDescuento.crearDescuento(
            detalle.precio.descuento
          );
          descuentoId = responseDescuento.id;
        }
      }

      const precioData: IPrecio = {
        precioCompra: detalle.precio.precioCompra,
        precioVenta: detalle.precio.precioVenta,
        descuento: descuentoId
          ? {
              id: descuentoId,
              fechaInicio: detalle.precio.descuento?.fechaInicio || "",
              fechaFin: detalle.precio.descuento?.fechaFin || "",
              descuento: detalle.precio.descuento?.descuento || 0,
            }
          : null,
      };

      let precioId = 0;
      if (detalle.precio.id && detalle.precio.id > 0) {
        await servicePrecio.editarPrecio({
          id: detalle.precio.id,
          ...precioData,
        });
        precioId = detalle.precio.id;
      } else {
        const responsePrecio = await servicePrecio.crearPrecio(precioData);
        precioId = responsePrecio.id;
      }

      if (!detalle.producto && !producuto) {
        console.error("Producto es requerido");
        return;
      }

      const detalleData = {
        id: detalle.id,
        color: detalle.color,
        descripcion: detalle.descripcion,
        estado: detalle.estado,
        imagenes: detalle?.imagenes ?? [],
        precio: { id: precioId },
        producto: { id: producuto.id },
        stock: detalle.stock,
        talle: { id: detalle.talle.id },
        destacado: detalle.destacado,
      };

      if (detalle.id && detalle.id > 0) {
        await serviceDetalle.editarDetalle(detalle.id, detalleData);
        Swal.fire({
          title: "Detalle editado!",
          icon: "success",
        });
      } else {
        await serviceDetalle.crearDetalle(detalleData);
        Swal.fire({
          title: "Detalle creado!",
          icon: "success",
        });
      }

      await serviceDetalle.getDetallesPorProducto(producuto.id);
    } catch (error) {
      console.error("Error al guardar detalle", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al guardar el detalle.",
        icon: "error",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const detalleToSave: IDetalle = {
      ...detalle,
      ...formState,
      precio: {
        ...formState.precio,
        descuento: usarDescuento
          ? formState.precio.descuento
          : {
              fechaInicio: "",
              fechaFin: "",
              descuento: 0,
            },
      },
    };

    await handleGuardarDetalle(detalleToSave);
    onSubmit?.(detalleToSave);
    closeModal();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      precio: {
        ...prev.precio,
        [name]:
          name === "precioCompra" || name === "precioVenta"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      precio: {
        ...prev.precio,
        descuento: {
          ...prev.precio.descuento,
          [name]: name === "descuento" ? Number(value) : value,
        },
      },
    }));
  };

  const handleTalleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedTalle = tallesDisponibles.find((t) => t.id === selectedId);
    if (selectedTalle) {
      setFormState((prev) => ({
        ...prev,
        talle: selectedTalle,
      }));
    }
  };

  useEffect(() => {
    setFormState({
      color: detalle?.color || "",
      descripcion: detalle?.descripcion || "",
      estado: detalle?.estado ?? true,
      imagenes: detalle?.imagenes || [],
      precio: detalle?.precio || {
        precioCompra: 0,
        precioVenta: 0,
        descuento: {
          fechaInicio: "",
          fechaFin: "",
          descuento: 0,
        },
      },
      producto: detalle?.producto || producuto,
      stock: detalle?.stock || 0,
      talle: detalle?.talle || { talle: "" },
      destacado: detalle?.destacado ?? false,
    });
  }, [detalle, producuto]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{detalle ? "Editar Detalle" : "Crear Detalle"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Color</label>
            <input
              type="text"
              name="color"
              placeholder="Ingrese el color"
              value={formState.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="Ingrese el stock"
              value={formState.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Ingrese la descripción"
              value={formState.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Talle</label>
            <select
              name="talle"
              value={formState.talle.id}
              onChange={handleTalleChange}
            >
              <option disabled value={0}>
                Select talle
              </option>
              {tallesDisponibles.map((talle) => (
                <option key={talle.id} value={talle.id}>
                  {talle.talle}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="destacado"
                checked={formState.destacado}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    destacado: e.target.checked,
                  }))
                }
              />
              <span>Marcar como destacado</span>
            </label>
          </div>

          <div className={styles.formGroup}>
            <h2>Precio</h2>
            <label>Precio Compra</label>
            <input
              type="number"
              name="precioCompra"
              value={formState.precio.precioCompra}
              onChange={handlePrecioChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <h2>&nbsp;</h2>
            <label>Precio Venta</label>
            <input
              type="number"
              name="precioVenta"
              value={formState.precio.precioVenta}
              onChange={handlePrecioChange}
              required
            />
          </div>

          <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
            <h2>Descuento</h2>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={usarDescuento}
                onChange={() => setUsarDescuento((prev) => !prev)}
              />
              <span>Usar descuento</span>
            </label>
          </div>

          {usarDescuento && (
            <>
              <div className={styles.formGroup}>
                <label>Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formState.precio.descuento?.fechaInicio}
                  onChange={handleDescuentoChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formState.precio.descuento?.fechaFin}
                  onChange={handleDescuentoChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Porcentaje Descuento (%)</label>
                <input
                  type="number"
                  name="descuento"
                  value={formState.precio.descuento?.descuento}
                  onChange={handleDescuentoChange}
                  required
                />
              </div>
            </>
          )}

          <div
            className={styles.buttonContainer}
            style={{ gridColumn: "span 2" }}
          >
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
