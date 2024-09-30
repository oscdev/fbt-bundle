import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack } from "@shopify/polaris";
export function BundleInfo(pros) {
    const { bundleName, description } = pros;
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
                    </FormLayout>
                </Form>
            </BlockStack>
        </Card>
    );
}
