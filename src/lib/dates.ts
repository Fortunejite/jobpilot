export const getRemainingDays = (date: Date) => {
  const currentDate = new Date();
  const timeDifference = date.getTime() - currentDate.getTime();

  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining > 0 ? daysRemaining : 0;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};