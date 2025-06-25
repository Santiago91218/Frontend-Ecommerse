export interface IUsuario {
  id: number;
  disponible: boolean;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export enum RolUsuario {
  ADMINISTRADOR = "ADMINISTRADOR",
  CLIENTE = "CLIENTE",
}
