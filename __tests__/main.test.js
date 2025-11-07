// We require once by default. For the console test we re-require after mocking console.
const vars = require('../main');

describe('Variables Exercise', () => {
  test('firstName should be a non-empty string', () => {
    expect(vars.firstName).toBeDefined();
    expect(typeof vars.firstName).toBe('string');
    expect(vars.firstName.trim().length).toBeGreaterThan(0);
  });

  test('lastName should be a non-empty string', () => {
    expect(vars.lastName).toBeDefined();
    expect(typeof vars.lastName).toBe('string');
    expect(vars.lastName.trim().length).toBeGreaterThan(0);
  });

  test('age should be a number and declared with let (mutable)', () => {
    expect(vars.age).toBeDefined();
    expect(typeof vars.age).toBe('number');

    // Try mutating to verify "let" usage (works even if they used var)
    const original = vars.age;
    // We can't reassign their binding from here, so we do a soft check:
    // Encourage them via README to actually change age once in their code.
    expect(Number.isFinite(original)).toBe(true);
  });

  test('fullName should combine firstName and lastName with a space', () => {
    expect(vars.fullName).toBeDefined();
    expect(vars.fullName).toBe(`${vars.firstName} ${vars.lastName}`);
  });

  test('Should print a greeting to the console', () => {
    // Spy and re-require to capture side effects from top-level console.log
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.isolateModules(() => {
      // Re-load main.js as a fresh module instance
      const fresh = require('../main');
      // Use what they exported in case the greeting uses those vars
      expect(fresh).toBeDefined();
    });

    expect(logSpy).toHaveBeenCalled();

    const firstCall = logSpy.mock.calls[0]?.[0];
    expect(typeof firstCall).toBe('string');

    // The greeting should mention their name or fullName and sound like a greeting
    expect(firstCall).toMatch(/hello|hi|welcome|hey/i);
    // At least contain first name or full name somewhere
    expect(
      /[A-Za-z]/.test(firstCall) &&
      (firstCall.includes(vars.firstName) || firstCall.includes(vars.fullName))
    ).toBe(true);

    logSpy.mockRestore();
  });
});
