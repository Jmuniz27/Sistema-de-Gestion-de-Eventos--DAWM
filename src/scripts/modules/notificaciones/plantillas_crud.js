/**
 * ============================================
 * CRUD DE PLANTILLAS
 * ============================================
 * Operaciones de base de datos para la tabla Plantillas
 */
import { supabase } from '../../supabase-client.js';
import {
  buildTemplateNameWithModule,
  splitTemplateName,
  TEMPLATE_MODULES
} from '../../../js/shared/plantillas-helpers.js';

const DEFAULT_TEMPLATE_MODULE = TEMPLATE_MODULES[0]?.value ?? 'General';

function mapEstado(value) {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return null;
    if (normalized.startsWith('inac') || normalized === 'inactive' || normalized === 'false' || normalized === '0') {
      return 'Inactivo';
    }
    return 'Activo';
  }
  if (typeof value === 'boolean') {
    return value ? 'Activo' : 'Inactivo';
  }
  if (typeof value === 'number') {
    return value > 0 ? 'Activo' : 'Inactivo';
  }
  return null;
}

function serializeEstado(value) {
  const mapped = mapEstado(value);
  return mapped ?? null;
}

function isEstadoActivo(value) {
  return mapEstado(value) === 'Activo';
}

function resolveTemplateModule(rawModule, embeddedModule) {
  if (rawModule) return rawModule;
  if (embeddedModule) return embeddedModule;
  return DEFAULT_TEMPLATE_MODULE;
}

function enrichTemplateRecord(record = {}) {
  const rawName = record.Pla_Nombre ?? record.pla_nombre ?? '';
  const { baseName, module: embeddedModule } = splitTemplateName(rawName);

  const resolvedModule = resolveTemplateModule(
    record.Pla_Modulo ?? record.pla_modulo,
    embeddedModule
  );
  const resolvedEstado = mapEstado(record.Pla_Estado ?? record.pla_estado);

  return {
    ...record,
    Pla_Nombre: baseName || rawName,
    pla_nombre: baseName || rawName,
    Pla_Nombre_Completo: rawName,
    Pla_Modulo: resolvedModule,
    pla_modulo: resolvedModule,
    Pla_Estado: resolvedEstado ?? record.Pla_Estado ?? record.pla_estado ?? null,
    pla_estado: resolvedEstado ?? record.pla_estado ?? null
  };
}

function enrichTemplateData(data) {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(enrichTemplateRecord);
  }
  return enrichTemplateRecord(data);
}

function buildInsertPayload(plantillaData = {}) {
  const rawName = plantillaData.Pla_Nombre ?? plantillaData.pla_nombre ?? '';
  const moduleValue = plantillaData.Pla_Modulo ?? plantillaData.pla_modulo ?? '';
  const cleanBaseName = splitTemplateName(rawName).baseName || rawName;

  const storedName = moduleValue
    ? buildTemplateNameWithModule(cleanBaseName, moduleValue)
    : rawName;

  const estado = serializeEstado(plantillaData.Pla_Estado ?? plantillaData.pla_estado) ?? 'Activo';

  return {
    pla_nombre: storedName,
    pla_asunto: plantillaData.Pla_Asunto ?? plantillaData.pla_asunto ?? null,
    pla_contenido: plantillaData.Pla_Contenido ?? plantillaData.pla_contenido ?? null,
    pla_tipo: plantillaData.Pla_Tipo ?? plantillaData.pla_tipo ?? null,
    pla_estado: estado
  };
}

function buildUpdatePayload(updates = {}) {
  const allowed = [
    'pla_nombre',
    'pla_asunto',
    'pla_contenido',
    'pla_tipo',
    'pla_estado',
    'pla_fechacreacion',
    'pla_fechaultimamodificacion'
  ];

  const moduleValue = updates.Pla_Modulo ?? updates.pla_modulo ?? '';
  let storedName = updates.pla_nombre ?? updates.Pla_Nombre ?? null;

  if (moduleValue && storedName) {
    const cleanBaseName = splitTemplateName(storedName).baseName || storedName;
    storedName = buildTemplateNameWithModule(cleanBaseName, moduleValue);
  }

  const normalizedEntries = Object.entries(updates || {})
    .map(([key, value]) => {
      if (key === 'Pla_Nombre' || key === 'pla_nombre') {
        return ['pla_nombre', storedName ?? value];
      }
      if (key === 'Pla_Asunto') return ['pla_asunto', value];
      if (key === 'Pla_Contenido') return ['pla_contenido', value];
      if (key === 'Pla_Tipo') return ['pla_tipo', value];
      if (key === 'Pla_Estado' || key === 'pla_estado') return ['pla_estado', serializeEstado(value)];
      if (key === 'Pla_FechaCreacion') return ['pla_fechacreacion', value];
      if (key === 'Pla_FechaUltimaModificacion') return ['pla_fechaultimamodificacion', value];
      return [key, value];
    });

  const payload = Object.fromEntries(
    normalizedEntries.filter(([key, value]) => allowed.includes(key) && value !== undefined)
  );

  if (storedName && !payload.pla_nombre) {
    payload.pla_nombre = storedName;
  }

  return payload;
}

const PlantillasCRUD = {
  /**
   * ============================================
   * CREATE - CREAR PLANTILLA
   * ============================================
   * Inserta una nueva plantilla en la base de datos
   * 
   * @param {Object} plantillaData - Datos de la plantilla a crear
   * @param {string} plantillaData.Pla_Nombre - Nombre de la plantilla
   * @param {string} plantillaData.Pla_Modulo - Módulo al que pertenece
   * @param {string} plantillaData.Pla_Asunto - Asunto del mensaje
   * @param {string} plantillaData.Pla_Contenido - Contenido del mensaje
  * @param {string} plantillaData.Pla_Tipo - Tipo de envío (Email o Push)
  * @param {string|boolean} plantillaData.Pla_Estado - Estado (Activo/Inactivo)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async create(plantillaData) {
    try {
      const insertPayload = buildInsertPayload(plantillaData);

      const { data, error } = await supabase
        .from('plantillas')
        .insert([insertPayload])
        .select();

      if (error?.code === '23505') {
        error.userMessage = 'Ya existe una plantilla con ese nombre y módulo. Elige un nombre diferente.';
      }

      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al crear plantilla:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER TODAS LAS PLANTILLAS
   * ============================================
   * Obtiene todas las plantillas de la base de datos
   * ordenadas por fecha de creación descendente
   * 
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .order('pla_fechacreacion', { ascending: false });
      
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al obtener plantillas:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER PLANTILLA POR ID
   * ============================================
   * Obtiene una plantilla específica por su ID
   * 
   * @param {number} id - ID de la plantilla
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .eq('id_plantillas', id);
      
      const enriched = enrichTemplateData(data);
      return { 
        data: Array.isArray(enriched) ? (enriched.length > 0 ? enriched[0] : null) : enriched,
        error 
      };
    } catch (err) {
      console.error('Error al obtener plantilla por ID:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER PLANTILLAS ACTIVAS
   * ============================================
   * Obtiene solo las plantillas activas
   * 
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getActive() {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .eq('pla_estado', 'Activo')
        .order('pla_nombre', { ascending: true });
      
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al obtener plantillas activas:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER PLANTILLAS POR MÓDULO
   * ============================================
   * Obtiene plantillas filtradas por módulo
   * 
   * @param {string} modulo - Nombre del módulo
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getByModulo(modulo) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .eq('pla_modulo', modulo)
        .order('pla_nombre', { ascending: true });
      
      if (error) {
        const fallback = await this.getAll();
        if (fallback.error || !fallback.data) {
          return { data: null, error };
        }

        const dataset = Array.isArray(fallback.data) ? fallback.data : [fallback.data];
        const filtered = dataset.filter(item => (item.Pla_Modulo || '').toLowerCase() === (modulo || '').toLowerCase());
        return { data: filtered, error: null };
      }

      return { data: enrichTemplateData(data), error: null };
    } catch (err) {
      console.error('Error al obtener plantillas por módulo:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - LEER PLANTILLAS POR TIPO
   * ============================================
   * Obtiene plantillas filtradas por tipo de envío
   * 
  * @param {string} tipo - Tipo de envío (Email o Push)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async getByTipo(tipo) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .select('*')
        .eq('pla_tipo', tipo)
        .order('pla_nombre', { ascending: true });
      
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al obtener plantillas por tipo:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * READ - BUSCAR PLANTILLAS
   * ============================================
   * Busca plantillas por nombre, módulo o asunto
   * (Implementación del lado del cliente ya que Supabase mock no soporta búsqueda compleja)
   * 
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async search(searchTerm) {
    try {
      const { data, error } = await this.getAll();

      if (error || !data) {
        return { data: null, error };
      }

      const dataset = Array.isArray(data) ? data : [data];
      const term = (searchTerm || '').toLowerCase();

      const filtered = dataset.filter(p =>
        (p.Pla_Nombre || '').toLowerCase().includes(term) ||
        (p.Pla_Modulo || '').toLowerCase().includes(term) ||
        (p.Pla_Asunto || '').toLowerCase().includes(term)
      );

      return { data: filtered, error: null };
    } catch (err) {
      console.error('Error al buscar plantillas:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - ACTUALIZAR PLANTILLA
   * ============================================
   * Actualiza los datos de una plantilla existente
   * 
   * @param {number} id - ID de la plantilla a actualizar
   * @param {Object} updates - Objeto con los campos a actualizar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async update(id, updates) {
    try {
      const payload = buildUpdatePayload(updates);

      const { data, error } = await supabase
        .from('plantillas')
        .update(payload)
        .eq('id_plantillas', id)
        .select();

      if (error) console.error('Supabase update error:', error, 'payload:', payload);
      if (error?.code === '23505') {
        error.userMessage = 'Ya existe otra plantilla con ese nombre y módulo.';
      }
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al actualizar plantilla:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - CAMBIAR ESTADO DE PLANTILLA
   * ============================================
   * Activa o desactiva una plantilla
   * 
   * @param {number} id - ID de la plantilla
   * @param {boolean} estado - Nuevo estado (true=activo, false=inactivo)
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async updateEstado(id, estado) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .update({ pla_estado: serializeEstado(estado) })
        .eq('id_plantillas', id)
        .select();
      
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al actualizar estado de plantilla:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UPDATE - ACTUALIZAR CONTENIDO
   * ============================================
   * Actualiza solo el contenido de una plantilla
   * 
   * @param {number} id - ID de la plantilla
   * @param {string} asunto - Nuevo asunto
   * @param {string} contenido - Nuevo contenido
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async updateContenido(id, asunto, contenido) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .update({ 
          pla_asunto: asunto,
          pla_contenido: contenido
        })
        .eq('id_plantillas', id)
        .select();
      
      return { data: enrichTemplateData(data), error };
    } catch (err) {
      console.error('Error al actualizar contenido de plantilla:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * DELETE - ELIMINAR PLANTILLA
   * ============================================
   * Elimina una plantilla de la base de datos
   * 
   * @param {number} id - ID de la plantilla a eliminar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async delete(id) {
    try {
      const { data, error } = await supabase
        .from('plantillas')
        .delete()
        .eq('id_plantillas', id);
      
      return { data, error };
    } catch (err) {
      console.error('Error al eliminar plantilla:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * DELETE - ELIMINAR PLANTILLAS INACTIVAS
   * ============================================
   * Elimina todas las plantillas marcadas como inactivas
   * 
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async deleteInactive() {
    try {
      const { data: plantillas, error: getError } = await this.getAll();
      
      if (getError || !plantillas) {
        return { data: null, error: getError };
      }
      
      const idsToDelete = plantillas
        .filter(p => !isEstadoActivo(p.Pla_Estado ?? p.pla_estado))
        .map(p => p.id_Plantillas ?? p.id_plantillas);
      
      if (idsToDelete.length === 0) {
        return { data: [], error: null };
      }
      
      // Eliminar cada plantilla inactiva
      const results = await Promise.all(
        idsToDelete.map(id => this.delete(id))
      );
      
      return { data: results, error: null };
    } catch (err) {
      console.error('Error al eliminar plantillas inactivas:', err);
      return { data: null, error: err };
    }
  },
  
  /**
   * ============================================
   * UTILITY - DUPLICAR PLANTILLA
   * ============================================
   * Crea una copia de una plantilla existente
   * 
   * @param {number} id - ID de la plantilla a duplicar
   * @returns {Promise<Object>} Resultado de la operación {data, error}
   */
  async duplicate(id) {
    try {
      const { data: plantilla, error: getError } = await this.getById(id);
      
      if (getError || !plantilla) {
        return { data: null, error: getError };
      }
      
      const baseName = (plantilla.Pla_Nombre || '').trim() || 'Plantilla duplicada';
      const moduleValue = plantilla.Pla_Modulo || '';

      const nuevaPlantilla = {
        Pla_Nombre: `${baseName} (Copia)`,
        Pla_Modulo: moduleValue,
        Pla_Asunto: plantilla.Pla_Asunto,
        Pla_Contenido: plantilla.Pla_Contenido,
        Pla_Tipo: plantilla.Pla_Tipo,
        Pla_Estado: 'Inactivo'
      };
      
      return await this.create(nuevaPlantilla);
    } catch (err) {
      console.error('Error al duplicar plantilla:', err);
      return { data: null, error: err };
    }
  }
};
export { PlantillasCRUD };
