const isCountryCode = require('./countryCode.js');
test('true Country Code UpperCase', () => {
  expect(isCountryCode("FR")).toBe(true);
});
test('true Country Code LowerCase', () => {
  expect(isCountryCode("fr")).toBe(true);
});
test('false Country Code LowerCase', () => {
  expect(isCountryCode("Chuck Norris")).toBe(false);
});