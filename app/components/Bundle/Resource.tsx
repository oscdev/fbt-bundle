import { useState, useCallback, useEffect } from "react";
import { PageActions, Text, ButtonGroup, Button, BlockStack, Grid, Thumbnail, EmptyState, Spinner, Layout, Card, Tag, CalloutCard, Badge } from "@shopify/polaris";
import { Confirmation } from ".";

export function Resource(props) {
    const { cartItems, onAddCartItems, onEditCartItems, onRemoveCartItems, onMoveCartItems } = props;
    const [productsMedia, setProductsMedia] = useState([]);
    const [loading, setLoading] = useState(true);


    async function getProducts() {
        //Get ids of products in array format
        setLoading(true);
        const productsId = cartItems.map((item) => item.merchandiseId.value).join(",");
        console.log("productsId123", productsId);
        
        const res = await fetch("shopify:admin/api/graphql.json", {
          method: "POST",
          body: JSON.stringify({
            query: `query {
                    products(first: 100, query: "id:${productsId.split(",").join(" OR id:")}") {
                        edges {
                        node {
                            id
                            title
                            featuredImage {
                                url
                            }        
                        }
                        }
                    }
                }`,
          }),
        });
    
        const { data } = await res.json();
        if (productsId) {
          const sequence = data.products.edges;
    
          const productIdsOrder = productsId.split(",");
    
          // Create a map of input nodes by their IDs
          const inputMap = new Map(
            sequence.map((item) => [item.node.id.split("/").pop(), item]),
          );
    
          // Rearrange the input based on the order in productIdsOrder
          const output = productIdsOrder.map((id) => inputMap.get(id));
          setProductsMedia(output);
        } else {
          setProductsMedia(data.products.edges);
        }
    
        setLoading(false);
      }

    useEffect(() => {
        getProducts();
    }, [cartItems.length]);

    async function pickResource() {
        const filterObj = [];
        for (let i = 0; i < cartItems.length; i++) {
            const gqId = cartItems[i].merchandiseId.value.split("/").pop();
            filterObj.push("NOT " + gqId);
        }

        const pickedResource = await window.shopify.resourcePicker({
            type: 'product',
            action: "add",
            multiple: true,
            filter: {
                query: filterObj.join(" AND "),
                variants: false,
            },
        });

        pickedResource.map((item) => {
            const gqId = item.id.split("/").pop();
            onAddCartItems({
                merchandiseId: gqId,
                handle: item.title,
                defaultQuantity: 1,
                priceRules: null,
            });
        });
    }

    return (
            <Card>
                <Text as="h5" fontWeight="bold" variant="headingMd">
                    Apply Discount to
                </Text>

                {cartItems.length ? (
                    <>
                        <PageActions
                            secondaryActions={[
                                {
                                    content: "Add More Products",
                                    onAction: () => {
                                        pickResource();
                                    },
                                }
                            ]}
                        />
                        {cartItems.length > 0 && (
                            <BlockStack gap="200">
                                <Text variant="headingMd" as="h5">
                                    Products
                                </Text>
                                <Grid columns={{ sm: 2, md: 4, lg: 6 }}>
                                    {loading ? (
                                        <Spinner
                                            accessibilityLabel="Loading products"
                                            size="large"
                                        />
                                    ) : null}
                                    {productsMedia.map(
                                        ({ node: { title, featuredImage } }, index) => (
                                            <BlockStack gap="200" key={index}>
                                                <Thumbnail
                                                    source={featuredImage.url}
                                                    alt={title}
                                                />
                                                    {title}                                               
                                            </BlockStack>
                                        ),
                                    )}
                                </Grid>
                            </BlockStack>
                        )}
                    </>
                ) : (
                    <CalloutCard
                        illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                        primaryAction={{
                            content: (
                                <ButtonGroup>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            pickResource();
                                        }}
                                    >
                                        Select Product(s)
                                    </Button>
                                </ButtonGroup>
                            ),
                        }}
                    >
                        <p>
                            Selected Products
                            above.
                        </p>
                    </CalloutCard>
                )}
            </Card>
    );
}
