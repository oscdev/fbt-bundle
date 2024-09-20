import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack } from "@shopify/polaris";
export function BundleInfo(pros) {    
    // const {bundleName, heading, description, btnText } = pros;
    return (
            <Card>
                <BlockStack gap="200">
                <Text variant="headingLg" as="h5">General Info</Text>
                <Form onSubmit={() => { }}>
                    <FormLayout>
                    <TextField
                            label={<Text variant="headingMd" as="h6">Bundle name</Text>}
                            // value={bundleName.value}
                            // onChange={(e) => bundleName.onChange(e)}
                            placeholder="Enter bundle name"
                            autoComplete="off"
                        />
                        <TextField
                            label={<Text variant="headingMd" as="h6">Title</Text>}
                            // value={heading.value}
                            // onChange={(e) => heading.onChange(e)}
                            placeholder="Frequently bought together"
                            autoComplete="off"
                        />
                        <TextField
                            label={<Text variant="headingMd" as="h6">Description</Text>}
                            // value={description.value}
                            // onChange={(e) => description.onChange(e)}
                            placeholder="Buy this combo and save 10% OFF"
                            autoComplete="off"
                        />
                        <TextField
                            label={<Text variant="headingMd" as="h6">Button action</Text>}
                            // value={btnText.value}
                            // onChange={(e) => btnText.onChange(e)}
                            placeholder="Add to cart | Save 10% OFF"
                            autoComplete="off"
                        />
                    </FormLayout>
                </Form>
                </BlockStack>
            </Card>
    );
}
