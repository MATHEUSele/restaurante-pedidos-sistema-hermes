import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  const adminEmail = 'adm@gmail.com'
  const adminSenha = '123'
  
  const existingAdmin = await prisma.usuario.findUnique({
    where: { email: adminEmail }
  })

  if (!existingAdmin) {
    console.log(`Admin ${adminEmail} não encontrado. Criando...`)
    const hashedPassword = await bcrypt.hash(adminSenha, 10)
    
    await prisma.usuario.create({
      data: {
        nome: 'Admin',
        email: adminEmail,
        senha: hashedPassword,
        perfil: 'DEV'
      }
    })
    console.log('Admin criado com sucesso!')
  } else {
    console.log(`Admin ${adminEmail} já existe no banco. Pulando criação.`)
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
