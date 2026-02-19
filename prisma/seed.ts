import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Créer un utilisateur admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      nom_complet: 'Admin Principal',
      email: 'admin@example.com',
      mot_passe: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Seeding terminé avec succès!');
  console.log({ admin});
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });