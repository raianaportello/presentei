// O cliente Prisma será instanciado na primeira tarefa que requer banco em execução.
// A Fase 1 usa o repositório local para permitir build e revisão sem credenciais externas.
export const databaseConfigured = Boolean(process.env.DATABASE_URL);
