import { z } from "../Dependencies/dependencias.ts";
import { conexion } from "./conexion.ts";

interface EventoData {
  id_evento?: number | null;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  municipio: string;
  departamento: string;
  lugar: string;
}

export class Evento {
  public _objEvento: EventoData | null;
  public _idEvento: number | null;

  constructor(objEvento: EventoData | null = null, idEvento: number | null = null) {
    this._objEvento = objEvento;
    this._idEvento = idEvento;
  }

  // Listar todos los eventos
  public async seleccionarEventos(): Promise<EventoData[]> {
    const eventos = await conexion.query(`SELECT * FROM eventos ORDER BY fecha_inicio DESC`);
    return eventos as EventoData[];
  }

  // Consultar evento por ID
  public async seleccionarEventoPorId(): Promise<EventoData | null> {
    if (!this._idEvento) {
      throw new Error("No se ha proporcionado un ID de evento válido");
    }
    const rows = await conexion.query(`SELECT * FROM eventos WHERE id_evento = ?`, [this._idEvento]);
    return rows && rows.length > 0 ? rows[0] as EventoData : null;
  }

  // Consultar eventos por fecha
  public async seleccionarEventosPorFecha(fecha: string): Promise<EventoData[]> {
    const eventos = await conexion.query(
      `SELECT * FROM eventos WHERE DATE(fecha_inicio) = DATE(?) ORDER BY fecha_inicio`,
      [fecha]
    );
    return eventos as EventoData[];
  }

  // Consultar eventos por municipio
  public async seleccionarEventosPorMunicipio(municipio: string): Promise<EventoData[]> {
    const eventos = await conexion.query(
      `SELECT * FROM eventos WHERE municipio LIKE ? ORDER BY fecha_inicio`,
      [`%${municipio}%`]
    );
    return eventos as EventoData[];
  }

  // Consultar eventos por departamento
  public async seleccionarEventosPorDepartamento(departamento: string): Promise<EventoData[]> {
    const eventos = await conexion.query(
      `SELECT * FROM eventos WHERE departamento LIKE ? ORDER BY fecha_inicio`,
      [`%${departamento}%`]
    );
    return eventos as EventoData[];
  }

  // Insertar nuevo evento
  public async insertarEvento(): Promise<{ success: boolean; message: string; evento?: Record<string, unknown> }> {
    try {
      if (!this._objEvento) {
        throw new Error("No se ha proporcionado un objeto de evento válido");
      }

      const { nombre, descripcion, fecha_inicio, fecha_fin, municipio, departamento, lugar } = this._objEvento;

      if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !municipio || !departamento || !lugar) {
        throw new Error("Faltan campos requeridos para insertar el evento.");
      }

      await conexion.execute("START TRANSACTION");
      
      const result = await conexion.execute(
        `INSERT INTO eventos(nombre, descripcion, fecha_inicio, fecha_fin, municipio, departamento, lugar) VALUES(?,?,?,?,?,?,?)`,
        [nombre, descripcion, fecha_inicio, fecha_fin, municipio, departamento, lugar]
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        const usuario = await conexion.query(`SELECT * FROM eventos WHERE id_evento = LAST_INSERT_ID()`);
        await conexion.execute("COMMIT");
        return { success: true, message: "Evento registrado correctamente", evento: usuario[0] };
      } else {
        throw new Error("No fue posible registrar el evento.");
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");
      if (error instanceof z.ZodError) {
        return { success: false, message: error.message };
      } else {
        return { success: false, message: error instanceof Error ? error.message : "Error interno en el servidor" };
      }
    }
  }

  // Actualizar evento
  public async actualizarEvento(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._idEvento || !this._objEvento) {
        throw new Error("No se ha proporcionado un ID o datos de evento válidos");
      }

      const { nombre, descripcion, fecha_inicio, fecha_fin, municipio, departamento, lugar } = this._objEvento;

      if (!nombre || !descripcion || !fecha_inicio || !fecha_fin || !municipio || !departamento || !lugar) {
        throw new Error("Faltan campos requeridos para actualizar el evento.");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(
        `UPDATE eventos SET nombre=?, descripcion=?, fecha_inicio=?, fecha_fin=?, municipio=?, departamento=?, lugar=? WHERE id_evento=?`,
        [nombre, descripcion, fecha_inicio, fecha_fin, municipio, departamento, lugar, this._idEvento]
      );

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Evento actualizado correctamente" };
      } else {
        throw new Error("No fue posible actualizar el evento o el evento no existe.");
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno en el servidor" };
    }
  }

  // Eliminar evento
  public async eliminarEvento(): Promise<{ success: boolean; message: string }> {
    try {
      if (!this._idEvento) {
        throw new Error("No se ha proporcionado un ID de evento válido");
      }

      await conexion.execute("START TRANSACTION");

      const result = await conexion.execute(`DELETE FROM eventos WHERE id_evento = ?`, [this._idEvento]);

      if (result && typeof result.affectedRows === "number" && result.affectedRows > 0) {
        await conexion.execute("COMMIT");
        return { success: true, message: "Evento eliminado correctamente" };
      } else {
        throw new Error("No fue posible eliminar el evento o el evento no existe.");
      }
    } catch (error) {
      await conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno en el servidor" };
    }
  }
}