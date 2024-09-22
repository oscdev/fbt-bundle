import React from 'react'
import { LegacyCard, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Card, Button } from '@shopify/polaris'

export function Preview(pros) {
  const { bundleName, description } = pros;
  return (
    <LegacyCard>
      <LegacyCard.Section>
        <BlockStack gap="300">
          <Text variant="headingLg" as="h5">Preview</Text>
          <Card>
            <BlockStack gap="300">
              <Text alignment="center" variant="headingMd" as="h6">{bundleName.value}</Text>
              <Text variant="bodyLg" as="p">{description.value}</Text>
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

