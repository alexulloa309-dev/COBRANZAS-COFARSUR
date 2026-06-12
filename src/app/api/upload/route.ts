import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';

function cleanNumber(val: any): number {
    if (val === undefined || val === null) return 0;
    if (typeof val === 'number') return val;
    let clean = val.toString().replace(/[\$\s]/g, '');
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
    
    let masterBuffer: Buffer | null = null;
    let creditBuffer: Buffer | null = null;

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        if (value.name.toUpperCase().includes('ANALISIS')) {
          masterBuffer = buffer;
        } else if (value.name.toUpperCase().includes('CREDITO') || value.name.toUpperCase().includes('CRÉDITO')) {
          creditBuffer = buffer;
        } else {
          if (!masterBuffer) masterBuffer = buffer;
          else if (!creditBuffer) creditBuffer = buffer;
        }
      }
    }

    if (!masterBuffer || !creditBuffer) {
      return NextResponse.json(
        { error: 'Se requieren dos archivos Excel (Maestro y Crédito)' },
        { status: 400 }
      );
    }

    // 1. Leer Maestro
    const masterWorkbook = XLSX.read(masterBuffer, { type: 'buffer' });
    const masterData = XLSX.utils.sheet_to_json(masterWorkbook.Sheets[masterWorkbook.SheetNames[0]]);
    
    const masterMap = new Map();
    masterData.forEach((row: any) => {
      const id = row['Id'];
      if (id) {
        masterMap.set(String(id).trim(), {
          id: String(id).trim(),
          zonaComercial: row['Zona Comercial'] || '',
          cadena: (row['Cadena'] || '').toString().trim(),
          cliente: (row['Cliente'] || '').toString().trim(),
          maxVenta: cleanNumber(row['Max vta']),
          diasCondicion: cleanNumber(row['Días'] || row['Das']),
          diasCierre: cleanNumber(row['Días cierre'] || row['Das cierre']),
          cierreRes: row['Cierre res'] || null,
        });
      }
    });

    // 2. Leer Crédito
    const creditWorkbook = XLSX.read(creditBuffer, { type: 'buffer' });
    const creditData = XLSX.utils.sheet_to_json(creditWorkbook.Sheets[creditWorkbook.SheetNames[0]]);

    const clientesToInsert = new Map();
    const vencimientosToInsert: any[] = [];

    creditData.forEach((row: any) => {
      const id = String(row['CLi. Id'] || '').trim();
      if (!id) return;

      const masterInfo = masterMap.get(id);
      const diasMora = cleanNumber(row['Dias']);
      const totalVencido = cleanNumber(row['Tot.Vencido']);

      const clientName = (row['Cliente '] || row['Cliente'] || (masterInfo ? masterInfo.cliente : `Cliente #${id}`)).toString().trim();
      const cadenaName = (row['Cadena'] || (masterInfo ? masterInfo.cadena : clientName)).toString().trim();

      if (!clientesToInsert.has(id)) {
        clientesToInsert.set(id, {
          cliente_id: id,
          nombre: clientName,
          cadena: cadenaName || clientName,
          zona_comercial: masterInfo ? masterInfo.zonaComercial : '',
          dias_condicion: masterInfo ? masterInfo.diasCondicion : 0,
          max_vta: masterInfo ? masterInfo.maxVenta : 0,
          cierre_res: masterInfo ? masterInfo.cierreRes : null,
          dias_cierre: masterInfo ? masterInfo.diasCierre : 0,
          estado: 'activo'
        });
      }

      vencimientosToInsert.push({
        vencimiento_id: `venc_${id}_${new Date().getTime()}`,
        cliente_id: id,
        monto_vencido: totalVencido,
        dias_mora: diasMora,
        estado_alerta: diasMora > 30 ? 'mora_real' : 'sin_alerta'
      });
    });

    const clientesArray = Array.from(clientesToInsert.values());
    
    // Inserción DB
    if (clientesArray.length > 0) {
      const { error: errorClientes } = await supabase
        .from('clientes')
        .upsert(clientesArray, { onConflict: 'cliente_id' });
        
      if (errorClientes) console.error('Error insertando clientes:', errorClientes);
    }

    if (vencimientosToInsert.length > 0) {
      // Opcional: borrar los anteriores
      await supabase.from('vencimientos').delete().neq('dias_mora', -1); 
      
      const { error: errorVenc } = await supabase
        .from('vencimientos')
        .insert(vencimientosToInsert);
        
      if (errorVenc) console.error('Error insertando vencimientos:', errorVenc);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Archivos procesados correctamente',
      stats: {
        clientes: clientesArray.length,
        vencimientos: vencimientosToInsert.length
      }
    });

  } catch (error: any) {
    console.error('Error en upload:', error);
    return NextResponse.json(
      { error: 'Error procesando archivos', details: error.message },
      { status: 500 }
    );
  }
}
