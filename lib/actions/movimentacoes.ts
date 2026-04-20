"use server";

import { db } from "@/lib/db";
import { movimentacoes, produtos, usuarios } from "@/lib/schema";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Função para buscar os dados da página de histórico
export async function getMovimentacoesData() {
  try {
    const listaProdutos = await db.select().from(produtos);
    
    const todasMovimentacoes = await db
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
      .orderBy(desc(movimentacoes.data));
    
    return { listaProdutos, todasMovimentacoes };
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    return { listaProdutos: [], todasMovimentacoes: [] };
  }
}

// Registro de Movimentação com Controle de Acesso e Transação
export async function criarMovimentacao(formData: {
  produtoId: number;
  tipo: "ENTRADA" | "SAIDA";
  quantidade: number;
  usuarioId: number;
}) {
  try {
    return await db.transaction(async (tx) => {
      // Controle de Acesso
      const [user] = await tx
        .select({ cargo: usuarios.cargo })
        .from(usuarios)
        .where(eq(usuarios.id, formData.usuarioId));

      if (!user) throw new Error("Usuário não identificado.");

      // Regra: Funcionário não pode dar saída
      const cargoLimpo = user.cargo.toUpperCase().trim();
      if (cargoLimpo === "FUNCIONARIO" && formData.tipo === "SAIDA") {
        throw new Error("Seu cargo não tem permissão para registrar saídas.");
      }

      // Verificação de estoque para saídas
      if (formData.tipo === "SAIDA") {
        const [produto] = await tx
          .select({ qtdAtual: produtos.qtdAtual })
          .from(produtos)
          .where(eq(produtos.id, formData.produtoId));

        if (!produto || produto.qtdAtual < formData.quantidade) {
          throw new Error("Estoque insuficiente para essa saída.");
        }
      }

      // Insere a movimentação
      await tx.insert(movimentacoes).values({
        produtoId: formData.produtoId,
        tipo: formData.tipo,
        quantidade: formData.quantidade,
        usuarioId: formData.usuarioId,
        data: new Date(),
      });

      //  Atualiza o saldo real no estoque
      const ajuste = formData.tipo === "ENTRADA" ? formData.quantidade : -formData.quantidade;
      
      await tx.update(produtos)
        .set({ qtdAtual: sql`${produtos.qtdAtual} + ${ajuste}` })
        .where(eq(produtos.id, formData.produtoId));

      // Revalida as páginas afetadas
      revalidatePath("/dashboard/movimentacoes");
      revalidatePath("/dashboard/produtos");
      revalidatePath("/dashboard");
      
      return { success: true };
    });
  } catch (error: any) {
    console.error("Erro na transação:", error.message);
    return { success: false, error: error.message };
  }
}