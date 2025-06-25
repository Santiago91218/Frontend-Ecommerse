import { IDetalle } from "./detalles/IDetalle";

export interface IImagen {
  id?: number;
  disponible?: boolean;
  url: string;
  alt: string;
  detalle: IDetalle;
}
