import axios, { AxiosResponse } from "axios";
import { IUsuario } from "../types/IUsuario";
import { IUsuarioDTO } from "../types/IUsuarioDTO";
const usuarioService = import.meta.env.VITE_URL_USUARIO;

export class ServiceUsuario {
  private baseURL: string;

  constructor() {
    this.baseURL = usuarioService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getUsuarios(): Promise<IUsuario[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<IUsuario[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getUsuariosPaginado(page: number) {
    const url = `${this.baseURL}/paginado?page=${page}&size=10`;
    try {
      const res = await axios.get(url, {
        headers: this.getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getUsuarioById(id: number): Promise<IUsuario> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<IUsuario> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getUsuariosDTO(): Promise<IUsuarioDTO[]> {
    const url = `${this.baseURL}/DTO`;
    const response: AxiosResponse<IUsuarioDTO[]> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async getUsuarioByIdDTO(id: number): Promise<IUsuarioDTO> {
    const url = `${this.baseURL}/DTO/${id}`;
    const response: AxiosResponse<IUsuarioDTO> = await axios.get(url, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarUsuarioDTO(
    id: number,
    usuario: IUsuarioDTO
  ): Promise<IUsuarioDTO> {
    const url = `${this.baseURL}/DTO/${id}`;
    const response: AxiosResponse<IUsuarioDTO> = await axios.put(url, usuario, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async crearUsuario(usuario: IUsuario): Promise<IUsuario> {
    const url = `${this.baseURL}`;
    if (usuario.id === 0) {
      usuario.id = Date.now();
    }
    console.log("Datos que se envían:", usuario);
    const response: AxiosResponse<IUsuario> = await axios.post(url, usuario, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarUsuario(id: number, usuario: IUsuario): Promise<IUsuario> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<IUsuario> = await axios.put(url, usuario, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarUsuario(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
