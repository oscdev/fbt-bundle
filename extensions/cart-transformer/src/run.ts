import type {
  RunInput,
  FunctionRunResult,
  ExpandOperation,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  const expandInput = {};
  input.cart.lines.forEach((cartLine) => {
    if (cartLine.merchandise.__typename === "ProductVariant" && cartLine.merchandise.product.bundleConfig) {
      const componentReferences = JSON.parse(cartLine.merchandise.product.bundleComponents?.value || "[]");
      const bundleConfig = JSON.parse(cartLine.merchandise.product.bundleConfig?.value || "{}");

      console.log('componentReferences', componentReferences[0])

      if (componentReferences.length) {
        const expandedCartItems = componentReferences.map((reference, index) => ({
          merchandiseId: reference,
          quantity: bundleConfig.expand.expandedCartItems[index].defaultQuantity || 1
        }));

        expandInput.cartLineId = cartLine.id;
        expandInput.title = cartLine.merchandise.product.title;
        expandInput.image = null;
        expandInput.expandedCartItems = expandedCartItems;

        /*
        const expandInput: ExpandOperation = {
          cartLineId: cartLine.id,
          title: cartLine.merchandise.product.title,
          image: null,
          price: null,
          expandedCartItems: expandedCartItems
        };
        */

        console.log('expandedCartItems = ', JSON.stringify(expandedCartItems))
      }

    }
  })

  console.log('expandInput = ', JSON.stringify(expandInput))
  
  //return NO_CHANGES;
  
  return (Object.keys(expandInput).length) ? { operations: { expand: expandInput } } : NO_CHANGES;
};