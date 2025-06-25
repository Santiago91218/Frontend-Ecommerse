import axios, { AxiosResponse } from "axios";
import { ICategoria } from "../types/ICategoria";
const categoriaService = import.meta.env.VITE_URL_CATEGORIA;

export class ServiceCategoria {
  private baseURL: string;

  constructor() {
    this.baseURL = categoriaService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getCategorias(): Promise<ICategoria[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<ICategoria[]> = await axios.get(url);
    return response.data;
  }

  async getCategoriasPaginado(page: number) {
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

  public async getCategoriaById(id: number): Promise<ICategoria> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ICategoria> = await axios.get(url);
    return response.data;
  }

  public async crearCategoria(categoria: ICategoria): Promise<ICategoria> {
    const url = `${this.baseURL}`;
    if (categoria.id === 0) {
      categoria.id = Date.now();
    }
    console.log("Datos que se envían:", categoria);
    const response: AxiosResponse<ICategoria> = await axios.post(
      url,
      categoria,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  public async editarCategoria(
    id: number,
    categoria: ICategoria
  ): Promise<ICategoria> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<ICategoria> = await axios.put(
      url,
      categoria,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  }

  public async eliminarCategoria(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
