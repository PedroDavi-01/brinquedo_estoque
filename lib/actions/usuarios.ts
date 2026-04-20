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
    return [];
  }
}

export async function createUsuario(data: any) {
  try {
    // Transforma a senha em Hash antes de salvar
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
    console.error(error);
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

    // Só atualiza a senha se o admin digitar uma nova
    if (data.senha) {
      updateData.senha = await bcrypt.hash(data.senha, 10);
    }

    await db.update(usuarios).set(updateData).where(eq(usuarios.id, id));
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteUsuario(id: number) {
  try {
    await db.delete(usuarios).where(eq(usuarios.id, id));
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}