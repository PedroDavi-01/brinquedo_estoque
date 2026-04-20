"use server";

import { db } from "@/lib/db";
import { movimentacoes, produtos, usuarios } from "@/lib/schema";
import { desc, eq, sql, and, gte } from "drizzle-orm";

export async function getDashboardData() {
  try {
    // Total de Produtos
    const resTotalProdutos = await db.select({ count: sql<number>`count(*)` }).from(produtos);
    const totalProdutos = Number(resTotalProdutos[0]?.count || 0);

    // Entradas no mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const resEntradas = await db
      .select({ count: sql<number>`sum(${movimentacoes.quantidade})` })
      .from(movimentacoes)
      .where(
        and(
          eq(movimentacoes.tipo, "ENTRADA"),
          gte(movimentacoes.data, inicioMes)
        )
      );
    const totalEntradas = Number(resEntradas[0]?.count || 0);

    // Estoque baixo (Atenção)
    const resEstoqueBaixo = await db
      .select({ count: sql<number>`count(*)` })
      .from(produtos)
      .where(sql`${produtos.qtdAtual} <= ${produtos.qtdMinima}`); 

    const estoqueBaixo = Number(resEstoqueBaixo[0]?.count || 0);

    // 4. Feed de últimas 5 atividades
    const ultimasMovimentacoes = await db
      .select({
        id: movimentacoes.id,
        tipo: movimentacoes.tipo,
        quantidade: movimentacoes.quantidade,
        data: movimentacoes.data,
        produtoNome: produtos.nome,
        usuarioNome: usuarios.nome,
      })
      .from(movimentacoes)
      .innerJoin(produtos, eq(movimentacoes.produtoId, produtos.id))
      .innerJoin(usuarios, eq(movimentacoes.usuarioId, usuarios.id))
      .orderBy(desc(movimentacoes.data))
      .limit(5);

    // Lista completa para relatórios
    const listaProdutos = await db.select().from(produtos).orderBy(produtos.nome);

    return {
      totalProdutos,
      totalEntradas,
      estoqueBaixo,
      ultimasMovimentacoes,
      listaProdutos
    };
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return {
      totalProdutos: 0,
      totalEntradas: 0,
      estoqueBaixo: 0,
      ultimasMovimentacoes: [],
      listaProdutos: []
    };
  }
}