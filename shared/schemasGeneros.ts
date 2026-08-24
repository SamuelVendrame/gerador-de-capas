import { z } from "zod";

export const GENEROS = [
  { valor: "romance", label: "Romance", descricao: "Drama, literário, memórias" },
  { valor: "tecnico", label: "Técnico", descricao: "Engenharia, dados, manuais" },
  { valor: "infantil", label: "Infantil", descricao: "Histórias para crianças" },
  { valor: "fantasia", label: "Fantasia", descricao: "Épico, mito, ficção especulativa" },
  { valor: "negocios", label: "Negócios", descricao: "Gestão, carreira, autoridade" },
] as const;

const VALORES_GENERO = GENEROS.map((g) => g.valor) as [string, ...string[]];

export const schemaEtapa1 = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(100, "Título muito longo"),
  autor: z.string().min(1, "Autor é obrigatório").max(100, "Nome muito longo"),
});

export const schemaEtapa2 = z.object({
  genero: z.enum(VALORES_GENERO, { error: "Escolha um gênero" }),
});

export const schemaEtapa3 = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória").max(500, "Descrição muito longa"),
});

export const schemaEtapa4 = z.object({
  clima: z.string().max(200, "Muito longo").optional(),
});

export const schemaGeracaoCapa = schemaEtapa1
  .merge(schemaEtapa2)
  .merge(schemaEtapa3)
  .merge(schemaEtapa4);

export type DadosGeracaoCapa = z.infer<typeof schemaGeracaoCapa>;