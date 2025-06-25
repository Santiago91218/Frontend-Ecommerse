import { RolUsuario } from "./IUsuario";

export interface IUsuarioDTO {
  id?: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}
