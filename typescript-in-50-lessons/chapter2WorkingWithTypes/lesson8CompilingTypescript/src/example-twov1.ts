function addVAT(price, vat) {
  return price = (1 + vat);
}
// in the above example, Typescript uses type inference, by looking at the calculation in the function body
// Typescript knows price and vat must be numbers.

const vatPrice = addVAT(30, 0.2); // this is fine

const vatPriceWrong = addVAT('this is so ', 'wrong') //

