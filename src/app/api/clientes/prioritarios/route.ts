import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Buscar vencimientos con mora > 0 y <= 30 días, con info del cliente
    const { data: vencimientos, error } = await supabase
      .from('vencimientos')
      .select(`
        vencimiento_id,
        monto_vencido,
        dias_mora,
        clientes (
          cliente_id,
          nombre,
          cadena,
          zona_comercial
        )
      `)
      .gt('dias_mora', 0)
      .lte('dias_mora', 30);

    if (error) throw error;

    // Agrupar por cadena
    const chainsMap = new Map();

    vencimientos?.forEach((venc: any) => {
      const cliente = venc.clientes;
      if (!cliente) return;
      
      const cadenaName = cliente.cadena || cliente.nombre;

      if (!chainsMap.has(cadenaName)) {
        chainsMap.set(cadenaName, {
          cadena: cadenaName,
          totalDeuda: 0,
          clientes: []
        });
      }

      const group = chainsMap.get(cadenaName);
      group.totalDeuda += Number(venc.monto_vencido);
      
      // Chequear si el cliente ya está en la lista
      const existingClient = group.clientes.find((c: any) => c.id === cliente.cliente_id);
      if (existingClient) {
        existingClient.montoVencido += Number(venc.monto_vencido);
        if (Number(venc.dias_mora) > existingClient.diasMora) {
          existingClient.diasMora = Number(venc.dias_mora);
        }
      } else {
        group.clientes.push({
          id: cliente.cliente_id,
          nombre: cliente.nombre,
          zona: cliente.zona_comercial,
          diasMora: Number(venc.dias_mora),
          montoVencido: Number(venc.monto_vencido),
          tipo: 'Prioritario'
        });
      }
    });

    const result = Array.from(chainsMap.values()).sort((a, b) => b.totalDeuda - a.totalDeuda);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching prioritarios:', error);
    return NextResponse.json({ error: 'Error fetching prioritarios', details: error.message }, { status: 500 });
  }
}
