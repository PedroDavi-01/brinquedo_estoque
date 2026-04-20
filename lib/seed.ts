import { db } from "@/lib/db"; 
import { usuarios, produtos, movimentacoes } from "@/lib/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Cofre aberto! Iniciando a limpeza e o plantio de dados...");

  // 1. LIMPEZA 
  await db.delete(movimentacoes);
  await db.delete(produtos);
  await db.delete(usuarios);

  // GERAÇÃO DO HASH 
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash("recanto123", salt);

  //INSERIR USUÁRIOS 
  console.log("Semeando usuários com senhas protegidas...");
  const [admin, gerente, funcionario] = await db.insert(usuarios).values([
    {
      nome: "Pedro Davi",
      email: "admin@recanto.com",
      senha: hash,
      cargo: "ADMIN",
    },
    {
      nome: "Mariana Gerente",
      email: "gerente@recanto.com",
      senha: hash,
      cargo: "GERENTE",
    },
    {
      nome: "João Silva",
      email: "func@recanto.com",
      senha: hash,
      cargo: "FUNCIONARIO",
    }
  ]).returning();

  // INSERIR PRODUTOS
  console.log("Semeando catálogo de brinquedos...");
  const produtosInseridos = await db.insert(produtos).values([
    {
      nome: "Carrinho de Controle Remoto",
      categoria: "Brinquedos de Menino",
      faixaEtaria: "5-10 anos",
      preco: "120.00",
      qtdAtual: 15,
      qtdMinima: 5,
      imagem: null,
    },
    {
      nome: "Boneca Articulada",
      categoria: "Brinquedos de Menina",
      faixaEtaria: "3-8 anos",
      preco: "85.50",
      qtdAtual: 3, 
      qtdMinima: 10,
      imagem: null,
    },
    {
      nome: "Lego Star Wars",
      categoria: "Educativos",
      faixaEtaria: "+10 anos",
      preco: "250.00",
      qtdAtual: 50,
      qtdMinima: 15,
      imagem: null,
    }
  ]).returning();

  // INSERIR MOVIMENTAÇÕES
  console.log("Registrando o histórico de movimentações...");
  await db.insert(movimentacoes).values([
    {
      tipo: "ENTRADA",
      quantidade: 10,
      produtoId: produtosInseridos[0].id,
      usuarioId: admin.id,
      data: new Date(),
    },
    {
      tipo: "SAIDA",
      quantidade: 2,
      produtoId: produtosInseridos[1].id,
      usuarioId: admin.id,
      data: new Date(),
    },
    {
      tipo: "ENTRADA",
      quantidade: 50,
      produtoId: produtosInseridos[2].id,
      usuarioId: admin.id,
      data: new Date(Date.now() - 86400000), 
    }
  ]);

  console.log("Tudo pronto! Senha padrão: recanto123");
  process.exit(0);
}

main().catch((err) => {
  console.error("Erro na seed:", err);
  process.exit(1);
});