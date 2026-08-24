import { lerHistorico } from "../data/historicoStore";

export default defineEventHandler(async () => {
  return await lerHistorico();
});