import { Card, Box, Layout, IndexTable, ButtonGroup, Button, EmptyState } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
export function BundleProductList(props) {
    const { productList } = props;
    const navigate = useNavigate();

    const resourceName = {
        singular: "Form",
        plural: "Forms",
    };

    const emptyStateMarkup = (
        <EmptyState
            heading="Once you create a new form, it will be visible here!"
            action={{
                content: 'Create New Form',
                url: '/app/registration/add',
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        />
    );

    const rowMarkup = productList.map(({ node }, index) => {
        // Parse the metafield value to access dynamic data
        const metafieldValue = JSON.parse(node.metafield.value);
        const expandedCartItemsLength = metafieldValue.expand.expandedCartItems.length;
        const globalPriceRule = metafieldValue.expand.globalPriceRules[0];

        return (
            <IndexTable.Row id={'id-' + index} key={'key-' + index} position={index} disabled={true}>
                <IndexTable.Cell>{node.title}</IndexTable.Cell>
                <IndexTable.Cell>{expandedCartItemsLength}</IndexTable.Cell>
                <IndexTable.Cell>{globalPriceRule.type}</IndexTable.Cell>
                <IndexTable.Cell>{globalPriceRule.value}</IndexTable.Cell>
                <IndexTable.Cell>{globalPriceRule.startAt}</IndexTable.Cell>
                <IndexTable.Cell>{globalPriceRule.endAt}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div className="customTableRow">
                        <ButtonGroup>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    navigate('/app/bundle/' + node.id.replace('gid://shopify/Product/', ''));
                                }}
                            >
                                Edit
                            </Button>
                        </ButtonGroup>
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        );
    });

    return (
        <Layout.Section>
            <Card>
                <Box paddingBlock="200">
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={productList.length}
                        emptyState={emptyStateMarkup}
                        selectedItemsCount={"All"}
                        onSelectionChange={() => { }}
                        headings={[
                            { title: "Name" },
                            { title: "Products" },
                            { title: "Disc Type" },
                            { title: "Disc Value" },
                            { title: "StartAt" },
                            { title: "EndAt" },
                            { title: "Actions" }
                        ]}
                        selectable={false}
                    >
                        {rowMarkup}
                    </IndexTable>
                </Box>
            </Card>
        </Layout.Section>
    );
}
