import { Router } from "../Dependencies/dependencias.ts";
import {
  actualizarUsuario,
  cerrarSesion,
  iniciarSesion,
  registrarUsuario,
} from "../Controller/usuarioController.ts";
import { requireAuth } from "../Middleware/authMiddleware.ts";

const usuarioRouter = new Router();

usuarioRouter
  .post("/usuarios/register", registrarUsuario) // ✅ RUTA CORREGIDA
  .post("/usuarios/login", iniciarSesion)
  .put("/usuarios/perfil", requireAuth, actualizarUsuario)
  .post("/usuarios/logout", requireAuth, cerrarSesion);

export { usuarioRouter };
