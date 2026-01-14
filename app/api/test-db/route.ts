import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  const count = await prisma.waitlist.count();
  console.log("Waitlist entries:", count);
}

test();
console.log("DB URL:", process.env.DATABASE_URL);
