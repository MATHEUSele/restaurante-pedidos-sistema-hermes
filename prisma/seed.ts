import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  const defaultAccounts = [
    { nome: 'Admin DEV', email: 'adm@gmail.com', senha: '123', perfil: 'DEV' },
    { nome: 'Administrador Hermes', email: 'admin@hermes.com', senha: '123', perfil: 'ADM' },
    { nome: 'Administrador', email: 'admin@gmail.com', senha: '123', perfil: 'ADM' },
    { nome: 'Atendente Galo', email: 'atendente@galo.com', senha: '123', perfil: 'ATENDENTE' },
    { nome: 'Cozinha Galo', email: 'cozinha@galo.com', senha: '123', perfil: 'COZINHA' },
  ]

  // Garante o Restaurante Principal
  const restaurante = await prisma.restaurante.upsert({
    where: { id: 'rest-pastelaria-do-galo' },
    update: {
      nome: 'Pastelaria do Galo',
      cores: JSON.stringify({ primary: '#7A1E2E', secondary: '#F5C518' }),
    },
    create: {
      id: 'rest-pastelaria-do-galo',
      nome: 'Pastelaria do Galo',
      cores: JSON.stringify({ primary: '#7A1E2E', secondary: '#F5C518' }),
    },
  })
  console.log(`Restaurante garantido: ${restaurante.nome}`)

  for (const acc of defaultAccounts) {
    const hashedPassword = await bcrypt.hash(acc.senha, 10)
    await prisma.usuario.upsert({
      where: { email: acc.email },
      update: {
        nome: acc.nome,
        senha: hashedPassword,
        perfil: acc.perfil,
        restauranteId: restaurante.id,
      },
      create: {
        nome: acc.nome,
        email: acc.email,
        senha: hashedPassword,
        perfil: acc.perfil,
        restauranteId: restaurante.id,
      },
    })
    console.log(`Conta ${acc.email} garantida com perfil ${acc.perfil} e senha ${acc.senha}!`)
  }

  // Produtos do Cardápio Pastelaria do Galo
  const produtos = [
    // Salgados
    { id: 'prod-1', nome: 'Pastel de Carne', preco: 8.0, categoria: 'Salgados', imagem: '/images/products/pastel-de-carne.jpg' },
    { id: 'prod-2', nome: 'Pastel de Queijo', preco: 8.0, categoria: 'Salgados', imagem: '/images/products/pastel-de-queijo.jpg' },
    { id: 'prod-3', nome: 'Pastel de Frango', preco: 8.0, categoria: 'Salgados', imagem: '/images/products/pastel-de-frango.jpg' },
    { id: 'prod-4', nome: 'Pastel de Camarão', preco: 13.0, categoria: 'Salgados', imagem: '/images/products/pastel-de-camarao.jpg' },
    { id: 'prod-5', nome: 'Pastel de Carne de Sol', preco: 11.0, categoria: 'Salgados', imagem: '/images/products/pastel-carne-sol.jpg' },
    
    // Especiais (conforme solicitado: todos com nome pastel e tipo especial)
    { id: 'prod-6', nome: 'Pastel Especial de Carne de Sol + Queijo', preco: 13.0, categoria: 'Especiais', imagem: '/images/products/pastel-especial.jpg' },
    { id: 'prod-7', nome: 'Pastel Especial de Carne de Sol + Catupiry', preco: 13.0, categoria: 'Especiais', imagem: '/images/products/pastel-especial.jpg' },
    { id: 'prod-8', nome: 'Pastel Especial de Frango + Queijo', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-frango.jpg' },
    { id: 'prod-9', nome: 'Pastel Especial de Frango + Catupiry', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-frango.jpg' },
    { id: 'prod-10', nome: 'Pastel Especial de Carne + Queijo', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-carne.jpg' },
    { id: 'prod-11', nome: 'Pastel Especial de Carne + Catupiry', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-carne.jpg' },
    { id: 'prod-12', nome: 'Pastel Especial de Camarão + Catupiry', preco: 15.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-camarao.jpg' },
    { id: 'prod-13', nome: 'Pastel Especial de Camarão + Queijo', preco: 15.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-camarao.jpg' },
    { id: 'prod-14', nome: 'Pastel Especial 2 Queijos', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-queijo.jpg' },
    { id: 'prod-15', nome: 'Pastel Especial Misto (Presunto e Queijo)', preco: 9.0, categoria: 'Especiais', imagem: '/images/products/pastel-de-queijo.jpg' },
    
    // Doces
    { id: 'prod-16', nome: 'Pastel Doce de Banana com Nutella', preco: 12.0, categoria: 'Doces', imagem: '/images/products/pastel-doce.jpg' },
    { id: 'prod-17', nome: 'Pastel Doce de Romeu e Julieta', preco: 12.0, categoria: 'Doces', imagem: '/images/products/pastel-doce.jpg' },
    
    // Bebidas
    { id: 'prod-18', nome: 'Coca-Cola Zero (Lata)', preco: 6.0, categoria: 'Bebidas', imagem: '/images/products/coca-cola.jpg' },
    { id: 'prod-19', nome: 'Coca-Cola Original (Lata)', preco: 6.0, categoria: 'Bebidas', imagem: '/images/products/coca-cola.jpg' },
    { id: 'prod-20', nome: 'Coca-Cola 1 Litro', preco: 10.0, categoria: 'Bebidas', imagem: '/images/products/coca-cola.jpg' },
    { id: 'prod-21', nome: 'Suco de Maracujá 300ml', preco: 4.0, categoria: 'Bebidas', imagem: '/images/products/suco-maracuja.jpg' },
    { id: 'prod-22', nome: 'Suco de Maracujá 500ml', preco: 5.0, categoria: 'Bebidas', imagem: '/images/products/suco-maracuja.jpg' },
    { id: 'prod-23', nome: 'Caldo de Cana 300ml', preco: 3.0, categoria: 'Bebidas', imagem: '/images/products/caldo-de-cana.jpg' },
    { id: 'prod-24', nome: 'Caldo de Cana 500ml', preco: 4.0, categoria: 'Bebidas', imagem: '/images/products/caldo-de-cana.jpg' },
  ]

  for (const prod of produtos) {
    await prisma.produto.upsert({
      where: { id: prod.id },
      update: {
        nome: prod.nome,
        preco: prod.preco,
        categoria: prod.categoria,
        imagem: prod.imagem,
        restauranteId: restaurante.id,
      },
      create: {
        id: prod.id,
        nome: prod.nome,
        preco: prod.preco,
        categoria: prod.categoria,
        imagem: prod.imagem,
        restauranteId: restaurante.id,
      },
    })
  }
  console.log(`${produtos.length} produtos do cardápio garantidos no banco de dados com fotos de propaganda!`)

  console.log('Seed finalizado com sucesso.')
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
