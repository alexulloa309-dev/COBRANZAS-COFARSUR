import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const EMPTY = {
  totalVencido: '$0',
  proximosVencer: '$0',
  clientesMora: '0',
  promesas: '0',
};

function fmt(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Verificar que hay credenciales reales
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      return NextResponse.json(EMPTY);
    }

    // Una sola query para todo lo que necesitamos
    const { data, error } = await supabase
      .from('vencimientos')
      .select('monto_vencido, dias_mora, cliente_id');

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json(EMPTY);
    }

    let totalVencido = 0;
    let totalProximos = 0;
    const clientesMoraSet = new Set<string>();

    (data || []).forEach((v: any) => {
      const monto = Number(v.monto_vencido) || 0;
      const dias  = Number(v.dias_mora)     || 0;

      totalVencido += monto;

      if (dias > 0 && dias <= 30) {
        totalProximos += monto;
      }

      if (dias > 0 && v.cliente_id) {
        clientesMoraSet.add(String(v.cliente_id));
      }
    });

    // Promesas (no crashear si falla)
    let promesasCount = 0;
    try {
      const { count } = await supabase
        .from('promesas_pago')
        .select('*', { count: 'exact', head: true });
      promesasCount = count || 0;
    } catch {
      // tabla vacía o no existe — ignorar
    }

    return NextResponse.json({
      totalVencido:   fmt(totalVencido),
      proximosVencer: fmt(totalProximos),
      clientesMora:   String(clientesMoraSet.size),
      promesas:       String(promesasCount),
    });

  } catch (err: any) {
    console.error('Dashboard error:', err?.message || err);
    return NextResponse.json(EMPTY);
  }
}
