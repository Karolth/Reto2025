import { conexion } from "./conexion.ts";

export class Consulta {
  // RF7: Consultar eventos disponibles (para usuarios no autenticados)
  static async consultarEventosDisponibles() {
    const result = await conexion.query(`
      SELECT * FROM vista_eventos_disponibles
    `);
    return result;
  }

  // RF7: Filtrar eventos por fecha
  static async filtrarPorFecha(fecha: string) {
    const result = await conexion.query(`
      SELECT * FROM vista_eventos_disponibles
      WHERE DATE(fecha_hora_inicio) = ?
    `, [fecha]);
    return result;
  }

  // RF7: Filtrar eventos por municipio
  static async filtrarPorMunicipio(municipio: string) {
    const result = await conexion.query(`
      SELECT * FROM vista_eventos_disponibles
      WHERE municipio = ?
    `, [municipio]);
    return result;
  }

  // RF7: Filtrar eventos por departamento
  static async filtrarPorDepartamento(departamento: string) {
    const result = await conexion.query(`
      SELECT * FROM vista_eventos_disponibles
      WHERE departamento = ?
    `, [departamento]);
    return result;
  }

  // RF7: Obtener detalles completos de un evento
  static async obtenerDetalleEvento(id_evento: number) {
    const evento = await conexion.query(`
      SELECT * FROM vista_eventos_disponibles WHERE id_evento = ?
    `, [id_evento]);

    if (evento.length === 0) {
      return null;
    }

    // Obtener artistas
    const artistas = await conexion.query(`
      SELECT a.nombres, a.apellidos, a.genero_musical, m.nombre as ciudad_natal
      FROM eventos_artistas ea
      INNER JOIN artistas a ON ea.id_artista = a.id_artista
      INNER JOIN municipios m ON a.id_municipio_origen = m.id_municipio
      WHERE ea.id_evento = ?
      ORDER BY ea.orden_presentacion
    `, [id_evento]);

    // Obtener disponibilidad de boletas
    const boletas = await conexion.query(`
      SELECT b.*, l.nombre_localidad, l.codigo_localidad
      FROM boleteria b
      INNER JOIN localidades l ON b.id_localidad = l.id_localidad
      WHERE b.id_evento = ?
      ORDER BY b.precio DESC
    `, [id_evento]);

    return {
      evento: evento[0],
      artistas,
      boletas
    };
  }

  // Listar departamentos
  static async listarDepartamentos() {
    const result = await conexion.query("SELECT * FROM departamentos ORDER BY nombre");
    return result;
  }

  // Listar municipios por departamento
  static async listarMunicipiosPorDepartamento(id_departamento: number) {
    const result = await conexion.query(
      "SELECT * FROM municipios WHERE id_departamento = ? ORDER BY nombre",
      [id_departamento]
    );
    return result;
  }

  // Listar todos los municipios
  static async listarMunicipios() {
    const result = await conexion.query(`
      SELECT m.*, d.nombre as departamento
      FROM municipios m
      INNER JOIN departamentos d ON m.id_departamento = d.id_departamento
      ORDER BY m.nombre
    `);
    return result;
  }

  // Listar lugares por municipio
  static async listarLugaresPorMunicipio(id_municipio: number) {
    const result = await conexion.query(
      "SELECT * FROM lugares WHERE id_municipio = ? ORDER BY nombre",
      [id_municipio]
    );
    return result;
  }
}