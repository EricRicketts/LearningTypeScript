function addVAT(price, vat) {
  return price = (1 + vat);
}
// in the above example, Typescript uses type inference, by looking at the calculation in the function body
// Typescript knows price and vat must be numbers.

function addVATDefaultVat(price, vat = 0.2) {
  return price = (1 + vat);
}
const vatPrice = addVAT(30, 0.2); // this is fine

const vatPriceWrong = addVAT('this is so ', 'wrong') // this still works because the return
// value is NaN which is a number

const vatPriceErrors = addVATDefaultVat(30, 'a string');  // we get a Typescript error here
// because vet is set to a default of 0.2 and Typescript will infer it is a number.

const vatPriceNaN = addVATDefaultVat('foo bar'); // this works for the same reason as above the
// operation will return NaN, which is a number

function addVATFullTyping(price: number, vat = 0.2) {
  // we could have written in a longer form function addVATFullTyping(price: number, vat: number = 0.2): number
  return price = (1 + vat);
}

const vatPriceFail = addVATFullTyping('fizz buzz'); // we get a type error here because all of
// the parameters are typed, before the price parameter was always of type "any".

