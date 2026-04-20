"use server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function loginAction(data: any) {
  const { email, senha } = data;

  try {
    // Busca o usuário no banco via Drizzle
    const userResult = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);
    
    if (userResult.length === 0) {
      return { success: false, message: "E-mail ou senha inválidos." };
    }

    const usuario = userResult[0];

    //  Compara a senha digitada com o Hash do banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaValida) {
      return { success: false, message: "E-mail ou senha inválidos." };
    }

    // Cria o Cookie de Sessão 
    const cookieStore = await cookies();
    cookieStore.set("auth_token", "sessao_recanto_ativa", {
      httpOnly: true, // Segurança contra XSS
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // Sessão dura 8 horas
      path: "/",
    });

    // Retorna os dados para o localStorage 
    return { 
      success: true, 
      user: { 
        id: usuario.id, 
        nome: usuario.nome, 
        cargo: usuario.cargo.toUpperCase() 
      } 
    };

  } catch (error) {
    console.error("Erro no loginAction:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

/**
 * Action para Logout
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}
