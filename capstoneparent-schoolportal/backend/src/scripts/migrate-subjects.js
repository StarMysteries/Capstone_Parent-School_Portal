const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, "../../.env") });

const prisma = new PrismaClient();

async function main() {
  console.log("Starting data migration for subjects...");

  // 1. Get unique subject names from subject_records
  const subjectRecords = await prisma.subjectRecord.findMany({
    select: {
      subject_name: true,
    },
  });

  const uniqueSubjectNames = [...new Set(subjectRecords.map(r => r.subject_name).filter(Boolean))];
  console.log(`Found ${uniqueSubjectNames.length} unique subject names in SubjectRecord.`);

  // 2. Insert into subjects table
  for (const name of uniqueSubjectNames) {
    try {
      await prisma.$executeRaw`INSERT INTO subjects (name) VALUES (${name}) ON CONFLICT (name) DO NOTHING`; 
    } catch (error) {
      console.error(`Error inserting subject ${name}:`, error.message);
    }
  }

  // 3. Link subject_records to subjects
  const allSubjects = await prisma.$queryRaw`SELECT * FROM subjects`;
  const subjectMap = new Map(allSubjects.map(s => [s.name, s.subject_id]));

  console.log("Linking subject_records to subjects...");
  let linkedCount = 0;
  for (const record of subjectRecords) {
    const subjectId = subjectMap.get(record.subject_name);
    if (subjectId) {
      await prisma.$executeRaw`UPDATE subject_records SET subject_id = ${subjectId} WHERE subject_name = ${record.subject_name}`;
      linkedCount++;
    }
  }
  console.log(`Successfully linked ${linkedCount} subject records.`);

  console.log("Data migration completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
