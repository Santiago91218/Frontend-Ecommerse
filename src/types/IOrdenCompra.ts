import { IDireccion } from "./IDireccion";
import { IOrdenCompraDetalle } from "./IOrdenCompraDetalle";
import { IUsuario } from "./IUsuario";

export interface IOrdenCompra {
  id: number;
  disponible: boolean;
  total: number;
  usuario: IUsuario;
  fechaCompra: string;
  direccionEnvio: IDireccion;
  detalles: IOrdenCompraDetalle[];
}
