import type {
  RunInput,
  FunctionRunResult,
  ExpandOperation,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  const operations = [];

  input.cart.lines.forEach((cartLine) => {
    if (cartLine.merchandise.__typename === "ProductVariant" && cartLine.merchandise.product.bundleConfig) {
      const componentReferences = JSON.parse(cartLine.merchandise.product.bundleComponents?.value || "[]");
      const bundleConfig = JSON.parse(cartLine.merchandise.product.bundleConfig?.value || "{}");

      console.log(JSON.stringify(bundleConfig));

      if (componentReferences.length) {
        const expandedCartItems = componentReferences.map((reference, index) => ({
          merchandiseId: reference,
          quantity: bundleConfig.expand.expandedCartItems[index].defaultQuantity || 1
          //quantity: index+1
        }));

        const priceInput = (bundleConfig.expand.globalPriceRules[0].value) ? {
          percentageDecrease:{
            value: bundleConfig.expand.globalPriceRules[0].value
          }
        } : null

        operations.push({
          expand: {
            cartLineId: cartLine.id,
            title: cartLine.merchandise.product.title,
            image: null,
            expandedCartItems,
            price: priceInput
          }
        });
      }
    }
  })
  return (operations.length) ? { operations: operations} : NO_CHANGES;
};