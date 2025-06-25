import { IImagen } from "../IImagen";
import { IPrecio } from "../IPrecio";
import { IProducto } from "../IProducto";
import { ITalle } from "../ITalle";

export interface IDetalle {
  id?: number;
  disponible?: boolean;
  talle: ITalle;
  stock: number;
  producto: IProducto;
  color: string;
  estado: boolean;
  precio: IPrecio;
  imagenes?: IImagen[];
  descripcion: string;
  destacado: boolean;
}
