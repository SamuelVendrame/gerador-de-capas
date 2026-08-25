import { z } from "zod";

export const STATUS_GERACAO = ["em_processamento", "concluido", "cancelado"] as const;

export const schemaRegistroHistorico = z.object({
  id: z.string(),
  titulo: z.string(),
  autor: z.string(),
  genero: z.string(),
  descricao: z.string(),
  clima: z.string().optional(),
  status: z.enum(STATUS_GERACAO),
  motivoCancelamento: z.string().optional(),
  caminhoImagem: z.string().optional(),
  layout: z.string().optional(),
  fonte: z.string().optional(),
  tentativasImagem: z.number().optional(),
  ajustesAgente: z.number().optional(),
  duracaoSegundos: z.number().optional(),
  criadoEm: z.string(),
});

export type RegistroHistorico = z.infer<typeof schemaRegistroHistorico>;