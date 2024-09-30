import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack, Checkbox } from "@shopify/polaris";
import { useState, useCallback } from "react";
export function BundleInfo(pros) {
    const { bundleName, description, bundlePrice } = pros;
    const [mannualPrice, setMannualPrice] = useState(false);

    const [checked, setChecked] = useState(false);
    const handleChange = useCallback(
        (newChecked: boolean) => {
            setChecked(newChecked)
            setMannualPrice(newChecked)
        },
        [],
    );

    return (
        <Card>
            <BlockStack gap="200">
                <Text variant="headingMd" as="h2">General Info</Text>
                <Form onSubmit={() => { }}>
                    <FormLayout>
                        <TextField
                            label={<Text variant="headingXs" as="h6">Bundle name</Text>}
                            value={bundleName.value}
                            onChange={(e) => bundleName.onChange(e)}
                            placeholder="Bundle Name: e.g. Bundle of 3 Combos"
                            autoComplete="off"
                        />

                        <TextField
                            label={<Text variant="headingXs" as="h6">Short Description</Text>}
                            value={description.value}
                            onChange={(e) => description.onChange(e)}
                            placeholder="Short Description: e.g. Buy this combo and save 10% OFF"
                            autoComplete="off"
                        />

                        <TextField
                            label={<Text variant="headingXs" as="h6">Price</Text>}
                            prefix="Store currency Symbol"
                            value={bundlePrice.value}
                            readOnly={!mannualPrice}
                            onChange={(e) => { bundlePrice.onChange(e) }}
                            placeholder="0.00"
                            autoComplete="off"
                            connectedRight={<Checkbox
                                label="Set Price Manually"
                                checked={checked}
                                onChange={handleChange}
                            />}
                        />
                    </FormLayout>
                </Form>
            </BlockStack>
        </Card>
    );
}
