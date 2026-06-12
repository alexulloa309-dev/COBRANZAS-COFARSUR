import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente_id, monto_prometido, fecha_compromiso, observaciones, registrado_por } = body;

    if (!cliente_id || !monto_prometido || !fecha_compromiso) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (cliente_id, monto_prometido, fecha_compromiso)' },
        { status: 400 }
      );
    }

    // 1. Insertar la promesa de pago
    const { data: promesa, error: promesaError } = await supabase
      .from('promesas_pago')
      .insert([{
        cliente_id,
        monto_prometido,
        fecha_compromiso,
        observaciones,
        registrado_por: registrado_por || 'Usuario Web',
        estado: 'vigente'
      }])
      .select()
      .single();

    if (promesaError) throw promesaError;

    // 2. Registrar el movimiento en la auditoría
    const { error: movError } = await supabase
      .from('movimientos')
      .insert([{
        cliente_id,
        tipo: 'promesa_registrada',
        descripcion: `Promesa de pago registrada por ${monto_prometido} para el día ${fecha_compromiso}`,
        datos_adicionales: { promesa_id: promesa.promesa_id, observaciones }
      }]);

    if (movError) {
      console.warn('No se pudo registrar el movimiento de auditoría:', movError);
    }

    return NextResponse.json({ success: true, promesa }, { status: 201 });
  } catch (error: any) {
    console.error('Error registrando promesa de pago:', error);
    return NextResponse.json(
      { error: 'Error registrando la promesa de pago', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Obtener las promesas vigentes
    const { data: promesas, error } = await supabase
      .from('promesas_pago')
      .select(`
        *,
        clientes (nombre, cadena)
      `)
      .eq('estado', 'vigente')
      .order('fecha_compromiso', { ascending: true });

    if (error) throw error;

    return NextResponse.json(promesas);
  } catch (error: any) {
    console.error('Error obteniendo promesas:', error);
    return NextResponse.json({ error: 'Error obteniendo promesas', details: error.message }, { status: 500 });
  }
}
