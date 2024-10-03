import React from 'react';
import { Card, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Button, Thumbnail, Badge, Box } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
export function Preview(pros) {
  const { bundleName, bundlePrice, description, cartItems, cartItemsMedia, currencyCodes, globalPriceRules } = pros;

  //console.log("globalPriceRules",globalPriceRules)
  const currency = currencyCodes.currencyFormats.moneyInEmailsFormat;
  // Calculate total price by summing the prices of the matched items
  const totalPrice = cartItems.reduce((total, { merchandiseId, defaultQuantity }) => {
    cartItemsMedia.forEach(({ node: { id, variants } }) => {
      if (merchandiseId.value === id.split("/").pop()) {
        total += parseFloat(variants.edges[0].node.price) * defaultQuantity.value; // Add the price of the matched item
      }
    });
    return total;
  }, 0);

  // Apply discount based on discount rules
  let finalPrice = totalPrice;

  // Assuming only one discount rule is applied (you can loop through multiple rules if needed)
  const discount = globalPriceRules[0];

  if (discount && discount.value && discount.type) {
    const discountValue = parseFloat(discount.value.value);
    const discountType = discount.type.value;

    if (discountType === "percent") {
      // Apply percentage discount
      finalPrice = finalPrice - (finalPrice * (discountValue / 100));
    } else if (discountType === "fixed") {
      // Apply fixed discount
      finalPrice = finalPrice - discountValue;
    }
  }

  // Ensure the final price doesn't go below zero
  finalPrice = Math.max(0, finalPrice);

  return (
    <Card>
      <BlockStack gap="300">
        <Text variant="headingLg" as="h5">Preview</Text>
        <Card>
          <BlockStack gap="100">
            <Box padding="200"><Text alignment="center" variant="headingMd" as="h6">{(bundleName.value) ? bundleName.value : "Bundle of 3 Combos"}</Text></Box>

            {cartItems.map(
              ({ merchandiseId, defaultQuantity }, index) => (
                <>
                  {cartItemsMedia.map(
                    ({ node: { id, title, featuredImage, variants } }) => (
                      (merchandiseId.value === id.split("/").pop()) && (
                        <>
                          {/* <InlineStack align="start" wrap={false} gap="300"> */}
                          <InlineStack align="start" blockAlign='center' wrap={false} gap="300">
                            <Thumbnail
                              source={featuredImage.url}
                              alt={title}
                            />
                            {/* Display title and price */}
                            <Text variant="bodyLg" as="p"><Badge tone="success">{defaultQuantity.value}</Badge> X {title}</Text>

                          </InlineStack>
                          <Text alignment="end" variant="bodyLg" as="p" fontWeight="semibold">{currency.replace('{{amount}}', '')}{variants.edges[0].node.price} {'  '}</Text>
                          {/* </InlineStack> */}
                          {(index !== cartItemsMedia.length - 1) ? <Text variant="bodyMd" alignment='center' as="h3"> ---------------- + ----------------</Text> : ''}
                        </>
                      )
                    ),
                  )}
                </>
              ),
            )}

            {(!cartItems.length) ? (
              <>
                <BlockStack gap="300">
                  <InlineStack align="start" wrap={false} gap="300">
                    <SkeletonThumbnail size="small" />
                    <SkeletonBodyText lines={2} />
                  </InlineStack>
                  <Text variant="bodyMd" alignment='center' as="h3"> ------------ + ------------</Text>
                  <InlineStack align="start" wrap={false} gap="300">
                    <SkeletonThumbnail size="small" />
                    <SkeletonBodyText lines={2} />
                  </InlineStack>
                  <Text variant="bodyMd" alignment='center' as="h3">------------ + ------------</Text>
                  <InlineStack align="start" wrap={false} gap="300">
                    <SkeletonThumbnail size="small" />
                    <SkeletonBodyText lines={2} />
                  </InlineStack>
                </BlockStack>
                <Box padding="100">
                  <Badge tone="info">
                    <Text variant="bodyLg" as="p">{(description.value) ? description.value : "Buy this combo and save 10% OFF"}</Text>
                  </Badge>
                </Box>
              </>
            ) : null}
            <Box padding="100">
              {/* Display the total price */}
              <InlineStack wrap={false} gap="300" align="end">
                <Text variant="bodyLg" as="p" fontWeight="semibold">Total: </Text>
                <Text variant="bodyLg" as="p" fontWeight="semibold">{currency.replace('{{amount}}', '')}{finalPrice.toFixed(2)}</Text>
                <Text variant="bodyLg" as="p" fontWeight="semibold" textDecorationLine="line-through">{currency.replace('{{amount}}', '')}{bundlePrice.value}</Text>
              </InlineStack>
            </Box>
            <Button disabled={!cartItems.length}>Add to Bundle</Button>
          </BlockStack>
        </Card>
      </BlockStack>
    </Card>
  );
}
