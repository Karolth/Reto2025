// /Controller/usuarioController.ts

import { Context } from "../Dependencies/dependencias.ts";
import { Usuario } from "../Models/usuarioModel.ts"; // Debe apuntar a tu modelo

/**
 * Función auxiliar para parsear el cuerpo de la solicitud y manejar errores JSON.
 * @param ctx El contexto de Oak.
 * @returns El cuerpo de la solicitud parseado o null si falló (y ya se envió la respuesta 400).
 */
const parseRequestBody = async (ctx: Context): Promise<any | null> => {
    const { request, response } = ctx;
    
    // Si no hay body o no es un método que lleva cuerpo
    if (request.hasBody === false || request.method === 'GET') {
        return {};
    }

    try {
        // Intenta parsear el cuerpo de la solicitud (asume Content-Type: application/json)
        const body = await request.body.json(); 
        return body;
    } catch (error) {
        // Manejo de error de formato JSON (el error 400 que recibiste)
        console.error("Error al parsear JSON:", error);
        response.status = 400;
        response.body = { 
            success: false, 
            message: "Formato de solicitud inválido. Asegúrese de que el cuerpo sea JSON válido y Content-Type: application/json." 
        };
        return null;
    }
};

// ============================================
// RF11: Registrar usuario (Comprador)
// RUTA: POST /usuarios/register
// ============================================
export const registrarUsuario = async (ctx: Context) => {
  const { response } = ctx;
  
  const body = await parseRequestBody(ctx);
  if (body === null) return; // Falló el parseo, la respuesta ya fue enviada (400)

  // 1. Validación de contraseñas (Requerido por RF11)
  if (body.password !== body.confirmacion_password) {
    response.status = 400;
    response.body = { 
      success: false, 
      message: "Las contraseñas proporcionadas no coinciden." 
    };
    return;
  }

  try {
    // 2. Crear una instancia del modelo Usuario
    // Usa body.telefono || null para manejar el campo opcional (RF11)
    const nuevoUsuario = new Usuario(
      body.nombres,
      body.apellidos,
      body.tipo_documento,
      body.numero_documento,
      body.email,
      body.password, 
      body.telefono || null 
    );

    // 3. Llamar al método de registro del modelo
    const result = await nuevoUsuario.registrarUsuario();
  
    response.status = result.success ? 201 : 409; // 409 Conflict si es duplicado
    response.body = result;

  } catch (error) {
    console.error("Error inesperado en el registro:", error);
    response.status = 500;
    response.body = { 
      success: false, 
      message: "Error interno del servidor al procesar el registro." 
    };
  }
};

// ============================================
// RF6, RF11: Iniciar sesión
// RUTA: POST /usuarios/login
// ============================================
export const iniciarSesion = async (ctx: Context) => {
  const { response } = ctx;
  
  const body = await parseRequestBody(ctx);
  if (body === null) return;

  // Asegurarse de que email y password existan para evitar errores
  if (!body.email || !body.password) {
    response.status = 400;
    response.body = { success: false, message: "Faltan credenciales (email o password)." };
    return;
  }
  
  const result = await Usuario.iniciarSesion(body.email, body.password);
  
  response.status = result.success ? 200 : 401; // 401 Unauthorized si falla
  response.body = result;
};

// ============================================
// RF11: Actualizar usuario (Requiere Auth)
// RUTA: PUT /usuarios/perfil
// ============================================
export const actualizarUsuario = async (ctx: Context) => {
  const { response, state } = ctx;
  // El id_usuario debe ser inyectado por el middleware de autenticación
  const id_usuario = state.userId; 

  if (!id_usuario) {
    response.status = 401;
    response.body = { success: false, message: "Usuario no autenticado." };
    return;
  }

  const body = await parseRequestBody(ctx);
  if (body === null) return;

  // Llamada al método estático del modelo con todos los 7 parámetros requeridos
  const result = await Usuario.actualizarUsuario(
    id_usuario,
    body.nombres,
    body.apellidos,
    body.tipo_documento,
    body.numero_documento,
    body.email,
    body.telefono
  );

  response.status = result.success ? 200 : 400;
  response.body = result;
};

// ============================================
// RF11: Cerrar sesión (Requiere Auth)
// RUTA: POST /usuarios/logout
// ============================================
export const cerrarSesion = async (ctx: Context) => {
  const { response, state } = ctx;
  const id_usuario = state.userId; // Obtenido del middleware requireAuth

  // En una aplicación real, aquí se llamaría a una función del modelo 
  // para invalidar el token en la tabla 'sesiones'.

  try {
    // Si usas tokens JWT, no necesitas hacer nada en la BD, 
    // solo indicar que la sesión se cerró para el cliente.
    
    // Si usas sesiones basadas en la BD (tabla sesiones), la lógica iría aquí:
    // await Usuario.cerrarSesion(id_usuario, token); 
    
    // Limpiar el estado local de Oak (si aplica)
    state.userId = null; 

    const result = { 
        success: true, 
        message: "Sesión cerrada exitosamente", 
        userId: id_usuario 
    };
    response.status = 200;
    response.body = result;

  } catch (error) {
    response.status = 500;
    response.body = { 
        success: false, 
        message: "Error interno al intentar cerrar la sesión" 
    };
  }
};