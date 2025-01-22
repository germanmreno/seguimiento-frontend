import ExcelJS from 'exceljs';

// Updated office ID to Excel cell mapping
//
// prettier-ignore
const OFFICE_MAPPING = {
  "100": "L18",    // PRESIDENCIA
  "101": "L18",    // VICEPRESIDENCIA
  "109": "L19",    // OFICINA DE ADMINISTRACIÓN Y FINANZAS
  "102": "L20",    // OFICINA DE AUDITORÍA INTERNA
  "103": "L21",    // CONSULTORÍA JURÍDICA
  "104": "L22",    // OFICINA DE PLANIFICACIÓN, PRESUPUESTO Y ORIGANIZACIÓN
  "105": "L23",    // OFICINA DE GESTIÓN HUMANA
  "107": "L24",    // OFICINA DE SEGURIDAD INTEGRAL
  "108": "L25",    // OFICINA DE ATENCIÓN AL CIUDADANO
  "110": "L26",    // OFICINA DE SEGUIMIENTO Y CONTROL
  "111": "L27",    // OFICINA DE GESTIÓN COMUNICACIONAL
  "112": "S18",    // OFICINA DE TECNOLOGÍA DE LA INFORMACIÓN
  "106": "S19",    // GERENCIA GENERAL DE PROYECTO DE DESARROLLO MINERO
  "114": "S20",    // GERENCIA GENERAL DE GESTIÓN ECOSOCIALISTA
  "115": "S21",    // GERENCIA GENERAL DE PRODUCCIÓN E INDUSTRIALIZACIÓN MINERA
  "116": "S22",    // GERENCIA GENERAL DE COMERCIALIZACIÓN
  "117": "S23",    // GERENCIA GENERAL DE REGIONES
  "201": "S24",    // GERENCIA OPERACIONAL LOMA DE NÍQUEL
  "900": "S25",    // GERENCIA OPERACIONAL PIM III CHOCÓ
  "901": "S26",    // GERENCIA OPERACIONAL PLANTA SANTA BÁRBARA
  "902": "S27"     // GERENCIA OPERACIONAL PLANTA LAS VAINITAS
};

export async function generateMemoExcel(data) {
  try {
    console.log('Starting Excel generation with data:', data);

    // Load template and setup
    const response = await fetch('/templates/template_instruction.xlsx');
    if (!response.ok) {
      throw new Error(
        `Failed to load template: ${response.status} ${response.statusText}`
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error('Template worksheet not found');
    }

    // Safe cell update function
    const updateCell = (cellRef, value) => {
      try {
        if (!cellRef) return;
        const cell = worksheet.getCell(cellRef);
        if (cell) {
          cell.value = value || '';
          console.log(`Updated cell ${cellRef} with value:`, value);
        }
      } catch (error) {
        console.warn(`Error updating cell ${cellRef}:`, error);
      }
    };

    // Parse date and time
    const receptionDate = new Date(data.reception_date);
    console.log('Reception date:', receptionDate);

    // Format date components
    const day = receptionDate.getDate();
    const month = receptionDate.getMonth() + 1;
    const year = receptionDate.getFullYear();

    // Parse time from the reception_hour string (format: "HH:mm")
    let hour = 0;
    let minute = 0;

    if (data.reception_hour) {
      const [hourStr, minuteStr] = data.reception_hour.split(':');
      hour = parseInt(hourStr, 10);
      minute = parseInt(minuteStr, 10);
    } else if (data.receptionHour && data.receptionMinute) {
      hour = parseInt(data.receptionHour, 10);
      minute = parseInt(data.receptionMinute, 10);
    }

    console.log('Parsed time:', { hour, minute });

    // Convert 24-hour format to 12-hour format
    const hour12 = hour % 12 || 12;
    const isAM = hour < 12;

    console.log('Converted time:', { hour12, isAM });

    // Update date fields
    updateCell('D8', day.toString().padStart(2, '0'));
    updateCell('F8', month.toString().padStart(2, '0'));
    updateCell('H8', year.toString());

    // Update time fields with proper formatting
    updateCell('D11', hour12.toString().padStart(2, '0')); // Hour in 12-hour format
    updateCell('F11', minute.toString().padStart(2, '0')); // Minute with leading zero
    updateCell('H11', isAM ? 'X' : ''); // AM marker
    updateCell('H12', !isAM ? 'X' : ''); // PM marker

    // Basic information
    updateCell('K8', data.id);
    updateCell('K14', data.applicant);
    updateCell('C16', data.name);

    // Reception method mapping
    const receptionMethodMap = {
      MESA_DE_PARTES: 'M8', // MESA DE PARTES
      CORREO: 'M10', // CORREO ELECTRÓNICO
      PRE_VP: 'M12', // PRE - VP
    };

    if (data.reception_method) {
      const cellRef = receptionMethodMap[data.reception_method];
      if (cellRef) {
        updateCell(cellRef, 'X');
        console.log(
          `Marked reception method ${data.reception_method} at cell ${cellRef}`
        );
      }
    }

    // Attachment type mapping
    const attachmentTypeMap = {
      CARPETA: 'Q8', // CARPETA
      IMPRESO: 'Q10', // DOCUMENTOS
      DIGITAL: 'Q10', // DOCUMENTOS
      PENDRIVE: 'Q12', // PENDRIVE/CD
      CD: 'Q12', // PENDRIVE/CD
    };

    // Handle attachment types
    if (Array.isArray(data.attachment_type)) {
      console.log('Processing attachment types:', data.attachment_type);

      const markedCells = new Set(); // To avoid marking the same cell multiple times

      data.attachment_type.forEach((type) => {
        const cellRef = attachmentTypeMap[type];
        if (cellRef && !markedCells.has(cellRef)) {
          const cell = worksheet.getCell(cellRef);
          cell.value = 'X';
          cell.font = {
            bold: true,
            size: 12,
          };
          cell.alignment = {
            vertical: 'center',
            horizontal: 'center',
          };
          markedCells.add(cellRef);
          console.log(
            `Marked attachment type ${type} at cell ${cellRef} with formatting`
          );
        }
      });
    }

    // Handle office marking with detailed debugging
    if (Array.isArray(data.offices)) {
      console.group('Office Processing');
      console.log('Full data received:', data);
      console.log('Offices array:', data.offices);

      data.offices.forEach((officeData, index) => {
        console.group(`Processing office ${index + 1}`);
        console.log('Full office data:', officeData);
        console.log('Office ID:', officeData.office_id);
        console.log('Office details:', officeData.office);

        const officeId = officeData.office_id;
        const cellRef = OFFICE_MAPPING[officeId];

        console.log('Mapped cell reference:', cellRef);

        try {
          if (cellRef) {
            const cell = worksheet.getCell(cellRef);
            console.log('Cell before update:', cell.value);

            cell.value = 'X';
            cell.font = {
              bold: true,
              size: 12,
            };
            cell.alignment = {
              vertical: 'center',
              horizontal: 'center',
            };

            console.log('Cell after update:', {
              value: cell.value,
              font: cell.font,
              alignment: cell.alignment,
            });
            console.log(
              `✓ Successfully marked office ${officeData.office.name} (${officeId}) at cell ${cellRef}`
            );
          } else {
            console.warn(`⚠ No cell mapping found for office ID: ${officeId}`);
          }
        } catch (error) {
          console.error(`Error processing office ${officeId}:`, error);
        }

        console.groupEnd();
      });

      console.groupEnd();
    } else {
      console.warn('⚠ No offices array found in data or invalid format:', {
        hasOffices: Boolean(data.offices),
        officesType: typeof data.offices,
        data: data,
      });
    }

    // Generate and download file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Remision_${data.id}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error generating Excel:', error);
    throw new Error(`Error al generar la remisión: ${error.message}`);
  }
}
