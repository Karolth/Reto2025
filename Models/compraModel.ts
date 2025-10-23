// ============================================
// 8. Models/compraModel.ts (RF8, RF9, RF10, RF12)
// ============================================
import { conexion } from "./conexion.ts";

export class Compra {
  constructor(
    public id_usuario: number,
    public numero_documento_comprador: string,
    public id_evento: number,
    public id_boleteria: number,
    public cantidad: number,
    public metodo_pago: string
  ) {}

  // RF8, RF9, RF10: Realizar compra
  async realizarCompra() {
    try {
      // Validar que el método de pago tenga 15 dígitos
      if (this.metodo_pago.length !== 15) {
        return { success: false, message: "El método de pago debe tener 15 dígitos" };
      }

      // Validar máximo 10 boletas por transacción (RF8)
      if (this.cantidad > 10) {
        return { success: false, message: "No se pueden comprar más de 10 boletas por localidad por transacción" };
      }

      // Verificar disponibilidad (RF10)
      const boleteria = await conexion.query(
        "SELECT * FROM boleteria WHERE id_boleteria = ?",
        [this.id_boleteria]
      );

      if (boleteria.length === 0) {
        return { success: false, message: "Boletería no encontrada" };
      }

      const boleteriaData = boleteria[0];
      
      if (boleteriaData.cantidad_disponible < this.cantidad) {
        return { 
          success: false, 
          message: `No hay suficientes boletas disponibles. Solo quedan ${boleteriaData.cantidad_disponible} boletas` 
        };
      }

      // Calcular total
      const valor_total = boleteriaData.precio * this.cantidad;
      
      // Generar código de transacción
      const fecha = new Date();
      const timestamp = fecha.toISOString().replace(/[-:T.]/g, '').slice(0, 14);
      const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
      const codigo_transaccion = `TRX-${timestamp}-${random}`;

      // Insertar compra
      const resultCompra = await conexion.execute(
        `INSERT INTO compras (id_usuario, numero_documento_comprador, valor_total, metodo_pago, estado_transaccion, codigo_transaccion)
         VALUES (?, ?, ?, ?, 'exitosa', ?)`,
        [this.id_usuario, this.numero_documento_comprador, valor_total, this.metodo_pago, codigo_transaccion]
      );

      const id_compra = resultCompra.lastInsertId;

      // Insertar detalle (esto activa el trigger que descuenta boletas - RF9)
      await conexion.execute(
        `INSERT INTO detalle_compras (id_compra, id_evento, id_boleteria, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_compra, this.id_evento, this.id_boleteria, this.cantidad, boleteriaData.precio, valor_total]
      );

      return {
        success: true,
        message: "Compra realizada exitosamente",
        data: {
          id_compra,
          codigo_transaccion,
          valor_total,
          cantidad: this.cantidad
        }
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("No hay suficientes boletas")) {
        return { success: false, message: "No hay suficientes boletas disponibles para completar la compra" };
      }
      return { success: false, message };
    }
  }

  // RF12: Historial de compras del usuario
  static async obtenerHistorialCompras(id_usuario: number) {
    const result = await conexion.query(`
      SELECT 
        c.id_compra,
        c.codigo_transaccion,
        c.fecha_hora_compra,
        c.valor_total,
        c.estado_transaccion,
        e.nombre AS evento,
        e.fecha_hora_inicio AS fecha_evento,
        loc.nombre_localidad AS localidad,
        dc.cantidad AS cantidad_boletas
      FROM compras c
      INNER JOIN detalle_compras dc ON c.id_compra = dc.id_compra
      INNER JOIN eventos e ON dc.id_evento = e.id_evento
      INNER JOIN boleteria b ON dc.id_boleteria = b.id_boleteria
      INNER JOIN localidades loc ON b.id_localidad = loc.id_localidad
      WHERE c.id_usuario = ?
      ORDER BY c.fecha_hora_compra DESC
    `, [id_usuario]);
    return result;
  }

  // RF12: Filtrar compras por evento
  static async filtrarComprasPorEvento(id_usuario: number, id_evento: number) {
    const result = await conexion.query(`
      SELECT 
        c.id_compra,
        c.codigo_transaccion,
        c.fecha_hora_compra,
        c.valor_total,
        c.estado_transaccion,
        e.nombre AS evento,
        e.fecha_hora_inicio AS fecha_evento,
        loc.nombre_localidad AS localidad,
        dc.cantidad AS cantidad_boletas
      FROM compras c
      INNER JOIN detalle_compras dc ON c.id_compra = dc.id_compra
      INNER JOIN eventos e ON dc.id_evento = e.id_evento
      INNER JOIN boleteria b ON dc.id_boleteria = b.id_boleteria
      INNER JOIN localidades loc ON b.id_localidad = loc.id_localidad
      WHERE c.id_usuario = ? AND dc.id_evento = ?
      ORDER BY c.fecha_hora_compra DESC
    `, [id_usuario, id_evento]);
    return result;
  }

  // RF12: Filtrar compras por fecha
  static async filtrarComprasPorFecha(id_usuario: number, fecha: string) {
    const result = await conexion.query(`
      SELECT 
        c.id_compra,
        c.codigo_transaccion,
        c.fecha_hora_compra,
        c.valor_total,
        c.estado_transaccion,
        e.nombre AS evento,
        e.fecha_hora_inicio AS fecha_evento,
        loc.nombre_localidad AS localidad,
        dc.cantidad AS cantidad_boletas
      FROM compras c
      INNER JOIN detalle_compras dc ON c.id_compra = dc.id_compra
      INNER JOIN eventos e ON dc.id_evento = e.id_evento
      INNER JOIN boleteria b ON dc.id_boleteria = b.id_boleteria
      INNER JOIN localidades loc ON b.id_localidad = loc.id_localidad
      WHERE c.id_usuario = ? AND DATE(c.fecha_hora_compra) = ?
      ORDER BY c.fecha_hora_compra DESC
    `, [id_usuario, fecha]);
    return result;
  }
}