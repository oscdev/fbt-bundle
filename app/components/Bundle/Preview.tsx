import React from 'react'
import { LegacyCard, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Card, Button } from '@shopify/polaris'

export function Preview() {
  return (
    <LegacyCard>
      <LegacyCard.Section>
        <BlockStack gap="300">
          <Text variant="headingLg" as="h5">Preview</Text>
          <Card>
            <BlockStack gap="300">
              <Text alignment="center" variant="headingMd" as="h6">Frequently Bought Together</Text>
              <Text variant="bodyLg" as="p">Buy this combo and save 10%</Text>
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
              <InlineStack align="start" wrap={false} gap="300">
                <Text variant="bodyMd" as="p">Total: </Text>
                <Text variant="bodyMd" as="p">Rs.256.00</Text>
                <Text variant="bodyMd" as="p" textDecorationLine="line-through">Rs.300.00</Text>
              </InlineStack>
              <Button disabled>Add to cart | Save 10%    </Button>
            </BlockStack>
          </Card>
        </BlockStack>
      </LegacyCard.Section>
    </LegacyCard>
  )
}

