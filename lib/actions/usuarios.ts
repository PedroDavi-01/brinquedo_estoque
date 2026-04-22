"use server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsuarios() {
  try {
    return await db.select().from(usuarios).orderBy(desc(usuarios.id));
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

export async function createUsuario(data: any) {
  try {
    const hashedPassword = await bcrypt.hash(data.senha, 10);

    await db.insert(usuarios).values({
      nome: data.nome,
      email: data.email,
      senha: hashedPassword,
      cargo: data.cargo, 
    });

    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return { success: false };
  }
}

export async function updateUsuario(id: number, data: any) {
  try {
    const updateData: any = {
      nome: data.nome,
      email: data.email,
      cargo: data.cargo,
    };

    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    await db.update(usuarios).set(updateData).where(eq(usuarios.id, id));
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return { success: false };
  }
}

export async function deleteUsuario(id: number) {
  try {
    // 1. Busca os dados do usuário antes de deletar para validar o e-mail
    const [usuarioParaRemover] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, id));

    if (!usuarioParaRemover) {
      return { success: false, message: "Usuário não encontrado." };
    }

    // 2. TRAVA DE SEGURANÇA: Impede a exclusão do seu admin principal
    // Essencial para deixar o público usar a aplicação sem riscos no Pitch
    if (usuarioParaRemover.email === "admin@recanto.com") {
      return { 
        success: false, 
        message: "Ação bloqueada: Este administrador possui proteção de sistema." 
      };
    }

    // 3. Executa a exclusão se passar na trava acima
    await db.delete(usuarios).where(eq(usuarios.id, id));
    
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}