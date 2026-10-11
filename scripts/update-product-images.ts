import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const IMAGE_MAPPINGS: Record<string, string> = {
  // Salgados
  'pastel de carne de sol': '/images/products/pastel-carne-sol.jpg',
  'carne de sol': '/images/products/pastel-carne-sol.jpg',
  'pastel de carne': '/images/products/pastel-de-carne.jpg',
  'pastel de queijo': '/images/products/pastel-de-queijo.jpg',
  'pastel de frango': '/images/products/pastel-de-frango.jpg',
  'pastel de camarão': '/images/products/pastel-de-camarao.jpg',

  // Especiais
  'carne de sol + queijo': '/images/products/pastel-especial.jpg',
  'carne de sol + catupiry': '/images/products/pastel-especial.jpg',
  'frango + queijo': '/images/products/pastel-de-frango.jpg',
  'frango + catupiry': '/images/products/pastel-de-frango.jpg',
  'carne + queijo': '/images/products/pastel-de-carne.jpg',
  'carne + catupiry': '/images/products/pastel-de-carne.jpg',
  'camarão + catupiry': '/images/products/pastel-de-camarao.jpg',
  'camarão + queijo': '/images/products/pastel-de-camarao.jpg',
  '2 queijos': '/images/products/pastel-de-queijo.jpg',
  'misto': '/images/products/pastel-de-queijo.jpg',

  // Doces
  'banana': '/images/products/pastel-doce.jpg',
  'nutella': '/images/products/pastel-doce.jpg',
  'romeu e julieta': '/images/products/pastel-doce.jpg',

  // Bebidas
  'coca-cola': '/images/products/coca-cola.jpg',
  'maracujá': '/images/products/suco-maracuja.jpg',
  'cana': '/images/products/caldo-de-cana.jpg',
};

async function main() {
  console.log('🔄 Iniciando sincronização e verificação de imagens dos produtos...');

  const produtos = await prisma.produto.findMany();
  console.log(`📦 Encontrados ${produtos.length} produtos cadastrados.`);

  let updatedCount = 0;

  for (const produto of produtos) {
    const nomeNorm = produto.nome.toLowerCase();
    let matchedImg = '/images/products/pastel-de-carne.jpg';

    for (const [key, imgPath] of Object.entries(IMAGE_MAPPINGS)) {
      if (nomeNorm.includes(key)) {
        matchedImg = imgPath;
        break;
      }
    }

    const fullLocalPath = path.join(process.cwd(), 'public', matchedImg.replace(/^\//, ''));
    const existsLocally = fs.existsSync(fullLocalPath);

    if (existsLocally) {
      await prisma.produto.update({
        where: { id: produto.id },
        data: { imagem: matchedImg }
      });
      console.log(`✅ [${produto.categoria}] ${produto.nome} -> ${matchedImg}`);
      updatedCount++;
    } else {
      console.warn(`⚠️ Imagem local não encontrada: ${fullLocalPath}`);
    }
  }

  console.log(`✨ Concluído! ${updatedCount} produtos atualizados com fotos de qualidade no banco.`);
}

main()
  .catch((e) => {
    console.error('Erro ao atualizar imagens:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
