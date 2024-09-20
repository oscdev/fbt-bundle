import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useField, useDynamicList, useForm } from '@shopify/react-form';
import { title } from "process";

export default function AdditionalPage() {

  const emptyExpandedCartItemsFactory = (formArg) => ({
    merchandiseId: formArg.merchandiseId,
    handle: formArg.handle,
    defaultQuantity: formArg.quantity,
    priceRules: formArg.price    
  });

  const emptyGlobalPriceRulesFactory = (formArg) => ({
    value: formArg.merchandiseId,
    type: formArg.price,
    startAt: formArg.handle,
    endAt: formArg.quantity    
  });

  const {
    submit,
    reset,
    submitting,
    submitErrors,
    dirty,
    dynamicLists,
    fields: { title, description, customer, minPurchasableItem },
  } = useForm({
    fields: {
      title: useField(''),
      description: useField(''),
      customer: useField(''),
      minPurchasableItems: useField('')
    },
    dynamicLists: {
      expandedCartItems: useDynamicList([], emptyExpandedCartItemsFactory),
      globalPriceRules: useDynamicList([], emptyGlobalPriceRulesFactory)
    },
    onSubmit: async (data) => {
      console.log(data); 
    }
  });

  const {
    expandedCartItems: {
      addItem: addCartItems,
      editItem: editCartItems,
      removeItem: removeCartItems,
      moveItem: moveCartItems,
      fields: cartItems,
    },
    globalPriceRules: {
      addItem: addGlobalPriceRules,
      removeItem: removeGlobalPriceRules,
      moveItem: moveGlobalPriceRules,
      fields: globalPriceRules,
    }
  } = dynamicLists;

  return (
    <Page>
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="300">              
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>              
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
