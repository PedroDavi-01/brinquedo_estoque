"use server";

import { db } from "@/lib/db";
import { produtos } from "@/lib/schema";
import { desc, eq, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProdutos(busca?: string) {
  try {
    if (busca) {
      return await db.select().from(produtos)
        .where(ilike(produtos.nome, `%${busca}%`))
        .orderBy(desc(produtos.id));
    }
    return await db.select().from(produtos).orderBy(desc(produtos.id));
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

export async function createProduto(data: any) {
  try {
    await db.insert(produtos).values({
      nome: data.nome,
      categoria: data.categoria,
      faixaEtaria: data.faixaEtaria,
      preco: data.preco.toString(),
      qtdAtual: parseInt(data.qtdAtual),
      qtdMinima: parseInt(data.qtdMinima),
      imagem: data.imagem, 
    });

    revalidatePath("/dashboard/produtos");
    revalidatePath("/dashboard"); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar:", error);
    return { success: false };
  }
}

export async function updateProduto(id: number, data: any) {
  try {
    const idNum = Number(id);
    await db.update(produtos).set({
      nome: data.nome,
      categoria: data.categoria,
      faixaEtaria: data.faixaEtaria,
      preco: data.preco.toString(),
      qtdAtual: parseInt(data.qtdAtual),
      qtdMinima: parseInt(data.qtdMinima),
      imagem: data.imagem,
    }).where(eq(produtos.id, idNum));

    revalidatePath("/dashboard/produtos");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    return { success: false };
  }
}

export async function deleteProduto(id: number) {
  try {
    // Força a conversão para número para evitar falha no Drizzle/Postgres
    const idNum = Number(id);
    
    if (isNaN(idNum)) {
      console.error("ID inválido recebido no delete");
      return { success: false };
    }

    await db.delete(produtos).where(eq(produtos.id, idNum));
    
    // Revalidação agressiva do cache
    revalidatePath("/dashboard/produtos");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    return { success: false };
  }
}