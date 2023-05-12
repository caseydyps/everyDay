const getDaysInMonth = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month + 1, 0).getDate();
};

describe('getDaysInMonth', () => {
  test('returns the correct number of days for February in a non-leap year', () => {
    const date = new Date(2022, 1, 1); // February 1, 2022
    const daysInMonth = getDaysInMonth(date);
    expect(daysInMonth).toBe(28);
    console.log('daysInMonth', daysInMonth);
  });

  test('returns the correct number of days for February in a leap year', () => {
    const date = new Date(2024, 1, 1); // February 1, 2024 (leap year)
    const daysInMonth = getDaysInMonth(date);
    expect(daysInMonth).toBe(29);
    console.log('daysInMonth', daysInMonth);
  });

  test('returns the correct number of days for a 31-day month', () => {
    const date = new Date(2022, 0, 1); // January 1, 2022
    const daysInMonth = getDaysInMonth(date);
    expect(daysInMonth).toBe(31);
  });

  test('returns the correct number of days for a 30-day month', () => {
    const date = new Date(2022, 3, 1); // April 1, 2022
    const daysInMonth = getDaysInMonth(date);
    expect(daysInMonth).toBe(30);
  });
});
