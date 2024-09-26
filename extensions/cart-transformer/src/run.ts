import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const NO_CHANGES: FunctionRunResult = {
  operations: [],
};

export function run(input: RunInput): FunctionRunResult {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const expandOperation = optionallyBuildExpandOperation(cartLine);

      if (expandOperation) {
        return [...acc, { expand: expandOperation }];
      }
      console.log("cartLine",cartLine)
      console.log("expandOperation",expandOperation)
      console.log("acc",acc)
      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
};

function optionallyBuildExpandOperation({ id: cartLineId, merchandise }) {
  if (merchandise.__typename === "ProductVariant" && merchandise.componentParents) {
    const componentParents = JSON.parse(merchandise.componentParents.value);

    // Ensure that componentParents is an array of objects with the expected structure
    if (!Array.isArray(componentParents) || componentParents.length === 0) {
      throw new Error("Invalid bundle composition");
    }

    let fixedPrice;
    let percentPrice;
    // Flatten the expanded cart items
    const expandedCartItems = componentParents.flatMap((parent) => {
      return parent.offerVariants.map((variant) => {
       
        // Handle different discount types
        if (parent.discountType === "fixed") {
          fixedPrice = {
            adjustment: {
            fixedPricePerUnit: {
              amount: parent.amount
            }
          }
          };
        } else if (parent.discountType === "percent") {
          percentPrice = {
            percentageDecrease: {
              value: parent.amount
            }
          };
        } else {
          throw new Error(`Unsupported discount type: ${parent.discountType}`);
        }
        return {
          merchandiseId: variant.variantId,
          quantity: variant.quantity,
          price: fixedPrice
        };
      });
    });

    const title = componentParents[0]?.name || "Default Title";

    console.log("expandedCartItems", JSON.stringify(expandedCartItems));
    if (expandedCartItems.length > 0) {
      return { cartLineId, expandedCartItems, title, price: percentPrice};
    }
  }
  return null;
}
