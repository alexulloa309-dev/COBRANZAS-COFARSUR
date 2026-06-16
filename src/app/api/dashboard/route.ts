import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function formatCurrency(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

export async function GET() {
  try {
    // Total vencido (all)
    const { data: allVenc, error: e1 } = await supabase
      .from('vencimientos')
      .select('monto_vencido, dias_mora');

    if (e1) throw e1;

    let totalVencido = 0;
    let totalProximos = 0;
    let clientesMoraSet = new Set<string>();
    let clientesIds: string[] = [];

    // We need client IDs to count unique clients in mora
    const { data: allVencFull, error: e1b } = await supabase
      .from('vencimientos')
      .select('monto_vencido, dias_mora, cliente_id');

    if (e1b) throw e1b;

    (allVencFull || []).forEach((v: any) => {
      const monto = Number(v.monto_vencido) || 0;
      const dias = Number(v.dias_mora) || 0;
      
      totalVencido += monto;
      
      if (dias > 0 && dias <= 30) {
        totalProximos += monto;
      }
      
      if (dias > 0) {
        clientesMoraSet.add(v.cliente_id);
      }
    });

    // Count promesas
    const { count: promesasCount, error: e2 } = await supabase
      .from('promesas_pago')
      .select('*', { count: 'exact', head: true });

    if (e2) throw e2;

    return NextResponse.json({
      totalVencido: formatCurrency(totalVencido),
      proximosVencer: formatCurrency(totalProximos),
      clientesMora: String(clientesMoraSet.size),
      promesas: String(promesasCount || 0),
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({
      totalVencido: "$0",
      proximosVencer: "$0",
      clientesMora: "0",
      promesas: "0",
    });
  }
}
