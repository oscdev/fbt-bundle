import React from 'react'
import { LegacyCard, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Card, Button, Thumbnail } from '@shopify/polaris'

export function Preview(pros) {
  const { bundleName, description, cartItems, cartItemsMedia } = pros;

  console.log("cartItemsMedia", JSON.stringify(cartItemsMedia))
  return (
    <LegacyCard>
      <LegacyCard.Section>
        <BlockStack gap="300">
          <Text variant="headingLg" as="h5">Preview</Text>
          <Card>
            <BlockStack gap="300">
              <Text alignment="center" variant="headingMd" as="h6">{(bundleName.value) ? bundleName.value : "Bundle of 3 Combos"}</Text>
              <Text variant="bodyLg" as="p">{(description.value) ? description.value : "Buy this combo and save 10% OFF"}</Text>

              {cartItems.map(
                ({ merchandiseId }, index) => (
                  <>
                    {cartItemsMedia.map(
                      ({ node: { id, title, featuredImage, priceV2 } }) => (
                        (merchandiseId.value == id.split("/").pop()) && (
                          <>
                            <InlineStack align="start" blockAlign="center" wrap={false} gap="300">
                              <Thumbnail
                                source={featuredImage.url}
                                alt={title}
                              />
                             <Text variant="bodyLg" as="p">{title}</Text>
                             <Text variant="bodyLg" as="p">{priceV2}</Text>
                            </InlineStack>
                            {(index !== cartItemsMedia.length - 1) ? <Text variant="bodyMd" alignment='center' as="h3"> ------------ + ------------</Text> : ''}
                          </>
                        )
                      ),
                    )}
                  </>
                ),
              )}



              {(!cartItemsMedia.length) ? <>
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
              </> : null}

              <InlineStack align="start" wrap={false} gap="300">
                <Text variant="bodyMd" as="p">Total: </Text>
                <Text variant="bodyMd" as="p">Rs.00.00</Text>
                <Text variant="bodyMd" as="p" textDecorationLine="line-through">Rs.00.00</Text>
              </InlineStack>

              <Button disabled>Add to cart | Save 10%    </Button>
            </BlockStack>
          </Card>
        </BlockStack>
      </LegacyCard.Section>
    </LegacyCard>
  )
}

