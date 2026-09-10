import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';

function cleanNumber(val: any): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return val;
  let clean = val.toString().replace(/[\$\s%]/g, '');
  if (clean.includes(',') && clean.includes('.')) {
    clean = clean.replace(/\./g, '').replace(/,/g, '.');
  } else if (clean.includes(',')) {
    clean = clean.replace(/,/g, '.');
  }
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    let fileBuffer: Buffer | null = null;

    // Aceptar cualquier archivo .xlsx (solo uno)
    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        break; // Solo necesitamos un archivo
      }
    }

    if (!fileBuffer) {
      return NextResponse.json(
        { error: 'Se requiere un archivo Excel (Análisis de Clientes)' },
        { status: 400 }
      );
    }

    // Leer el archivo
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Auto-detectar la hoja correcta: tiene que tener Id, Cliente, Venci Men 30, Dias Mora
    let sheetData: any[] = [];
    let foundSheet = '';

    for (const sheetName of workbook.SheetNames) {
      const rawRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }) as any[][];
      const headers = (rawRows[0] || []).map((h: any) => (h || '').toString().trim());
      const hasId     = headers.includes('Id') || headers.includes('ID');
      const hasCliente = headers.includes('Cliente');
      const hasMonto  = headers.some(h => h.includes('Venci'));

      if (hasId && hasCliente && hasMonto) {
        // Construir el array de objetos con headers como keys
        sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];
        foundSheet = sheetName;
        break;
      }
    }

    if (sheetData.length === 0) {
      return NextResponse.json(
        { error: 'No se encontró hoja con el formato esperado. El archivo debe tener columnas: Id, Cliente, Activo, Venci Men 30, Dias Mora' },
        { status: 400 }
      );
    }

    const clientesToInsert = new Map<string, any>();
    const vencimientosToInsert: any[] = [];
    const timestamp = Date.now();

    sheetData.forEach((row: any) => {
      const id = String(row['Id'] || row['ID'] || '').trim();
      if (!id) return;

      // Columnas del Análisis de Clientes
      const clientName   = (row['Cliente'] || `Cliente #${id}`).toString().trim();
      const cadenaName   = (row['Cadena']  || clientName).toString().trim();
      const activo       = (row['Activo']  || '').toString().trim().toUpperCase();
      const montoVencido = cleanNumber(row['Venci Men 30']);
      const diasMora     = cleanNumber(row['Dias Mora'] || row['Días Mora'] || row['% Mora']);
      const zonaComercial = (row['Zona Comercial'] || row['Zona'] || '').toString().trim();
      const maxVta       = cleanNumber(row['Max vta'] || row['Max Vta']);
      const cierreRes    = (row['Cierre res'] || null);
      const diasCierre   = cleanNumber(row['Días cierre'] || row['Dias cierre'] || 0);
      const diasCondicion = cleanNumber(row['Días'] || row['Das'] || 0);

      // Solo clientes activos con deuda
      if (activo !== 'SI' || montoVencido <= 0) return;

      if (!clientesToInsert.has(id)) {
        clientesToInsert.set(id, {
          cliente_id:     id,
          nombre:         clientName,
          cadena:         cadenaName || clientName,
          zona_comercial: zonaComercial,
          dias_condicion: diasCondicion,
          max_vta:        maxVta,
          cierre_res:     cierreRes,
          dias_cierre:    diasCierre,
          estado:         'activo',
        });
      }

      vencimientosToInsert.push({
        vencimiento_id: `venc_${id}_${timestamp}`,
        cliente_id:     id,
        monto_vencido:  montoVencido,
        dias_mora:      diasMora,
        estado_alerta:  diasMora > 30 ? 'mora_real' : (diasMora > 0 ? 'sin_alerta' : 'sin_alerta'),
      });
    });

    const clientesArray = Array.from(clientesToInsert.values());

    // Insertar clientes
    if (clientesArray.length > 0) {
      const { error: errorClientes } = await supabase
        .from('clientes')
        .upsert(clientesArray, { onConflict: 'cliente_id' });
      if (errorClientes) {
        console.error('Error insertando clientes:', errorClientes);
        return NextResponse.json(
          { error: 'Error al guardar clientes en base de datos', details: errorClientes.message },
          { status: 500 }
        );
      }
    }

    // Limpiar vencimientos anteriores e insertar nuevos
    if (vencimientosToInsert.length > 0) {
      await supabase.from('vencimientos').delete().neq('dias_mora', -999);

      const { error: errorVenc } = await supabase
        .from('vencimientos')
        .insert(vencimientosToInsert);
      if (errorVenc) {
        console.error('Error insertando vencimientos:', errorVenc);
        return NextResponse.json(
          { error: 'Error al guardar vencimientos en base de datos', details: errorVenc.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: `Archivo procesado correctamente (hoja: "${foundSheet}")`,
      stats: {
        clientes:     clientesArray.length,
        vencimientos: vencimientosToInsert.length,
      },
    });

  } catch (error: any) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error procesando archivo', details: error.message },
      { status: 500 }
    );
  }
}
