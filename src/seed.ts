import { faker } from "@faker-js/faker";
import {
  ageGroupsEnum,
  candidatesEnum,
  genderEnum,
  regionsEnum,
} from "./lib/vars";
import { users, votes } from "./db/schema";
import { db } from "./db";
import { loadEnvFile } from "process";

loadEnvFile();

async function seed(count = 100) {
  // 더미 데이터 생성
  const userVotePairs = Array.from({ length: count }, () => {
    const id = faker.string.uuid();
    const gender = faker.helpers.arrayElement(genderEnum);
    const ageGroup = faker.helpers.arrayElement(ageGroupsEnum);
    const region = faker.helpers.arrayElement(regionsEnum);
    const voteFor = faker.helpers.arrayElement(candidatesEnum);
    const priority = faker.number.int({ min: 0, max: 5 });

    return {
      user: {
        id,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        emailVerified: faker.date.past(),
        image: faker.image.avatar(),
      },
      vote: {
        userId: id,
        voteFor: voteFor,
        ageGroup: ageGroup,
        gender,
        region,
        priority: priority,
        createdAt: new Date(),
      },
    };
  });

  console.log(`🧪 Seeding ${count} users & votes in transaction...`);

  await db.transaction(async (tx) => {
    await tx.insert(users).values(userVotePairs.map((d) => d.user));
    await tx.insert(votes).values(userVotePairs.map((d) => d.vote));
  });

  console.log("✅ Transactional seed completed.");
}

seed(1000).catch((err) => {
  console.error("❌ Seeding failed", err);
}).finally(() => {
  console.log("complete seeding");
  process.exit();
});