import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack } from "@shopify/polaris";

export function BundleInfo(pros) {
    const { bundleName, labelOnCard } = pros; 
    return (
        <Card>
            <BlockStack gap="200">
                <Text variant="headingMd" as="h2">General</Text>
                <Form onSubmit={() => { }}>
                    <FormLayout>
                        <TextField
                            label={<Text variant="headingXs" as="h6">Bundle name</Text>}
                            value={bundleName.value}
                            onChange={(e) => bundleName.onChange(e)}
                            placeholder="E.g. Bundle of 3 Combos"
                            autoComplete="off"
                        />

                        <TextField
                            label={<Text variant="headingXs" as="h6">Discount label</Text>}
                            value={labelOnCard.value}
                            onChange={(e) => labelOnCard.onChange(e)}
                            placeholder="E.g. Buy this combo and get 10% OFF"
                            autoComplete="off"
                        />
                    </FormLayout>
                </Form>
            </BlockStack>
        </Card>
    );
}
