import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole ,JobStatus,JobCategory,JobType, ApplicationStatus } from "../generated/prisma/client";


const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create Employers (5)
  const employers = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `employer${i}@mail.com`,
          full_name: `Employer ${i}`,
          password: "hashedpassword",
          role: UserRole.EMPLOYER,
        },
      })
    )
  );

  // 2. Create Job Seekers (15)
  const seekers = await Promise.all(
    Array.from({ length: 15 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `seeker${i}@mail.com`,
          full_name: `Seeker ${i}`,
          password: "hashedpassword",
          role: UserRole.JOB_SEEKER,
        },
      })
    )
  );

  // 3. Create Jobs (20)
  const jobs = await Promise.all(
    Array.from({ length: 20 }).map((_, i) => {
      const employer = employers[i % employers.length];

      return prisma.job.create({
        data: {
          title: `Job ${i}`,
          description: `This is job description ${i}`,
          company: `Company ${i % 5}`,
          location: i % 2 === 0 ? "Colombo" : "Kandy",
          category: JobCategory.IT,
          type: JobType.REMOTE,
          salary_min: 30000,
          salary_max: 60000,
          employer_id: employer.id,
          status: JobStatus.ACTIVE,
        },
      });
    })
  );

  // 4. Create Applications (30)
  await Promise.all(
    Array.from({ length: 30 }).map((_, i) => {
      const user = seekers[i % seekers.length];
      const job = jobs[i % jobs.length];

      return prisma.application.create({
        data: {
          user_id: user.id,
          job_id: job.id,
          resume_url: "https://res.cloudinary.com/dygzbfd5a/raw/upload/v1782055022/workhive_resumes/emjn3ej5ips4vjp9ngev",
          cover_letter: "I am very interested in this role.",
          status:
            i % 3 === 0
              ? ApplicationStatus.ACCEPTED
              : i % 3 === 1
              ? ApplicationStatus.PENDING
              : ApplicationStatus.REJECTED,
        },
      });
    })
  );

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });