// ============================================
// Middleware/authMiddleware.ts (CORREGIDO)
// ============================================
import { Context } from "../Dependencies/dependencias.ts";
import { conexion } from "../Models/conexion.ts"; // Asegura que esta ruta y exportación son correctas

// ============================================
// Middleware: Requerir Autenticación (requireAuth)
// ============================================
export const requireAuth = async (ctx: Context, next: () => Promise<unknown>) => {
  const { request, response } = ctx;
  
  // Obtener el header de autorización
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    response.status = 401;
    response.body = {
      success: false,
      message: "No autorizado. Debe iniciar sesión para acceder a este recurso"
    };
    return;
  }

  // Extraer el token (formato: "Bearer {id_usuario}")
  const token = authHeader.replace("Bearer ", "").trim();
  
  if (!token) {
    response.status = 401;
    response.body = {
      success: false,
      message: "Token de autenticación inválido"
    };
    return;
  }
  
  // Validar que el token sea un número válido
  const userId = parseInt(token);
  if (isNaN(userId)) {
    response.status = 401;
    response.body = {
      success: false,
      message: "Token de autenticación mal formado"
    };
    return;
  }

  try {
    // 1. Verificar que el usuario exista, esté activo y OBTENER el rol
    const result = await conexion.query(
      `SELECT id_usuario, nombres, apellidos, email, rol, numero_documento
        FROM usuarios
        WHERE id_usuario = ? AND estado = 'activo'`, // **CAMBIO: de 'usuarios' a 'usuario' y agregando 'rol'**
      [userId]
    );

    if (result.length === 0) {
      response.status = 401;
      response.body = {
        success: false,
        message: "Usuario no encontrado o inactivo"
      };
      return;
    }

    // 2. Verificar que tenga una sesión activa
    const sesionActiva = await conexion.query(
      `SELECT id_sesion FROM sesiones
        WHERE id_usuario = ? AND fecha_hora_fin IS NULL
        ORDER BY fecha_hora_inicio DESC LIMIT 1`,
      [userId]
    );

    if (sesionActiva.length === 0) {
      response.status = 401;
      response.body = {
        success: false,
        message: "Sesión expirada. Por favor, inicie sesión nuevamente"
      };
      return;
    }

    // Guardar información del usuario en el contexto (state)
    ctx.state.userId = userId;
    ctx.state.user = result[0];
    
    // Continuar con el siguiente middleware o controlador
    await next();

  } catch (error: unknown) {
    console.error("Error en middleware de autenticación:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error al verificar la autenticación"
    };
  }
};

// ============================================
// Middleware: Requerir Rol de Administrador (requireAdmin)
// ============================================
export const requireAdmin = async (ctx: Context, next: () => Promise<unknown>) => {
  const { request, response } = ctx;
  
  // Lógica de token/userId (omito la repetición del código de requireAuth por brevedad)
  const authHeader = request.headers.get("Authorization");
  // ... (Repite aquí la extracción y validación de userId como en requireAuth) ...

  const token = authHeader?.replace("Bearer ", "").trim() || '';
  const userId = parseInt(token);

  if (!token || isNaN(userId)) {
      response.status = 401;
      response.body = { success: false, message: "Token de autenticación inválido o mal formado" };
      return;
  }

  try {
    // 1. Verificar que el usuario exista, esté activo y OBTENER el rol
    const result = await conexion.query(
      `SELECT id_usuario, nombres, apellidos, email, rol
        FROM usuarios
        WHERE id_usuario = ? AND estado = 'activo'`, // **CAMBIO: de 'usuarios' a 'usuario' y agregando 'rol'**
      [userId]
    );

    if (result.length === 0) {
      response.status = 401;
      response.body = {
        success: false,
        message: "Usuario no encontrado o inactivo"
      };
      return;
    }
    
    const usuario = result[0];

    // 2. Verificar que sea administrador (RF6)
    if (usuario.rol !== "administrador") { // **CAMBIO: de 'tipo_usuario' a 'rol'**
      response.status = 403;
      response.body = {
        success: false,
        message: "Acceso denegado. Se requieren permisos de administrador para realizar esta acción"
      };
      return;
    }

    // 3. Verificar sesión activa
    const sesionActiva = await conexion.query(
      `SELECT id_sesion FROM sesiones
        WHERE id_usuario = ? AND fecha_hora_fin IS NULL
        ORDER BY fecha_hora_inicio DESC LIMIT 1`,
      [userId]
    );

    if (sesionActiva.length === 0) {
      response.status = 401;
      response.body = {
        success: false,
        message: "Sesión expirada. Por favor, inicie sesión nuevamente"
      };
      return;
    }

    // Guardar información del administrador en el contexto
    ctx.state.userId = userId;
    ctx.state.user = usuario;
    ctx.state.isAdmin = true;

    // Continuar con el siguiente middleware o controlador
    await next();

  } catch (error: unknown) {
    console.error("Error en middleware de administrador:", error);
    response.status = 500;
    response.body = {
      success: false,
      message: "Error al verificar los permisos de administrador"
    };
  }
};

// ... (El resto de tus Middlewares permanecen igual, pero asegúrate de usar 'usuario' y 'rol' en el código restante si haces consultas a la BD).