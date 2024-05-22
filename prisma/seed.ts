import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const campus = await prisma.campus.createMany({
    data: [
      { name: 'Fukakusa', color: '#649360' },
      { name: 'Seta', color: '#3CA6A6' },
      { name: 'Omiya', color: '#9E76B4' },
    ],
  })
  console.log({ campus })
  const place = await prisma.place.createMany({
    data: [
      { name: '5-201' },
      { name: '5-202' },
      { name: '5-203' },
      { name: '5-204' },
      { name: 'conference room' },
    ],
  })
  console.log({ place })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
