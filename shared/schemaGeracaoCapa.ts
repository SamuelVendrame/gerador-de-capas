import { z } from "zod";
import { GENEROS } from "./generos";

const VALORES_GENERO = GENEROS.map((g) => g.valor) as [string, ...string[]];

export const schemaEtapa1 = z.object({
  titulo: z.string().min(1, "Insira um título.").max(100, "Título muito longo"),
  autor: z.string().min(1, "Insira um autor.").max(100, "Nome muito longo"),
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