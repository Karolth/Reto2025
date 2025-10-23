const API_URL = 'http://127.0.0.1:8000';

// Interfaces que coinciden EXACTAMENTE con tu backend
export interface Evento {
  id_evento?: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  municipio: string;
  departamento: string;
  lugar: string;
}

export interface Artista {
  codigo_artista?: string;
  nombres: string;
  apellidos: string;
  genero_musica: string;
  ciudad_natal: string;
}

export interface Boleteria {
  id_boleteria?: number;
  id_evento: number;
  localidad: string;
  valor_boleta: number;
  cantidad_disponible: number;
}

export interface Localidad {
  codigo_localidad: string;
  nombre_localidad: string;
}

// API Response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  evento?: T;
}

// GET - Listar todos los eventos
export async function getEventos(): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_URL}/eventos`);
    const data: ApiResponse<Evento[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return [];
  }
}

// GET - Obtener evento por ID
export async function getEventoPorId(id: number): Promise<Evento | null> {
  try {
    const res = await fetch(`${API_URL}/eventos/${id}`);
    const data: ApiResponse<Evento> = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return null;
  }
}

// GET - Buscar eventos por fecha
export async function getEventosPorFecha(fecha: string): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_URL}/eventos/buscar/fecha?fecha=${fecha}`);
    const data: ApiResponse<Evento[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al buscar eventos por fecha:', error);
    return [];
  }
}

// GET - Buscar eventos por municipio
export async function getEventosPorMunicipio(municipio: string): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_URL}/eventos/buscar/municipio?municipio=${municipio}`);
    const data: ApiResponse<Evento[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al buscar eventos por municipio:', error);
    return [];
  }
}

// GET - Buscar eventos por departamento
export async function getEventosPorDepartamento(departamento: string): Promise<Evento[]> {
  try {
    const res = await fetch(`${API_URL}/eventos/buscar/departamento?departamento=${departamento}`);
    const data: ApiResponse<Evento[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al buscar eventos por departamento:', error);
    return [];
  }
}

// POST - Crear nuevo evento
export async function crearEvento(evento: Omit<Evento, 'id_evento'>): Promise<ApiResponse<Evento>> {
  try {
    const res = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evento),
    });
    return await res.json();
  } catch (error) {
    console.error('Error al crear evento:', error);
    return { success: false, message: 'Error al crear evento' };
  }
}

// PUT - Actualizar evento
export async function actualizarEvento(id: number, evento: Omit<Evento, 'id_evento'>): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evento),
    });
    return await res.json();
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return { success: false, message: 'Error al actualizar evento' };
  }
}

// DELETE - Eliminar evento
export async function eliminarEvento(id: number): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${API_URL}/eventos/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return { success: false, message: 'Error al eliminar evento' };
  }
}

// ========== BOLETERÍA ==========

// GET - Obtener boletería por evento
export async function getBoleteriaPorEvento(id_evento: number): Promise<Boleteria[]> {
  try {
    const res = await fetch(`${API_URL}/boleteria/${id_evento}`);
    const data: ApiResponse<Boleteria[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener boletería:', error);
    return [];
  }
}

// POST - Crear boletería
export async function crearBoleteria(boleteria: Omit<Boleteria, 'id_boleteria'>): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${API_URL}/boleteria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(boleteria),
    });
    return await res.json();
  } catch (error) {
    console.error('Error al crear boletería:', error);
    return { success: false, message: 'Error al crear boletería' };
  }
}

// ========== ARTISTAS ==========

// GET - Listar todos los artistas
export async function getArtistas(): Promise<Artista[]> {
  try {
    const res = await fetch(`${API_URL}/artistas`);
    const data: ApiResponse<Artista[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener artistas:', error);
    return [];
  }
}

// POST - Crear artista
export async function crearArtista(artista: Artista): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${API_URL}/artistas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigo: artista.codigo_artista || '',
        nombres: artista.nombres,
        apellidos: artista.apellidos,
        genero_musica: artista.genero_musica,
        ciudad_natal: artista.ciudad_natal,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error al crear artista:', error);
    return { success: false, message: 'Error al crear artista' };
  }
}

// ========== LOCALIDADES ==========

// GET - Listar todas las localidades
export async function getLocalidades(): Promise<Localidad[]> {
  try {
    const res = await fetch(`${API_URL}/localidades`);
    const data: ApiResponse<Localidad[]> = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error al obtener localidades:', error);
    return [];
  }
}

// POST - Crear localidad
export async function crearLocalidad(localidad: Localidad): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`${API_URL}/localidades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigo: localidad.codigo_localidad,
        nombre: localidad.nombre_localidad,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error al crear localidad:', error);
    return { success: false, message: 'Error al crear localidad' };
  }
}