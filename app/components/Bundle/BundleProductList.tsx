import { Card, Box, Text, Layout, IndexTable, ButtonGroup, Button, EmptyState } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import { PlusIcon } from '@shopify/polaris-icons';
export function BundleProductList(props) {
    const { productList } = props;
    const navigate = useNavigate();

     // Utility function to get the highest price rule based on the current date
     const getHighestPriceRule = (priceRules) => {
        const currentDate = new Date();
        const validPriceRules = priceRules.filter(rule => {
            const startDate = new Date(rule.startAt);
            const endDate = new Date(rule.endAt);
            return currentDate >= startDate && currentDate <= endDate;
        });
        // Return the highest value rule
        return validPriceRules.reduce((maxRule, rule) => {
            return parseFloat(rule.value) > parseFloat(maxRule.value) ? rule : maxRule;
        }, validPriceRules[0]);
    };

    const resourceName = {
        singular: "Form",
        plural: "Forms",
    };

    const emptyStateMarkup = (
        <EmptyState
            heading="Once you create a new bundle product, it will be visible here!"
            action={{
                content: 'Create Bundle',
                url: '/app/bundle/new',
                icon: PlusIcon,
            }}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        />
    );

    const rowMarkup = productList.map(({ node }, index) => {
        // Parse the metafield value to access dynamic data
        const metafieldValue = (node.metafield) ? JSON.parse(node.metafield.value) : null;
        if(!metafieldValue) return null;
        const expandedCartItemsLength = metafieldValue.expand?.expandedCartItems.length;
          // Get the highest valid price rule
        const highestPriceRule = getHighestPriceRule(metafieldValue.expand?.globalPriceRules || []);
        return (
            <IndexTable.Row id={'id-' + index} key={'key-' + index} position={index} disabled={true}>
                <IndexTable.Cell>{node.title}</IndexTable.Cell>
                <IndexTable.Cell>{expandedCartItemsLength}</IndexTable.Cell>
                <IndexTable.Cell>{highestPriceRule?.value ? `${highestPriceRule.value}%` : 'No Discount'}</IndexTable.Cell>
                <IndexTable.Cell>{highestPriceRule?.startAt ? `${highestPriceRule?.startAt}` : 'No Date'}</IndexTable.Cell>
                <IndexTable.Cell>{highestPriceRule?.endAt ? `${highestPriceRule?.endAt}` : 'No Date'}</IndexTable.Cell>
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
                <IndexTable
                    resourceName={resourceName}
                    itemCount={rowMarkup.length}
                    emptyState={emptyStateMarkup}
                    selectedItemsCount={"All"}
                    onSelectionChange={() => { }}
                    headings={[
                        { title: "Name" },
                        { title: "Products" },
                        { title: "Discount" },
                        { title: "StartAt" },
                        { title: "EndAt" },
                        { title: "Actions" }
                    ]}
                    selectable={false}
                >
                    {rowMarkup}
                </IndexTable>

            </Card>
        </Layout.Section>
    );
}
