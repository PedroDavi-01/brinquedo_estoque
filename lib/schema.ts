import { pgTable, serial, text, varchar, decimal, integer, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabela de Usuários
export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha: text('senha').notNull(),
  cargo: text("cargo").$type<"ADMIN" | "GERENTE" | "FUNCIONARIO">().default("FUNCIONARIO")
});

// Tabela de Produtos
export const produtos = pgTable('produtos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  categoria: text('categoria').notNull(),
  faixaEtaria: text('faixaEtaria').notNull(),
  preco: decimal('preco', { precision: 10, scale: 2 }).notNull(),
  qtdAtual: integer('qtdAtual').notNull(),
  qtdMinima: integer('qtdMinima').notNull(),
  imagem: text('imagem'), 
});

// Tabela de Movimentações
export const movimentacoes = pgTable('movimentacoes', {
  id: serial('id').primaryKey(),
  tipo: text('tipo').notNull(),
  quantidade: integer('quantidade').notNull(),
  data: timestamp('data').defaultNow().notNull(),
  produtoId: integer('produtoId')
    .references(() => produtos.id, { onDelete: 'cascade' })
    .notNull(),
  usuarioId: integer('usuarioId').references(() => usuarios.id).notNull(),
});

// Relacionamentos
export const usuariosRelations = relations(usuarios, ({ many }) => ({
  movimentacoes: many(movimentacoes),
}));

export const produtosRelations = relations(produtos, ({ many }) => ({
  movimentacoes: many(movimentacoes),
}));