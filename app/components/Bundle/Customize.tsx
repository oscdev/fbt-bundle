
import { TextField, Card, Form, FormLayout, Button, Text, BlockStack, RadioButton, InlineStack } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
export function Customize() {
    return (
        <Card>
            <BlockStack gap="200">
                <Text variant="headingLg" as="h5">Customize Section</Text>
                <Text variant="bodyLg" as="p">Display bundle widget in the product page of</Text>
                <Form onSubmit={() => { }}>
                    <FormLayout>
                        <RadioButton
                            label="All products from the bundle"
                            // helpText="Customers will only be able to check out as guests."
                            // checked={value === 'disabled'}
                            id="disabled"
                            name="accounts"
                        // onChange={handleChange}
                        />
                        <RadioButton
                            label="Specific products"
                            // helpText="Customers will be able to check out with a customer account or as a guest."
                            id="optional"
                            name="accounts"
                        // checked={value === 'optional'}
                        // onChange={handleChange}
                        />
                        <Text variant="bodyLg" as="p">Customize bundle product  </Text>
                        <Text variant="bodyLg" as="p"><Button variant="primary" textAlign="left"> Customize</Button> </Text>
                    </FormLayout>
                </Form>
            </BlockStack>
        </Card>
    )
}
