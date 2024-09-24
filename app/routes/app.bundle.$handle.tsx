import { Layout, Page, BlockStack } from "@shopify/polaris";
import { useField, useDynamicList, useForm } from '@shopify/react-form';
import { BundleInfo, Preview, Resource, BundleDiscountInfo, Customize } from "../components/Bundle/index";
import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { Confirm } from "~/components/Confirm";
import { Footer } from "../components/Footer";
import { bundle } from "../services/index";

export const action = async ({ params, request }) => {
  const formData = await request.formData();
  await bundle.setProduct(request, JSON.parse(formData.get("bundleData")));
  //return { success: true, }
  return redirect("/app/bundle/list");
};

export const loader = async ({ params, request }) => {
  const handle = params.handle;
  const bundleResult = (handle == "new") ? {} : await bundle.getProduct(request, handle);
  return json({ bundleResult, handle });
};


export default function Bubdle() {
  const { bundleResult, handle } = useLoaderData();

  console.log("bundleResult", JSON.stringify(bundleResult));
  console.log("handle", handle);

  const submitForm = useSubmit();
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [cartItemsMedia, setCartItemsMedia] = useState([]);
  const navigate = useNavigate();
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

  const defaultGlobalPriceRules = [{
    value: '',
    type: '',
    startAt: '',
    endAt: ''
  }]

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
      bundleName: useField(bundleResult.title || ''),
      description: useField(bundleResult.description || ''),
      customer: useField(bundleResult.metafield.value ? JSON.parse(bundleResult.metafield.value).expand.conditions.customer : ''),
      minPurchasableItems: useField(bundleResult.metafield.value ? JSON.parse(bundleResult.metafield.value).expand.conditions.minPurchasableItem : '')
    },
    dynamicLists: {
      expandedCartItems: useDynamicList(bundleResult.metafield.value ? JSON.parse(bundleResult.metafield.value).expand.expandedCartItems : [], emptyExpandedCartItemsFactory),
      globalPriceRules: useDynamicList(bundleResult.metafield.value ? JSON.parse(bundleResult.metafield.value).expand.globalPriceRules : defaultGlobalPriceRules, emptyGlobalPriceRulesFactory)
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

  function onShowForm() {
    navigate("/app");
}

  function confirmExit() {
    if (dirty) {
        setIsConfirmExit(true)
        setConfirmMsg('Are you sure you want to exit without saving');
    } else {
        onShowForm()
    }
}

function onConfirmExit() {
    onShowForm()
}
function onCancelExit() {
    setIsConfirmExit(false)
}

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
      backAction={{ content: "Settings", onAction: () => confirmExit() }}
    >
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
        <Footer />
      </Layout>
      <Confirm
        isConfirm={isConfirmExit}
        confirmMsg={confirmMsg}
        onConfirm={onConfirmExit}
        onCancel={onCancelExit}
        returnData={null}
      />
    </Page>
  );
}
