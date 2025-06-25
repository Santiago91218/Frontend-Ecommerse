import { IUsuario } from "./IUsuario";

export interface IDireccion {
  id: number;
  disponible: boolean;
  localidad: string;
  pais: string;
  provincia: string;
  departamento: string;
  codigoPostal: string;
  usuarios: IUsuario[];
  calle: string;
  numero: string;
}
