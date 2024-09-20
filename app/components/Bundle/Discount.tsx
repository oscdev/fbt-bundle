import React from 'react'
import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack, InlineStack } from "@shopify/polaris";
export function Discount() {
  return (
    <Card>
    <BlockStack gap="200">
    <Text variant="headingLg" as="h5">Apply Discount</Text>
    <Form onSubmit={() => { }}>
        <FormLayout>
        <InlineStack align="start" wrap={false} gap="300">
        <TextField
                label={<Text variant="headingMd" as="h6">Discount type</Text>}
                // value={bundleName.value}
                // onChange={(e) => bundleName.onChange(e)}
                // placeholder="Eg: FBT for mobile phones"
                autoComplete="off"
            />
            <TextField
                label={<Text variant="headingMd" as="h6">Discount value</Text>}
                // value={heading.value}
                // onChange={(e) => heading.onChange(e)}
                // placeholder="Frequently bought together"
                autoComplete="off"
            />
            </InlineStack>
        </FormLayout>
    </Form>
    </BlockStack>
</Card>
  )
}
