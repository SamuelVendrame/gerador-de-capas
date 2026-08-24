import { z } from "zod";

export const STATUS_GERACAO = ["em_processamento", "concluido", "cancelado"] as const;

export const schemaRegistroHistorico = z.object({
  id: z.string(),
  titulo: z.string(),
  autor: z.string(),
  status: z.enum(STATUS_GERACAO),
  motivoCancelamento: z.string().optional(),
  caminhoImagem: z.string().optional(),
  criadoEm: z.string(), // ISO date string
});

export type RegistroHistorico = z.infer<typeof schemaRegistroHistorico>;