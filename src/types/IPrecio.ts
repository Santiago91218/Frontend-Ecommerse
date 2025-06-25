import { IDescuento } from "./IDescuento";

export interface IPrecio {
  id?: number;
  disponible?: boolean;
  precioCompra: number;
  precioVenta: number;
  descuento: IDescuento;
}
