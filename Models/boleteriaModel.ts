import { conexion } from "./conexion.ts";

export class Boleteria {
  constructor(
    public id_evento: number,
    public localidad: string,
    public valor: number,
    public cantidad: number
  ) {}

  async insertarBoleteria() {
    try {
      await conexion.execute(
        `INSERT INTO boleteria (id_evento, localidad, valor_boleta, cantidad_disponible)
         VALUES (?, ?, ?, ?)`,
        [this.id_evento, this.localidad, this.valor, this.cantidad]
      );
      return { success: true, message: "Boletería registrada correctamente" };
    } catch (error) {
      return { success: false, message: (error as Error).message };
    }
  }

  async listarBoleteriaPorEvento(id_evento: number) {
    const result = await conexion.query(
      "SELECT * FROM boleteria WHERE id_evento = ?",
      [id_evento]
    );
    return result;
  }
}
