/** the set of expected country code values */
const _countryCodeArray = Array.of("AU", "BR", "CA", "CH", "DE", "DK", "ES", "FI", "FR", "GB", "IE", "IN", "IR", "MX", "NL", "NO", "NZ", "RS", "TR", "UA", "US");
/**
 * Checks if the string is a country code
 * @param {string} aString - a country code (2 letters, lowerCase or upperCase)
 * @return {boolean} is the string a country code? 
 */
function isCountryCode(aString){
  if(_countryCodeArray.indexOf(aString.toLocaleUpperCase()) === -1){
    return false;
  }
  return true;
}
module.exports = isCountryCode;