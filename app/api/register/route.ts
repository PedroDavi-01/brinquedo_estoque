import { db } from '@/lib/db';
import { usuarios } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    
    const novoUsuario = await db.insert(usuarios).values({
      nome,
      email,
      senha
    }).returning(); // O returning traz o objeto criado de volta

    return NextResponse.json(novoUsuario[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Erro ao cadastrar ou e-mail já existe" }, { status: 400 });
  }
}