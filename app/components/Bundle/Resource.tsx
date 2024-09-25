import { useState, useEffect } from "react";
import { Form, Text, Button, BlockStack, TextField, FormLayout, Thumbnail, EmptyState, Spinner, Divider, Card, Tooltip, InlineGrid, Badge, InlineStack } from "@shopify/polaris";
import { Confirm } from "../Confirm";
import { XIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
import { it } from "node:test";
export function Resource(props) {
    const { cartItems, onAddCartItems, onEditCartItems, onRemoveCartItems, onMoveCartItems, cartItemsMedia, setCartItemsMedia } = props;
    const [loading, setLoading] = useState(true);
    const [isProductRemove, setIsProductRemove] = useState(false);
    const [productIndex, setProductIndex] = useState(null);
    const [confirmMsg, setIsConfirmMsg] = useState('');

    async function getProducts() {
        //Get ids of products in array format
        setLoading(true);
        const productsId = cartItems.map((item) => item.merchandiseId.value).join(",");

        const res = await fetch("shopify:admin/api/graphql.json", {
            method: "POST",
            body: JSON.stringify({
                query: `query {
                    products(first: 100, query: "id:${productsId.split(",").join(" OR id:")}") {
                        edges {
                        node {
                            id
                            title
                            handle
                            variants(first: 3) {
                            edges {
                                node {
                                id 
                                title
                                price
                                }
                            }
                            }
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
            setCartItemsMedia(output);
        } else {
            setCartItemsMedia(data.products.edges);
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
                handle: item.handle,
                defaultQuantity: 1,
                priceRules: null,
            });
        });
    }



    // Trigger the confirmation modal before removing the item
    function removeResource(index) {
        setIsConfirmMsg(`Are you sure you want to remove this product?`);
        setIsProductRemove(true);
        setProductIndex(index); // Store the index of the item to be removed
    }

    // Remove the item from the cart if confirmed
    function onConfirmProductRemove() {
        onRemoveCartItems(productIndex);
        setIsProductRemove(false); // Close the confirmation modal
        setProductIndex(null); // Reset the index
    }

    // Cancel the removal
    function onCancelRemove() {
        setIsProductRemove(false);
        setProductIndex(null); // Reset the index
    }
    console.log("cartItems", cartItems)


    return (
        <Card>
            <Form onSubmit={() => { }}>
                <FormLayout>
                    {cartItems.length ? (
                        <BlockStack gap="200">
                            <InlineGrid columns="1fr auto">
                                <Text variant="headingMd" as="h2">
                                    Add Products
                                </Text>
                                <Button
                                    variant="primary"
                                    textAlign="left"
                                    onClick={() => {
                                        pickResource();
                                    }}
                                >
                                    Browse
                                </Button>
                            </InlineGrid>

                            <Text variant="bodyLg" as="p">Add products to sell in FBT bundle </Text>

                            {cartItems.length > 0 && (
                                <BlockStack gap="300">
                                    {loading ? (
                                        <Text variant="bodyLg" as="p" alignment="center">
                                            <Spinner
                                                accessibilityLabel="Loading products"
                                                size="small"
                                            /></Text>
                                    ) : null}
                                    {cartItems.map(
                                        ({ merchandiseId }, index) => (
                                            <>
                                                {cartItemsMedia.map(
                                                    ({ node: { id, title, featuredImage } }) => (
                                                        (merchandiseId.value == id.split("/").pop()) && (
                                                            <InlineGrid columns="1fr auto" key={index}>
                                                                <InlineStack gap="200" blockAlign="center" wrap={false}>
                                                                    <Tooltip content="Move Up">
                                                                        <Button variant="plain"
                                                                            icon={ArrowUpIcon}
                                                                            disabled={index === 0}
                                                                            onClick={() => onMoveCartItems(index - 1, index)}
                                                                        />
                                                                    </Tooltip>
                                                                    <Tooltip content="Move Down">
                                                                        <Button variant="plain"
                                                                            icon={ArrowDownIcon}
                                                                            disabled={index === cartItems.length - 1}
                                                                            onClick={() => onMoveCartItems(index, index + 1)}
                                                                        />
                                                                    </Tooltip>
                                                                    <Thumbnail
                                                                        source={featuredImage.url}
                                                                        alt={title}
                                                                    />
                                                                    <Text variant="bodyLg" as="p">{title}</Text>

                                                                </InlineStack>
                                                                <InlineStack gap="200" key={index} blockAlign="center">
                                                                    <Text variant="bodyLg" as="p" alignment="end" fontWeight="bold"> <TextField label="Quantity" labelHidden type="number" value="1" autoComplete="off" /></Text>
                                                                    <Text variant="bodyLg" as="p" alignment="end" fontWeight="bold"><Button size="large" variant="plain" tone="critical" icon={XIcon} onClick={() => removeResource(index)}></Button></Text>
                                                                </InlineStack>
                                                            </InlineGrid>
                                                        )
                                                    ),
                                                )}
                                            </>
                                        ),
                                    )}
                                </BlockStack>
                            )}

                        </BlockStack>
                    ) : (
                        <BlockStack gap="200">
                            <Text variant="headingMd" as="h2">
                                Add Products
                            </Text>
                            <Text variant="bodyLg" as="p">Add products to sell in FBT bundle </Text>
                            <EmptyState
                                heading="No FBT Bundle products added"
                                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                            >
                                <Button
                                    variant="primary"
                                    textAlign="left"
                                    onClick={() => {
                                        pickResource();
                                    }}
                                >
                                    Browse
                                </Button>
                            </EmptyState>
                        </BlockStack>
                    )}
                </FormLayout>
            </Form>
            <Confirm
                isConfirm={isProductRemove}
                confirmMsg={confirmMsg}
                onConfirm={onConfirmProductRemove}
                onCancel={onCancelRemove}
            />
        </Card>
    );
}
