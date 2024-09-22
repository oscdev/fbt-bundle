import { Layout, Page, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useField, useDynamicList, useForm } from '@shopify/react-form';
import { BundleInfo, Preview, Resource, BundleDiscountInfo, Customize } from "../components/Bundle/index";
import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit , useNavigate} from "@remix-run/react";

import { bundle } from "../services/index";

export const action = async ({ params, request }) => {
  const formData = await request.formData();
  await bundle.setProduct(request, JSON.parse(formData.get("bundleData")));
  return {success: true,}
  //return redirect("/app");
};

export const loader = async ({ params, request }) => {
  //const handle = params.handle;
  //const { admin } = await authenticate.admin(request);  
  return json({});
};


export default function Bubdle() {
  const bundleResult = useLoaderData();
  const submitForm = useSubmit();

  const [cartItemsMedia, setCartItemsMedia] = useState([]);

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
    fields: { bundleName, description, customer, minPurchasableItem },
  } = useForm({
    fields: {
      bundleName: useField(''),
      description: useField(''),
      customer: useField(''),
      minPurchasableItems: useField('')
    },
    dynamicLists: {
      expandedCartItems: useDynamicList([], emptyExpandedCartItemsFactory),
      globalPriceRules: useDynamicList([{
        value: '',
        type: '',
        startAt: '',
        endAt: ''
      }], emptyGlobalPriceRulesFactory)
    },
    onSubmit: async (data) => {
      return submitForm({ bundleData: JSON.stringify(data) }, { method: "post" });      
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
    <Page
      title="Create bundle for Frequently Bought Together"
      primaryAction={{
        content: "Save",
        disabled: !dirty,
        onAction: () => {
          submit()
        }
      }}
      backAction={{ content: "Settings", onAction: () => { } }}
    >
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            <BundleInfo
              bundleName={bundleName}
              description={description}
            />
            <Resource 
              cartItems={cartItems}
              onAddCartItems={addCartItems}
              onEditCartItems={editCartItems}
              onRemoveCartItems={removeCartItems}
              onMoveCartItems={moveCartItems}
              cartItemsMedia={cartItemsMedia}
              setCartItemsMedia={setCartItemsMedia}
            />
            <BundleDiscountInfo
              globalPriceRules={globalPriceRules}
              onAddGlobalPriceRules={addGlobalPriceRules}
              onRemoveGlobalPriceRules={removeGlobalPriceRules}
              onMoveGlobalPriceRules={moveGlobalPriceRules}
            />            
            {/* <Customize /> */}
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Preview 
            bundleName={bundleName}
            description={description}
            cartItemsMedia={cartItemsMedia} 
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
