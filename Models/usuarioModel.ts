// Models/usuarioModel.ts

// Asegúrate de importar la conexión y las dependencias de hasheo
import { conexion } from "./conexion.ts";
import { hash, compare } from "../Dependencies/dependencias.ts"; 

export class Usuario {
  constructor(
    public nombres: string,
    public apellidos: string,
    public tipoDocumento: string,
    public numeroDocumento: string,
    public email: string,
    public password: string, // Temporalmente guarda la contraseña sin hashear
    public telefono: string,
    public rol: string = "comprador"
  ) {}

  /**
   * Registra un nuevo usuario en la tabla 'usuarios' (RF11).
   */
  async registrarUsuario() {
    try {
      const passwordHash = await hash(this.password); // Generar hash para seguridad

      // ✅ CORRECCIÓN CLAVE: Usar 'usuarios' y 'password_hash'
      const result = await conexion.execute(
        `INSERT INTO usuarios (nombres, apellidos, tipo_documento, numero_documento, email, password_hash, telefono, rol) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          this.nombres,
          this.apellidos,
          this.tipoDocumento,
          this.numeroDocumento,
          this.email,
          passwordHash, // Almacenar el hash
          this.telefono,
          this.rol,
        ]
      );

      return {
        success: true,
        message: "Usuario registrado correctamente",
        id: result.lastInsertId,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      
      // Manejo de errores de duplicidad (RF11)
      if (message.includes("Duplicate entry") && message.includes("email")) {
        return { success: false, message: "El correo electrónico ya está registrado" };
      }
      if (message.includes("Duplicate entry") && message.includes("numero_documento")) {
        return { success: false, message: "El número de documento ya está registrado" };
      }
      
      return { success: false, message: `Error al registrar en BD: ${message}` };
    }
  }

  /**
   * Inicia sesión validando email y contraseña (RF6, RF11).
   */
  static async iniciarSesion(email: string, password: string) {
    try {
      // ✅ CORRECCIÓN CLAVE: Usar 'usuarios'
      const usuarios = await conexion.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );

      if (!usuarios || usuarios.length === 0) {
        return { success: false, message: "Credenciales incorrectas" };
      }

      const usuario = usuarios[0];
      // ✅ CORRECCIÓN CLAVE: Usar 'password_hash'
      const passwordValido = await compare(password, usuario.password_hash);

      if (!passwordValido) {
        return { success: false, message: "Credenciales incorrectas" };
      }

      const { password_hash, ...datosUsuario } = usuario;

      // TODO: Implementar la generación y registro del token en la tabla 'sesiones'

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        data: datosUsuario,
        // token: "..." 
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      return { success: false, message: `Error al iniciar sesión: ${message}` };
    }
  }

  /**
   * Obtiene un usuario por su ID (Usado por el Middleware).
   */
  static async obtenerUsuarioPorId(idUsuario: number) {
    try {
      // ✅ CORRECCIÓN CLAVE: Usar 'usuarios'
      const usuarios = await conexion.query(
        "SELECT id_usuario, nombres, apellidos, tipo_documento, numero_documento, email, telefono, rol FROM usuarios WHERE id_usuario = ?",
        [idUsuario]
      );

      if (!usuarios || usuarios.length === 0) {
        return { success: false, message: "Usuario no encontrado" };
      }

      return { success: true, data: usuarios[0] };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      return { success: false, message: `Error al obtener usuario: ${message}` };
    }
  }

  /**
   * Actualiza los datos personales de un usuario (RF11).
   */
  static async actualizarUsuario(
    idUsuario: number,
    nombres: string,
    apellidos: string,
    tipoDocumento: string,
    numeroDocumento: string,
    email: string,
    telefono: string
  ) {
    try {
      // ✅ CORRECCIÓN CLAVE: Usar 'usuarios'
      let query = `UPDATE usuarios 
                   SET nombres = ?, apellidos = ?, tipo_documento = ?, numero_documento = ?, email = ?, telefono = ?
                   WHERE id_usuario = ?`;
      let params = [nombres, apellidos, tipoDocumento, numeroDocumento, email, telefono, idUsuario];
      

      await conexion.execute(query, params);

      return { success: true, message: "Datos actualizados correctamente" };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
      return { success: false, message: `Error al actualizar datos: ${message}` };
    }
  }
}