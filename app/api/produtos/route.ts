import { db } from '@/lib/db';
import { produtos } from '@/lib/schema';
import { NextResponse } from 'next/server';

// 1. Rota para LISTAR produtos (GET)
export async function GET() {
  try {
    const todosProdutos = await db.select().from(produtos);
    return NextResponse.json(todosProdutos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Rota para CRIAR produto (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const novoProduto = await db.insert(produtos).values({
      nome: body.nome,
      categoria: body.categoria,
      faixaEtaria: body.faixaEtaria,
      preco: body.preco,
      qtdAtual: body.qtdAtual,
      qtdMinima: body.qtdMinima,
    }).returning();

    return NextResponse.json(novoProduto[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}