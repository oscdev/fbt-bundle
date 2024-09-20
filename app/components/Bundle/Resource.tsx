
import { TextField, Card, Form, FormLayout, Button, Text, BlockStack, InlineStack } from "@shopify/polaris";
// import { ResourcePicker } from "@shopify/app-bridge-react";
import { useState, useCallback } from "react";
export function Resource() {
    const [active, setActive] = useState(false);
    const handleResourcePickerClose = useCallback(() => setActive(false), []);
    const handleResourceSelection = useCallback(
        (resources) => {
            // onAddResources(resources);
            console.log('resources === ', resources)
            resources.selection.forEach((resource) => {
                resource.variants.forEach((variant) => {
                    const gqId = variant.id.split('/').pop();
                    addResources({
                        id: gqId,
                        handle: resource.handle
                    });
                })                
            });
            handleResourcePickerClose();
        },
        []
    );

    return (
        <Card>
            <BlockStack gap="200">
                <Text variant="headingLg" as="h5">Add Products</Text>
                <Form onSubmit={() => { }}>
                    <FormLayout>
                        <Button
                            variant="primary"
                            textAlign="left"
                            onClick={() => setActive(true)}
                        >
                            Select Bundle Products
                        </Button>

                    </FormLayout>
                </Form>
            </BlockStack>
            {/* <ResourcePicker
                resourceType="Product"
                showVariants={true}
                allowMultiple={true}
                open={active}
                onCancel={handleResourcePickerClose}
                onSelection={handleResourceSelection}
            /> */}
        </Card>
    )
}
