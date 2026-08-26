export function traduzirErroParaUsuario(mensagemTecnica: string): string {
  if (mensagemTecnica.includes("Rate limit exceeded") || mensagemTecnica.includes("429")) {
    return "Os modelos de IA gratuitos atingiram o limite de uso do dia. Tente novamente mais tarde, ou aguarde o limite resetar.";
  }
  if (mensagemTecnica.includes("browserType.launch") || mensagemTecnica.includes("Executable doesn't exist")) {
    return "Erro interno ao renderizar a capa (navegador não configurado). Contate o suporte técnico.";
  }
  if (mensagemTecnica.includes("Todos os modelos de fallback falharam")) {
    return "Não foi possível conectar aos modelos de IA no momento. Tente novamente em alguns minutos.";
  }
  if (mensagemTecnica.includes("ResourceExhausted")) {
    return "O modelo de IA está temporariamente sobrecarregado. Tente novamente em instantes.";
  }
  if (mensagemTecnica.includes("Insufficient credits")) {
  return "O serviço de geração de imagens está sem créditos disponíveis. Contate o administrador do sistema.";
}
  return "Ocorreu um erro inesperado durante a geração. Tente novamente.";
}