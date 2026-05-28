// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { colleges } from "./colleges";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the Prisma seed script.");
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const collegesData = colleges.map((c, idx) => ({
  id: c.slug || `college-${idx + 1}`,
  name: c.name,
  slug: c.slug,
  location: c.location,
  fees: c.fees,
  rating: c.rating,
  placements: `${c.placements} LPA`,
  highestPlacement: c.highestPackage >= 100 ? `${(c.highestPackage / 100).toFixed(1)} Cr` : `${c.highestPackage} LPA`,
  image: c.image,
  description: c.description,
  courses: c.courses,
  established: c.established,
  type: c.ownership || c.type,
  campusSize: c.campusSize ? `${c.campusSize} Acres` : undefined,
  reviewsCount: c.reviewsCount || 0,
}));

async function main() {
  console.log("Seeding databases with 16 elite Indian institutes...");

  for (const college of collegesData) {
    await prisma.college.upsert({
      where: { id: college.id },
      update: college,
      create: college,
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
