import styles from "./ScreenLoginSignup.module.css";
import logo from "../../assets/logo.png";
import { useEffect, useState } from "react";
import { Lock, Mail, User, BadgePlus } from "lucide-react";
import { loginService } from "../../../services/loginService";
import { registerService } from "../../../services/registerService";
import { useAuthStore } from "../../../store/useAuthStore";
import { RolUsuario } from "../../../types/IUsuario";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  nombre: yup.string().required("Nombre obligatorio"),
  dni: yup
    .string()
    .matches(/^\d+$/, "Debe contener solo números")
    .min(7, "Mínimo 7 dígitos")
    .max(8, "Máximo 8 dígitos")
    .required("DNI obligatorio"),
  email: yup.string().email("Email inválido").required("Email obligatorio"),
  contrasenia: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("Contraseña obligatoria"),
  confirmarContrasenia: yup
    .string()
    .oneOf([yup.ref("contrasenia")], "Las contraseñas no coinciden")
    .required("Confirmar contraseña es obligatorio"),
});

const ScreenLoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  useEffect(() => {
    if (action === "Sign Up") {
      validationSchema
        .validate(
          { nombre, dni, email, contrasenia, confirmarContrasenia },
          { abortEarly: false }
        )
        .then(() => setErrors({}))
        .catch((err) => {
          const newErrors: { [key: string]: string } = {};
          err.inner.forEach((e: any) => {
            newErrors[e.path] = e.message;
          });
          setErrors(newErrors);
        });
    }
  }, [nombre, dni, email, contrasenia, confirmarContrasenia, action]);

  const handleLogin = async () => {
    try {
      const res = await loginService({ email, contrasenia });

      if (!res.usuario.disponible) {
        alert("El usuario no esta disponible");
        return; // No continuar con el login
      }

      // 1. Guardar el token
      localStorage.setItem("token", res.token);

      // 2. Guardar en store
      login(res.usuario, res.token);

      // 3. Redirigir
      navigate("/home");
    } catch {
      alert("Email o contraseña incorrectos");
    }
  };

  const handleRegister = async () => {
    try {
      await validationSchema.validate(
        { nombre, dni, email, contrasenia, confirmarContrasenia },
        { abortEarly: false }
      );
      await registerService({
        nombre,
        email,
        contrasenia,
        dni: Number(dni),
        rol: RolUsuario.CLIENTE,
      });
      alert("Usuario registrado correctamente");
      setAction("Login");
    } catch (err: any) {
      if (err.name === "ValidationError") {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((e: any) => {
          newErrors[e.path] = e.message;
        });
        setErrors(newErrors);
      } else {
        alert("Error al registrar usuario");
      }
    }
  };

  const renderError = (field: string) => {
    return touched[field] && errors[field] ? (
      <p className={styles.errorMessage}>{errors[field]}</p>
    ) : null;
  };

  return (
    <div className={styles.screenBackground}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.text}>{action}</div>
          <div className={styles.logo}>
            <img src={logo} alt="Logo" />
          </div>
        </div>

        <div className={styles.inputs}>
          {action === "Sign Up" && (
            <>
              <div className={styles.inputGroup}>
                <div className={styles.input}>
                  <User />
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, nombre: true }))
                    }
                  />
                </div>
                {renderError("nombre")}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.input}>
                  <BadgePlus />
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="DNI"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, dni: true }))
                    }
                  />
                </div>
                {renderError("dni")}
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <div className={styles.input}>
              <Mail />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              />
            </div>
            {renderError("email")}
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.input}>
              <Lock />
              <input
                type="password"
                placeholder="Password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, contrasenia: true }))
                }
              />
            </div>
            {renderError("contrasenia")}
          </div>

          {action === "Sign Up" && (
            <div className={styles.inputGroup}>
              <div className={styles.input}>
                <Lock />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={confirmarContrasenia}
                  onChange={(e) => setConfirmarContrasenia(e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({
                      ...prev,
                      confirmarContrasenia: true,
                    }))
                  }
                />
              </div>
              {renderError("confirmarContrasenia")}
            </div>
          )}
        </div>

        {action === "Login" && (
          <div className={styles.forgot_password}>
            Lost Password? <span>Click Here!</span>
          </div>
        )}

        <div className={styles.submit_container}>
          <div
            className={action === "Login" ? styles.submit_gray : styles.submit}
            onClick={() => {
              if (action === "Sign Up") handleRegister();
              else setAction("Sign Up");
            }}
          >
            Sign Up
          </div>

          <div
            className={
              action === "Sign Up" ? styles.submit_gray : styles.submit
            }
            onClick={() => {
              if (action === "Login") handleLogin();
              else setAction("Login");
            }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenLoginSignup;
