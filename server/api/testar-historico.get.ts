import { adicionarRegistro } from "../data/historicoStore";
import { randomUUID } from "crypto";

export default defineEventHandler(async () => {
  const registroFake = {
    id: randomUUID(),
    titulo: "Livro de Teste",
    autor: "Autor Fictício",
    status: "concluido" as const,
    caminhoImagem: "/renders/fake.png",
    criadoEm: new Date().toISOString(),
  };

  await adicionarRegistro(registroFake);
  return { sucesso: true, registro: registroFake };
});