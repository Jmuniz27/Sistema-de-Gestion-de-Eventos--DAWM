/**
 * Helpers compartidos para la administración de plantillas.
 * Se reutilizan entre la tabla pública y el editor unificado.
 */

export const TEMPLATE_MODULES = [
  { value: 'Eventos', label: 'Eventos' },
  { value: 'Ventas', label: 'Ventas' },
  { value: 'Boletos', label: 'Boletos' },
  { value: 'Facturación', label: 'Facturación' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Clientes', label: 'Clientes' }
];

const TEMPLATE_MODULE_VALUES = TEMPLATE_MODULES.map(option => option.value);

export const TEMPLATE_NAME_SEPARATOR = '::';

function stateLabel(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const lowered = trimmed.toLowerCase();
    if (lowered.startsWith('inac') || lowered === 'inactive' || lowered === 'false' || lowered === '0') {
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

function stateIsActive(value) {
  return stateLabel(value) === 'Activo';
}

/**
 * Combina el nombre visible con el módulo para almacenarlo en una única columna.
 * Se remueve cualquier sufijo previo para evitar duplicidades.
 * @param {string} name - Nombre de la plantilla introducido en el formulario.
 * @param {string} module - Módulo seleccionado.
 * @returns {string} Nombre listo para persistir.
 */
export function buildTemplateNameWithModule(name = '', module = '') {
  const trimmedName = splitTemplateName(name).baseName.trim();
  const trimmedModule = module.trim();

  if (!trimmedName) return '';
  if (!trimmedModule) return trimmedName;

  return `${trimmedName}${TEMPLATE_NAME_SEPARATOR}${trimmedModule}`;
}

/**
 * Divide el nombre persistido para recuperar el nombre visible y el módulo embebido.
 * @param {string} rawName - Valor tomado desde la base de datos.
 * @returns {{ baseName: string, module: (string|null) }} Resultado normalizado.
 */
export function splitTemplateName(rawName = '') {
  if (typeof rawName !== 'string') {
    return { baseName: '', module: null };
  }

  const value = rawName.trim();
  if (!value) {
    return { baseName: '', module: null };
  }

  const separatorIndex = value.lastIndexOf(TEMPLATE_NAME_SEPARATOR);
  if (separatorIndex === -1) {
    return { baseName: value, module: null };
  }

  const baseName = value.slice(0, separatorIndex).trim();
  const module = value.slice(separatorIndex + TEMPLATE_NAME_SEPARATOR.length).trim();

  if (!baseName) {
    return { baseName: value, module: null };
  }

  return {
    baseName,
    module: module || null
  };
}

/**
 * Normaliza los campos devueltos por Supabase en la tabla Plantillas.
 * @param {Object} row - Registro crudo de la base de datos.
 * @returns {Object} Objeto listo para consumo en la UI.
 */
export function normalizePlantilla(row = {}) {
  const storedNameRaw = row.Pla_Nombre_Completo ?? row.pla_nombre ?? row.Pla_Nombre ?? '';
  const { baseName, module: embeddedModule } = splitTemplateName(storedNameRaw);

  const preferredModule = row.pla_modulo ?? row.Pla_Modulo ?? embeddedModule;
  const normalizedModule = TEMPLATE_MODULE_VALUES.includes(preferredModule)
    ? preferredModule
    : TEMPLATE_MODULES[0].value;
  const rawState = row.pla_estado ?? row.Pla_Estado ?? null;
  const normalizedState = stateLabel(rawState);

  return {
    id: row.id_plantillas ?? row.id ?? null,
    name: baseName || storedNameRaw,
    module: normalizedModule,
    storedName: storedNameRaw,
    subject: row.pla_asunto ?? row.Pla_Asunto ?? '',
    // Solo se aceptan plantillas para email o push; default a Email si falta
    type: row.pla_tipo ?? row.Pla_Tipo ?? 'Email',
    // El estado activo define si la plantilla está lista para utilizarse
    isActive: stateIsActive(rawState),
    status: normalizedState,
    createdAt: row.pla_fechacreacion ?? row.Pla_FechaCreacion ?? row.created_at ?? null,
    updatedAt: row.pla_fechaultimamodificacion ?? row.Pla_FechaUltimaModificacion ?? null,
    content: row.pla_contenido ?? row.Pla_Contenido ?? ''
  };
}
