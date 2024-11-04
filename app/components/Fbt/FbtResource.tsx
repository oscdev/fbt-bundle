import { useState, useEffect } from "react";
import { Button, BlockStack, Thumbnail, InlineGrid, Card, Text, EmptyState } from "@shopify/polaris";
import logo from "../../assets/images/logo.jpg";
import { useDynamicList, useForm } from '@shopify/react-form';
import { DeleteIcon } from '@shopify/polaris-icons'
import { Confirm } from "../Confirm";

export function FbtResource(props) {
    const { productId, productTitle, crossProducts, productsMedia } = props;
    const [deletableFbt, setDeletableFbt] = useState({});
    const [isDeleteFbt, setIsDeleteFbt] = useState(false);

    const emptyFbtCrossItemsFactory = (formArg) => ({
        id: formArg.id,
        title: formArg.title,
        handle: formArg.handle
    });

    const {
        submit,
        reset,
        dirty,
        dynamicLists,
    } = useForm({
        dynamicLists: {
            fbtCrossItems: useDynamicList(JSON.parse(crossProducts.value), emptyFbtCrossItemsFactory)
        },
        onSubmit: async (data) => {
            crossProducts.onChange(JSON.stringify(data.fbtCrossItems))
            reset();
            return { status: "success" };
        }
    });

    const {
        fbtCrossItems: {
            addItem: addItem,
            editItem: editItem,
            removeItem: removeItem,
            moveItem: moveItem,
            fields: fbtCrossItems,
        }
    } = dynamicLists;

    return (
        <Card>
            <BlockStack gap="200">
                <InlineGrid gap="400" columns="1fr auto">
                    <Text as="h2" variant="headingSm">
                        {productTitle.value}
                    </Text>
                    <Button
                        onClick={async () => {
                            /**** */
                            const filterObj = [];
                            filterObj.push("NOT " + productId.value.split("/").pop());
                            for (let i = 0; i < fbtCrossItems.length; i++) {
                                const gqId = fbtCrossItems[i].id.value.split("/").pop();
                                filterObj.push("NOT " + gqId);
                            }
                            filterObj.push("NOT metafields.oscp.fbtSearchable:searchable");
                            /**** */
                            const pickedResource = await window.shopify.resourcePicker({
                                type: 'product',
                                action: "add",
                                multiple: false,
                                filter: {
                                    query: filterObj.join(" AND "),
                                    variants: false,
                                },
                            });
                            addItem({
                                id: pickedResource[0].id.split("/").pop(),
                                title: pickedResource[0].title,
                                handle: pickedResource[0].handle
                            })
                            setTimeout(() => {
                                submit();
                            }, 200)
                        }}
                    >
                        {(fbtCrossItems.length) ? 'Assign More FBT Product' : 'Assign FBT Product'}
                    </Button>
                </InlineGrid>
                {(!fbtCrossItems.length) && (
                    <EmptyState
                        heading={"Not Assigned FBT Product yet for " + productTitle.value}
                    />
                )}
                <InlineGrid columns={(fbtCrossItems.length > 5) ? 5 : 3}>
                    {fbtCrossItems.map(({ id, title, handle }, index) => (
                        <div style={{ padding: '10px' }} key={index}>
                            <Card>
                                <BlockStack gap="200">
                                    <InlineGrid columns="1fr auto">
                                        {/**** */}
                                        {productsMedia.map(
                                            ({ node: { mediaItemId, featuredImage, metafield } }) => (
                                                (id.value == mediaItemId.split("/").pop()) && (
                                                    <>
                                                        <Thumbnail
                                                            source={featuredImage?.url}
                                                            alt={title.value}
                                                        />
                                                    </>
                                                )
                                            ),
                                        )}
                                        {/**** */}
                                        <Button
                                            variant="plain"
                                            onClick={() => {
                                                setDeletableFbt({
                                                    index: index,
                                                    title: title.value
                                                });
                                                setIsDeleteFbt(true); 
                                            }}
                                            icon={DeleteIcon}
                                        />
                                    </InlineGrid>
                                    <Text as="p" variant="bodyMd">
                                        {title.value}
                                    </Text>
                                </BlockStack>
                            </Card>
                        </div>
                    ))}
                </InlineGrid>
            </BlockStack>
            <Confirm
                isConfirm={isDeleteFbt}
                confirmMsg={'Are you sure you want to remove ' + deletableFbt.title + ' ?'}
                onConfirm={() => {
                    removeItem(deletableFbt.index);
                    setTimeout(() => {
                        submit();
                    }, 200);
                    setIsDeleteFbt(false)
                }
                }
                onCancel={() => {
                    setIsDeleteFbt(false)
                }}
            />
        </Card>
    );
}
