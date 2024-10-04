import type {
  RunInput,
  FunctionRunResult,
  ExpandOperation,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

function getHighestValueObject(arr, date) {
  const currentDate = new Date(date);

  let highestValueObject = null;
  let highestValue = 0;

  arr.forEach((obj) => {
    const startDate = new Date(obj.startAt);
    const endDate = obj.endAt ? new Date(obj.endAt) : Infinity;

    if (startDate <= currentDate && endDate >= currentDate) {
      if (parseInt(obj.value) > highestValue) {
        highestValue = parseInt(obj.value);
        highestValueObject = obj;
      }
    }
  });

  return highestValueObject;
}

export function run(input: RunInput): FunctionRunResult {
  const operations = [];

  input.cart.lines.forEach((cartLine) => {
    if (cartLine.merchandise.__typename === "ProductVariant" && cartLine.merchandise.product.bundleConfig) {
      const componentReferences = JSON.parse(cartLine.merchandise.product.bundleComponents?.value || "[]");
      const bundleConfig = JSON.parse(cartLine.merchandise.product.bundleConfig?.value || "{}");      

      if (componentReferences.length) {
        const expandedCartItems = componentReferences.map((reference, index) => ({
          merchandiseId: reference,
          quantity: parseInt(bundleConfig.expand.expandedCartItems[index].defaultQuantity) || 1
          //quantity: index+1
        }));

        const priceInput = getHighestValueObject(bundleConfig.expand.globalPriceRules, input.shop.localTime.date);

        console.log(JSON.stringify(bundleConfig.expand.globalPriceRules));
        console.log(JSON.stringify(priceInput));        

        operations.push({
          expand: {
            cartLineId: cartLine.id,
            title: cartLine.merchandise.product.title,
            image: null,
            expandedCartItems,
            price: (!priceInput) ? null : {
              percentageDecrease: {
                value: priceInput.value
              }
            }
          }
        });
      }
    }
  })
  return (operations.length) ? { operations: operations} : NO_CHANGES;
};