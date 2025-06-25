import { create } from "zustand";
import { IUsuario } from "../types/IUsuario";

interface IAuthStore {
  usuario: IUsuario | null;
  token: string | null;
  login: (usuario: IUsuario, token: string) => void;
  logout: VoidFunction;
  loadFromStorage: VoidFunction;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  usuario: null,
  token: null,

  login: (usuario, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    set({ usuario, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    set({ usuario: null, token: null });
  },

  loadFromStorage: () => {
    const token = localStorage.getItem("token");
    const rawUser = localStorage.getItem("usuario");

    if (token && rawUser) {
      try {
        const usuario = JSON.parse(rawUser);
        set({ token, usuario });
      } catch (e) {
        console.error("Error al parsear usuario guardado:", e);
        localStorage.removeItem("usuario");
      }
    }
  },
}));
