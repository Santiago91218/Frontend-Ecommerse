import axios, { AxiosResponse } from "axios";
import { IProducto } from "../types/IProducto";

const productoService = import.meta.env.VITE_URL_PRODUCTOS;

export class ServiceProducto {
  private baseURL: string;

  constructor() {
    this.baseURL = productoService;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async getProductos(): Promise<IProducto[]> {
    const url = `${this.baseURL}`;
    const response: AxiosResponse<IProducto[]> = await axios.get(url);
    return response.data;
  }

  async getProductosPaginado(page: number) {
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

  public async getProductoById(id: number): Promise<IProducto> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<IProducto> = await axios.get(url);
    return response.data;
  }

  public async crearProducto(producto: IProducto): Promise<IProducto> {
    const url = `${this.baseURL}`;
    if (producto.id === 0) {
      producto.id = Date.now();
    }
    console.log("Datos que se envían:", producto);
    const response: AxiosResponse<IProducto> = await axios.post(url, producto, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async editarProducto(
    id: number,
    producto: IProducto
  ): Promise<IProducto> {
    const url = `${this.baseURL}/${id}`;
    const response: AxiosResponse<IProducto> = await axios.put(url, producto, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  public async eliminarProducto(id: number): Promise<void> {
    const url = `${this.baseURL}/${id}`;
    await axios.delete(url, {
      headers: this.getAuthHeaders(),
    });
  }
}
