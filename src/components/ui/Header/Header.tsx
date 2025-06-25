import { ShoppingCart, User, LogOut } from "lucide-react";
import styles from "./Header.module.css";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/useAuthStore";

const Header = () => {
  const navigate = useNavigate();
  const usuario = useAuthStore((s) => s.usuario);
  const logout = useAuthStore((s) => s.logout);

  const handleNavigate = (path: string) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClikUserButton = () => {
    if (usuario) {
      handleNavigate("user");
    } else {
      handleNavigate("login");
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div onClick={() => handleNavigate("home")} className={styles.logo}>
        <img src={logo} alt="Logo" />
      </div>

      <div className={styles.navContainer}>
        <div onClick={() => handleNavigate("hombre")}>
          <p>Hombres</p>
        </div>
        <div onClick={() => handleNavigate("mujer")}>
          <p>Mujeres</p>
        </div>
        <div onClick={() => handleNavigate("nino-a")}>
          <p>Niños</p>
        </div>
        <div onClick={() => handleNavigate("destacados")}>
          <p>Destacados</p>
        </div>
      </div>

      <div className={styles.iconsContainer}>
        <div onClick={() => handleNavigate("cart")}>
          <ShoppingCart size={32} />
        </div>

        {usuario ? (
          <div className={styles.usuarioContainer}>
            <User size={32} onClick={handleClikUserButton} />
            <LogOut
              size={28}
              className={styles.logoutIcon}
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            />
          </div>
        ) : (
          <div onClick={() => handleClikUserButton()}>
            <User size={32} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
