import { db } from "@/lib/db";
import { usuarios } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    // Busca o usuário no banco pelo e-mail
    const user = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.email, email))
      .limit(1);

    const usuarioEncontrado = user[0];

    // Validação básica 
    if (!usuarioEncontrado || usuarioEncontrado.senha !== senha) {
      return NextResponse.json(
        { message: "E-mail ou senha incorretos" },
        { status: 401 }
      );
    }

    // Retorna os dados que o front-end precisa, incluindo o cargo
    return NextResponse.json({
      id: usuarioEncontrado.id,
      nome: usuarioEncontrado.nome,
      email: usuarioEncontrado.email,
      cargo: usuarioEncontrado.cargo, // administrador, gerente ou funcionario
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}