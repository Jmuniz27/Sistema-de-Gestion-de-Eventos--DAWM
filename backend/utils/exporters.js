/**
 * ============================================
 * SISTEMA DE GESTIÓN DE EVENTOS - ESPOL
 * Utilidades de Exportación de Datos
 * ============================================
 *
 * Este archivo proporciona funciones para exportar datos en diferentes formatos:
 * - PDF
 * - Excel
 * - CSV
 * - JSON
 * - TXT
 *
 * Materia: SOFG1006 - Desarrollo de Aplicaciones Web y Móviles
 * Institución: Escuela Superior Politécnica del Litoral (ESPOL)
 */

// ============================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

// ============================================
// EXPORTACIÓN A PDF
// ============================================
/**
 * Exportar datos a PDF
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {Object} options - Opciones de configuración
 * @param {string} options.title - Título del documento
 * @param {string} options.subtitle - Subtítulo del documento
 * @param {Array} options.columns - Columnas a mostrar
 * @returns {Promise<Buffer>} Buffer del PDF generado
 */
const exportToPDF = async (data, options = {}) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear documento PDF
      const doc = new PDFDocument({ margin: 50 });

      // Buffer para almacenar el PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Configuración
      const title = options.title || 'Reporte';
      const subtitle = options.subtitle || 'Sistema de Gestión de Eventos - ESPOL';
      const columns = options.columns || Object.keys(data[0] || {});

      // Encabezado
      doc.fontSize(20).text(title, { align: 'center' });
      doc.fontSize(12).text(subtitle, { align: 'center' });
      doc.fontSize(10).text(`Fecha: ${new Date().toLocaleString('es-EC')}`, { align: 'right' });
      doc.moveDown(2);

      // Datos en formato tabla simple
      data.forEach((item, index) => {
        if (index > 0) doc.moveDown();

        columns.forEach(column => {
          const value = item[column] !== undefined && item[column] !== null
            ? String(item[column])
            : 'N/A';
          doc.fontSize(10).text(`${column}: ${value}`);
        });

        doc.moveDown(0.5);
        doc.strokeColor('#cccccc').lineWidth(0.5)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      });

      // Pie de página
      doc.moveDown(2);
      doc.fontSize(8).text(
        `Total de registros: ${data.length}`,
        { align: 'center' }
      );

      // Finalizar documento
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

// ============================================
// EXPORTACIÓN A EXCEL
// ============================================
/**
 * Exportar datos a Excel
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {Object} options - Opciones de configuración
 * @param {string} options.sheetName - Nombre de la hoja
 * @param {string} options.title - Título del documento
 * @returns {Promise<Buffer>} Buffer del archivo Excel
 */
const exportToExcel = async (data, options = {}) => {
  try {
    // Crear libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const sheetName = options.sheetName || 'Datos';
    const worksheet = workbook.addWorksheet(sheetName);

    // Configuración
    const title = options.title || 'Reporte';

    // Agregar título
    worksheet.addRow([title]);
    worksheet.getRow(1).font = { size: 16, bold: true };
    worksheet.mergeCells('A1:' + String.fromCharCode(65 + Object.keys(data[0] || {}).length - 1) + '1');

    // Agregar fecha
    worksheet.addRow([`Fecha: ${new Date().toLocaleString('es-EC')}`]);
    worksheet.addRow([]); // Fila vacía

    // Obtener columnas
    const columns = Object.keys(data[0] || {});

    // Agregar encabezados
    worksheet.addRow(columns);
    const headerRow = worksheet.lastRow;
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    headerRow.font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Agregar datos
    data.forEach(item => {
      const row = columns.map(col => item[col]);
      worksheet.addRow(row);
    });

    // Ajustar ancho de columnas
    columns.forEach((col, index) => {
      const column = worksheet.getColumn(index + 1);
      const maxLength = Math.max(
        col.length,
        ...data.map(row => String(row[col] || '').length)
      );
      column.width = Math.min(maxLength + 2, 50);
    });

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

  } catch (error) {
    throw new Error(`Error al exportar a Excel: ${error.message}`);
  }
};

// ============================================
// EXPORTACIÓN A CSV
// ============================================
/**
 * Exportar datos a CSV
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {Object} options - Opciones de configuración
 * @param {Array} options.fields - Campos a incluir
 * @returns {string} String en formato CSV
 */
const exportToCSV = (data, options = {}) => {
  try {
    const fields = options.fields || Object.keys(data[0] || {});

    const parser = new Parser({
      fields,
      delimiter: ',',
      quote: '"',
      header: true,
      encoding: 'utf-8'
    });

    const csv = parser.parse(data);
    return csv;

  } catch (error) {
    throw new Error(`Error al exportar a CSV: ${error.message}`);
  }
};

// ============================================
// EXPORTACIÓN A JSON
// ============================================
/**
 * Exportar datos a JSON
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {Object} options - Opciones de configuración
 * @param {boolean} options.pretty - Formatear JSON con indentación
 * @returns {string} String en formato JSON
 */
const exportToJSON = (data, options = {}) => {
  try {
    const pretty = options.pretty !== undefined ? options.pretty : true;

    const json = pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    return json;

  } catch (error) {
    throw new Error(`Error al exportar a JSON: ${error.message}`);
  }
};

// ============================================
// EXPORTACIÓN A TXT
// ============================================
/**
 * Exportar datos a TXT (formato tabla)
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {Object} options - Opciones de configuración
 * @param {string} options.title - Título del documento
 * @returns {string} String en formato TXT
 */
const exportToTXT = (data, options = {}) => {
  try {
    const title = options.title || 'Reporte';
    const columns = Object.keys(data[0] || {});

    let txt = '';

    // Encabezado
    txt += '='.repeat(80) + '\n';
    txt += title.toUpperCase().padStart((80 + title.length) / 2) + '\n';
    txt += 'Sistema de Gestión de Eventos - ESPOL\n';
    txt += `Fecha: ${new Date().toLocaleString('es-EC')}\n`;
    txt += '='.repeat(80) + '\n\n';

    // Datos
    data.forEach((item, index) => {
      txt += `Registro ${index + 1}:\n`;
      txt += '-'.repeat(80) + '\n';

      columns.forEach(column => {
        const value = item[column] !== undefined && item[column] !== null
          ? String(item[column])
          : 'N/A';
        txt += `${column.padEnd(20)}: ${value}\n`;
      });

      txt += '\n';
    });

    // Pie
    txt += '='.repeat(80) + '\n';
    txt += `Total de registros: ${data.length}\n`;
    txt += '='.repeat(80) + '\n';

    return txt;

  } catch (error) {
    throw new Error(`Error al exportar a TXT: ${error.message}`);
  }
};

// ============================================
// FUNCIÓN PRINCIPAL DE EXPORTACIÓN
// ============================================
/**
 * Exportar datos en el formato especificado
 *
 * @param {Array} data - Array de objetos a exportar
 * @param {string} format - Formato de exportación (pdf, excel, csv, json, txt)
 * @param {Object} options - Opciones de configuración
 * @returns {Promise<Buffer|string>} Datos exportados
 */
const exportData = async (data, format, options = {}) => {
  // Validar que haya datos
  if (!data || data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Normalizar formato
  const normalizedFormat = format.toLowerCase();

  // Exportar según formato
  switch (normalizedFormat) {
    case 'pdf':
      return await exportToPDF(data, options);

    case 'excel':
    case 'xlsx':
      return await exportToExcel(data, options);

    case 'csv':
      return exportToCSV(data, options);

    case 'json':
      return exportToJSON(data, options);

    case 'txt':
    case 'text':
      return exportToTXT(data, options);

    default:
      throw new Error(`Formato no soportado: ${format}`);
  }
};

// ============================================
// FUNCIÓN HELPER PARA OBTENER CONTENT-TYPE
// ============================================
/**
 * Obtener el Content-Type según el formato
 *
 * @param {string} format - Formato de exportación
 * @returns {string} Content-Type
 */
const getContentType = (format) => {
  const contentTypes = {
    pdf: 'application/pdf',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    json: 'application/json',
    txt: 'text/plain',
    text: 'text/plain'
  };

  return contentTypes[format.toLowerCase()] || 'application/octet-stream';
};

/**
 * Obtener la extensión del archivo según el formato
 *
 * @param {string} format - Formato de exportación
 * @returns {string} Extensión del archivo
 */
const getFileExtension = (format) => {
  const extensions = {
    pdf: 'pdf',
    excel: 'xlsx',
    xlsx: 'xlsx',
    csv: 'csv',
    json: 'json',
    txt: 'txt',
    text: 'txt'
  };

  return extensions[format.toLowerCase()] || 'bin';
};

// ============================================
// EXPORTACIONES
// ============================================
module.exports = {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  exportToJSON,
  exportToTXT,
  exportData,
  getContentType,
  getFileExtension
};
