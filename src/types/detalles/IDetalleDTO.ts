import { IImagen } from "../IImagen";
import { IPrecio } from "../IPrecio";
import { IProducto } from "../IProducto";
import { ITalle } from "../ITalle";

export interface IDetalleDTO {
  id?: number;
  disponible?: boolean;
  color: string;
  producto: IProducto;
  precio: IPrecio;
  imagenPrincipal: IImagen;
  talle: ITalle;
}
