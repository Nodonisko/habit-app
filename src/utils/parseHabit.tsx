export const parseHabit = (doc: any): Habit => {
  const data = doc.data();

  return {
    ...data,
    id: doc.id,
    completed: data?.completed.map(({ seconds }: any) => seconds),
    created: data?.created?.seconds,
  };
};
