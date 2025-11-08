/**
 * Utilidades compartidas para tablas públicas.
 * Centraliza comportamientos repetidos en notificaciones, plantillas, etc.
 */

/**
 * Escapa caracteres especiales antes de insertar texto como HTML.
 * @param {string} value - Cadena potencialmente insegura.
 * @returns {string} Cadena segura para innerHTML.
 */
export function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Limita la longitud de un texto y añade puntos suspensivos.
 * @param {string} text - Texto original.
 * @param {number} maxLength - Máximo permitido antes de truncar.
 * @returns {string} Texto truncado o el original si no supera el límite.
 */
export function truncateText(text, maxLength = 160) {
  const value = text ?? '';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(maxLength - 1, 0))}…`;
}

/**
 * Inserta una fila con mensaje (cargando, error, vacío) en un tbody de tabla.
 * @param {HTMLTableSectionElement} tbody - Sección donde se colocará el mensaje.
 * @param {string} message - Texto a mostrar al usuario.
 * @param {number} totalColumns - Número total de columnas visibles para ajustar colspan.
 * @param {string} [state] - Modificador visual (loading|error|empty...).
 */
export function setTableMessage(tbody, message, totalColumns, state) {
  if (!tbody) return;

  const classes = ['table-message'];
  if (state) classes.push(`table-message--${state}`);
  tbody.innerHTML = `
    <tr>
      <td colspan="${totalColumns}" class="${classes.join(' ')}">${escapeHtml(message)}</td>
    </tr>
  `;
}
