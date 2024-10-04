import React from 'react';
import { Card, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Button, Thumbnail, Badge, Box, SkeletonDisplayText } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
export function Preview(pros) {
  const { bundleName, bundlePrice, description, cartItems, cartItemsMedia, currencyCodes, globalPriceRules } = pros;
  const currency = currencyCodes.currencyFormats.moneyInEmailsFormat;
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
              </>
            ) : null}

            <Box padding="100">
              <Badge tone="info">
                {(description.value) ? description.value : "Buy this combo and save 10% OFF"}
              </Badge>
            </Box>

            {(cartItemsMedia.length && bundlePrice.value) ? <Box padding="100">
              {/* Display the total price */}
              <InlineStack wrap={false} gap="300" align="end">
                <Text variant="bodyLg" as="p" fontWeight="semibold">Total: </Text>
                {(globalPriceRules.length && globalPriceRules[0].value.value) ? <>
                  <Text variant="bodyLg" as="p" fontWeight="semibold">{currency.replace('{{amount}}', (bundlePrice.value - ((globalPriceRules[0].value.value/100)*bundlePrice.value)).toFixed(2))}</Text>
                  <Text variant="bodyLg" as="p" fontWeight="semibold" textDecorationLine="line-through">{currency.replace('{{amount}}', bundlePrice.value)}</Text>
                </> : <>
                <Text variant="bodyLg" as="p" fontWeight="semibold">{currency.replace('{{amount}}', bundlePrice.value)}</Text>
                </>}
                
              </InlineStack>
            </Box> : <Box padding="100">              
              <InlineStack wrap={false} gap="300" align="end">
                <Text variant="bodyLg" as="p" fontWeight="semibold">Total: </Text>
                <SkeletonBodyText lines={1} />
                <SkeletonBodyText lines={1} />
              </InlineStack>
            </Box>}

            

            
            <Button disabled={!cartItems.length}>Add to Bundle</Button>
          </BlockStack>
        </Card>
      </BlockStack>
    </Card>
  );
}
