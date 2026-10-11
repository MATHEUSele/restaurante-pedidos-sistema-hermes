import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  const defaultAccounts = [
    { nome: 'Admin DEV', email: 'adm@gmail.com', senha: '123', perfil: 'DEV' },
    { nome: 'Administrador Hermes', email: 'admin@hermes.com', senha: '123', perfil: 'ADM' },
    { nome: 'Administrador', email: 'admin@gmail.com', senha: '123', perfil: 'ADM' },
  ]

  for (const acc of defaultAccounts) {
    const hashedPassword = await bcrypt.hash(acc.senha, 10)
    await prisma.usuario.upsert({
      where: { email: acc.email },
      update: {
        nome: acc.nome,
        senha: hashedPassword,
        perfil: acc.perfil,
      },
      create: {
        nome: acc.nome,
        email: acc.email,
        senha: hashedPassword,
        perfil: acc.perfil,
      },
    })
    console.log(`Conta ${acc.email} garantida com perfil ${acc.perfil} e senha ${acc.senha}!`)
  }

  console.log('Seed finalizado.')
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
