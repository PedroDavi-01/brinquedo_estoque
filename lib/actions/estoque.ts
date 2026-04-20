"use server";

import { db } from "@/lib/db"; 
import { produtos } from "@/lib/schema"; 
import { sql } from "drizzle-orm";

export async function getDadosEstoque() {
  try {
    const todosProdutos = await db.select().from(produtos);

    //  Saúde baseada em qtdAtual e qtdMinima
    const emDia = todosProdutos.filter(p => p.qtdAtual >= p.qtdMinima).length;
    const critico = todosProdutos.filter(p => p.qtdAtual < p.qtdMinima).length;

    //  Agrupamento por Categoria 
    const categoriasData = await db
      .select({
        name: produtos.categoria,
        total: sql<number>`sum(${produtos.qtdAtual})`.mapWith(Number),
      })
      .from(produtos)
      .groupBy(produtos.categoria);

    // Produtos Críticos
    const produtosCriticos = todosProdutos
      .filter(p => p.qtdAtual < p.qtdMinima)
      .sort((a, b) => a.qtdAtual - b.qtdMinima)
      .slice(0, 4);

    return {
      saude: [
        { name: "Em Dia", value: emDia, fill: "#3b82f6" },
        { name: "Crítico", value: critico, fill: "#ef4444" },
      ],
      categorias: categoriasData,
      produtosCriticos: produtosCriticos.map(p => ({
        id: p.id,
        nome: p.nome,
        quantidade: p.qtdAtual,
        estoqueMinimo: p.qtdMinima
      })),
    };
  } catch (error) {
    console.error("Erro no banco:", error);
    return { saude: [], categorias: [], produtosCriticos: [] };
  }
}