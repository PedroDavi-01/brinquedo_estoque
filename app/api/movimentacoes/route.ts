import { db } from '@/lib/db';
import { movimentacoes, produtos } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tipo, quantidade, produtoId, usuarioId } = await request.json();

    //  Buscar o produto para saber a quantidade atual
    const produto = await db.select().from(produtos).where(eq(produtos.id, produtoId)).limit(1);
    
    if (produto.length === 0) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const qtdAntiga = produto[0].qtdAtual;
    // Calcula a nova quantidade (soma se for entrada, subtrai se for saída)
    const novaQtd = tipo === 'entrada' ? qtdAntiga + quantidade : qtdAntiga - quantidade;

    // Criar o registro de movimentação
    await db.insert(movimentacoes).values({
      tipo,
      quantidade,
      produtoId,
      usuarioId,
    });

    // Atualizar a quantidade no estoque do produto
    await db.update(produtos)
      .set({ qtdAtual: novaQtd })
      .where(eq(produtos.id, produtoId));

    return NextResponse.json({ message: "Movimentação registrada e estoque atualizado!", novaQtd });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}