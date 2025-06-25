import { IOrdenCompra } from "./IOrdenCompra";
import { IProducto } from "./IProducto";

export interface IOrdenCompraDetalle {
  id: number;
  disponible: boolean;
  ordenCompra: IOrdenCompra;
  producto: IProducto;
  cantidad: number;
}
