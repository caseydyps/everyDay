// function add(a, b) {
//   if (typeof a === 'string') {
//     window.alert('a is string');
//     return;
//   }

//   return a + b;
// }

// if (add(2, 3) === 5) {
//   console.log('success');
// } else {
//   console.log('error');
// }

// describe('add function', () => {
//   test('adds 1 + 2 to equal 3', () => {
//     expect(add(1, 2)).toBe(3);
//   });
//   test('adds -1 + 5 to equal -6', () => {
//     expect(add(-1, -5)).toBe(-6);
//   });
//   it('should alert if a is a string', () => {
//     const alertSpy = jest.spyOn(window, 'alert');
//     add('hello', 5);
//     expect(alertSpy).toHaveBeenCalledWith('a is string');
//     alertSpy.mockRestore(); // Restore the original window.alert function
//   });
// });
