import React from 'react'
import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack, InlineStack } from "@shopify/polaris";
export function BundleDiscountInfo(pros) {
  const { globalPriceRules } = pros;
  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingLg" as="h5">Apply Discount</Text>
        <Form onSubmit={() => { }}>
          <FormLayout>
            {globalPriceRules.map(({ type, value, startAt, endAt }, index) => (
              <>
                <InlineStack align="start" wrap={false} gap="300">
                  <TextField
                    label={<Text variant="headingMd" as="h6">Discount type</Text>}
                    value={type.value}
                    onChange={(e) => type.onChange(e)}
                    autoComplete="off"
                  />
                  <TextField
                    label={<Text variant="headingMd" as="h6">Discount value</Text>}
                    value={value.value}
                    onChange={(e) => value.onChange(e)}
                    autoComplete="off"
                  />
                </InlineStack>
              </>
            )
            )}
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  )
}
