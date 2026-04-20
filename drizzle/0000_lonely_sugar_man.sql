CREATE TABLE "movimentacoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"quantidade" integer NOT NULL,
	"data" timestamp DEFAULT now() NOT NULL,
	"produtoId" integer NOT NULL,
	"usuarioId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"categoria" text NOT NULL,
	"faixaEtaria" text NOT NULL,
	"preco" numeric(10, 2) NOT NULL,
	"qtdAtual" integer NOT NULL,
	"qtdMinima" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha" text NOT NULL,
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_produtoId_produtos_id_fk" FOREIGN KEY ("produtoId") REFERENCES "public"."produtos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_usuarioId_usuarios_id_fk" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;