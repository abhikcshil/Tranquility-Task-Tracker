import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pointEvent.deleteMany();
  await prisma.habitCompletion.deleteMany();
  await prisma.taskInstance.deleteMany();
  await prisma.recurringRule.deleteMany();
  await prisma.note.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();

  const categoriesData = [
    { name: 'Health', color: '#22c55e' },
    { name: 'School', color: '#3b82f6' },
    { name: 'Work', color: '#f97316' },
    { name: 'Personal', color: '#a855f7' },
    { name: 'Home', color: '#eab308' },
  ];

  const createdCategories = await Promise.all(
    categoriesData.map((category) =>
      prisma.category.create({
        data: category,
      }),
    ),
  );

  const categoryByName = createdCategories.reduce<Record<string, number>>((acc, category) => {
    acc[category.name] = category.id;
    return acc;
  }, {});

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [mathTask, reportTask, cleanDeskTask, laundryTask] = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Review algebra assignment',
        notes: 'Finish chapter 6 problem set',
        categoryId: categoryByName.School,
        dueDate: tomorrow,
        pointValue: 10,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Draft weekly project summary',
        categoryId: categoryByName.Work,
        pointValue: 5,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Clean desk area',
        categoryId: categoryByName.Home,
        pointValue: 3,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Do laundry',
        notes: 'Flexible completion any day this week',
        categoryId: categoryByName.Home,
        pointValue: 8,
      },
    }),
  ]);

  await prisma.recurringRule.create({
    data: {
      taskId: laundryTask.id,
      type: 'weekly',
      frequency: 1,
    },
  });

  await prisma.taskInstance.create({
    data: {
      taskId: laundryTask.id,
      date: today,
      completed: false,
      pointsAwarded: 0,
    },
  });

  const gymHabit = await prisma.habit.create({
    data: {
      title: 'Gym',
      notes: '30 minute strength or cardio session',
      categoryId: categoryByName.Health,
      frequencyType: 'weekly',
      targetCount: 3,
      pointValue: 6,
    },
  });

  await prisma.habitCompletion.createMany({
    data: [1, 3].map((daysAgo) => {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      return {
        habitId: gymHabit.id,
        date,
      };
    }),
  });

  await prisma.note.create({
    data: {
      title: 'Weekly priorities',
      content: 'School review, keep gym streak, and organize home tasks.',
      pinned: true,
    },
  });

  await prisma.pointEvent.createMany({
    data: [
      { amount: 10, sourceType: 'task', sourceId: mathTask.id },
      { amount: 5, sourceType: 'task', sourceId: reportTask.id },
      { amount: 15, sourceType: 'habit', sourceId: gymHabit.id },
      { amount: 20, sourceType: 'bonus', sourceId: null },
    ] satisfies Prisma.PointEventCreateManyInput[],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
