import { conexion } from "./conexion.ts";

export class Localidad {
  constructor(public codigo: string, public nombre: string) {}

  async insertarLocalidad() {
    try {
      await conexion.execute(
        "INSERT INTO localidades (codigo_localidad, nombre_localidad) VALUES (?, ?)",
        [this.codigo, this.nombre]
      );
      return { success: true, message: "Localidad registrada correctamente" };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error ?? "Unknown error");
      return { success: false, message };
    }
  }

  async listarLocalidades() {
    const result = await conexion.query("SELECT * FROM localidades");
    return result;
  }
}
