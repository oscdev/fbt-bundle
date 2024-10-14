import { Layout, Page, BlockStack, Banner, Button, Box, InlineStack } from "@shopify/polaris";
import { useField, useDynamicList, useForm } from '@shopify/react-form';
import { BundleInfo, Preview, Resource, BundleDiscountInfo, Customize } from "../components/Bundle/index";
import { useState, useEffect } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigate, useActionData  } from "@remix-run/react";
import { Confirm } from "~/components/Confirm";
import { bundle, settings } from "../services/index";
import { ExternalIcon } from "@shopify/polaris-icons";
export const action = async ({ params, request }) => {
  const formData = await request.formData();
  const bundleData = JSON.parse(formData.get("bundleData"));
  const cartItemsMedia = JSON.parse(formData.get("cartItemsMedia"));
  const removableCartItems = JSON.parse(formData.get("removableCartItems"));
  const savedResult = await bundle.setProduct(request, bundleData, cartItemsMedia);
  await bundle.setBundleAssociated(request, bundleData, savedResult);
  if (removableCartItems.length) {
    await bundle.unsetBundleAssociated(request, removableCartItems);
  }  
  return json({ status: "success", message: `Successfully saved bundle ${savedResult.title}.`});
};

export const loader = async ({ params, request }) => {
  const handle = params.handle;
  const bundleResult = (handle == "new") ? {} : await bundle.getProduct(request, handle);
  const shopData = await settings.shopDetail(request);
  return json({ bundleResult, handle, shopData });
};

export default function Bundle() {
  const { bundleResult, handle, shopData } = useLoaderData();
  const saveStatus = useActionData<typeof action>();
  const navigate = useNavigate();
  const submitForm = useSubmit();
  const [xhr, setXhr] = useState(false);
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [cartItemsMedia, setCartItemsMedia] = useState([]);
  const [removableCartItems, setRemovableCartItems] = useState([]);


  useEffect(() => {
    if(saveStatus?.status === "success") {
      reset();
      setXhr(false);
    }    
}, [saveStatus]);
  
  const emptyExpandedCartItemsFactory = (formArg) => ({
    merchandiseId: formArg.merchandiseId,
    handle: formArg.handle,
    defaultQuantity: formArg.defaultQuantity,
    priceRules: formArg.price
  });

  const emptyGlobalPriceRulesFactory = (formArg) => ({
    value: formArg.value,
    type: formArg.type,
    startAt: formArg.startAt,
    endAt: formArg.endAt
  });

  const {
    submit,
    reset,
    submitting,
    submitErrors,
    dirty,
    dynamicLists,
    fields: { bundleName, labelOnCard, bundleHandle, componentMetaId, bundlePrice, calculatePrice },
  } = useForm({
    fields: {
      bundleId: useField(bundleResult.id || ''),
      metaId: useField(bundleResult.metafield?.id || ''),
      componentMetaId: useField(bundleResult.components?.id || ''),
      bundleName: useField(bundleResult.title || ''),
      bundleHandle: useField(bundleResult.handle || ''),
      bundlePrice: useField(bundleResult.variants?.edges[0].node.price || ''),      
      customer: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.conditions.customer : ''),
      minPurchasableItems: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.conditions.minPurchasableItem : ''),
      calculatePrice: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.config?.calculatePrice : true),
      labelOnCard: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.config?.labelOnCard : ''),
    },
    dynamicLists: {
      expandedCartItems: useDynamicList(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.expandedCartItems : [], emptyExpandedCartItemsFactory),
      globalPriceRules: useDynamicList(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.globalPriceRules : [], emptyGlobalPriceRulesFactory)
    },
    onSubmit: async (data) => {
      const remoteErrors = [];
      // validate the bundle name
      if (!data.bundleName) {
        remoteErrors.push("Bundle Name is mandatory");
      }
      // validate the selected products length
      if (!data.expandedCartItems.length) {
        remoteErrors.push("Select Products are mandatory");
      }
      // validate the discount value based on discount type

      if (data.globalPriceRules.length) {
        if (!data.globalPriceRules[0].value) {
          remoteErrors.push("Discount value is mandatory");
        }
      }

      if (remoteErrors.length) {
        setXhr(false);
        return { status: "fail", errors: remoteErrors };
      } else {
        setXhr(true);
        submitForm({
          bundleData: JSON.stringify(data),
          cartItemsMedia: JSON.stringify(cartItemsMedia),
          removableCartItems: JSON.stringify(removableCartItems)
        }, { method: "post" });        
        return { status: "success" };
      }
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

  const onSetRemovableCartItems = (meta, merchandiseId) => {   
    if (bundleHandle.value == meta.value) {
      setRemovableCartItems(removableCartItems => [...removableCartItems, "gid://shopify/Product/" + merchandiseId]);
    }
  }

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

  function calculateBundlePrice(items, itemsMedia) {   
    let calculatedPrice = 0;
    items.forEach((item) => {
      itemsMedia.forEach((media) => {
        if (item.merchandiseId.value == media.node.id.split("/").pop()) {
          calculatedPrice = calculatedPrice + (item.defaultQuantity.value * parseFloat(media.node.variants.edges[0].node.price))
        }
      })
    })
    bundlePrice.onChange(calculatedPrice.toFixed(2));
  }

  const successBanner = saveStatus?.status === "success" ? (<Layout.Section>
    <Banner tone="success">
    <InlineStack gap="100" align="start" blockAlign="center">
      <p>{saveStatus?.message}</p>
      <Button url={"/app/bundle/list"} target="_blank" variant="plain" icon={ExternalIcon}>View bundle list</Button>
     </InlineStack>
    </Banner>
  </Layout.Section>) : null;

  const errorBanner =
    submitErrors.length > 0 ? (
      <Layout.Section>
        <Banner tone="critical">
          <p>There were some values is mandatory with your form submission:</p>
          <ul>
            {submitErrors.map(({ message }, index) => (
              <li key={index}>{submitErrors[index]}</li>
            ))}
          </ul>          
        </Banner>
      </Layout.Section>
    ) : null;

  return (
    <Page
      title="Create bundle"
      primaryAction={{
        content: "Save",
        disabled: !dirty,
        loading: xhr,
        onAction: () => {
          submit()
        }
      }}
      backAction={{ content: "Settings", onAction: () => confirmExit() }}
    >
      <Layout>
        {errorBanner}
        {successBanner}
        <Layout.Section>
          <BlockStack gap="300">            
            <BundleInfo
              bundleName={bundleName}
              labelOnCard={labelOnCard}
            />
            <Resource
              cartItems={cartItems}
              onAddCartItems={addCartItems}
              onEditCartItems={editCartItems}
              onRemoveCartItems={removeCartItems}
              onMoveCartItems={moveCartItems}
              onSetRemovableCartItems={onSetRemovableCartItems}
              cartItemsMedia={cartItemsMedia}
              setCartItemsMedia={setCartItemsMedia}
              calculatePrice={calculatePrice}
              onCalculatePrice={calculateBundlePrice}
            />
            <BundleDiscountInfo
              globalPriceRules={globalPriceRules}
              onAddGlobalPriceRules={addGlobalPriceRules}
              onRemoveGlobalPriceRules={removeGlobalPriceRules}
              onMoveGlobalPriceRules={moveGlobalPriceRules}
              bundlePrice={bundlePrice}
              cartItems={cartItems}
              cartItemsMedia={cartItemsMedia}
              currencyCodes={shopData}
              calculatePrice={calculatePrice}
              onCalculatePrice={calculateBundlePrice}
            />
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Preview
            bundleName={bundleName}
            bundlePrice={bundlePrice}
            labelOnCard={labelOnCard}
            cartItems={cartItems}
            cartItemsMedia={cartItemsMedia}
            globalPriceRules={globalPriceRules}
            currencyCodes={shopData}
          />
        </Layout.Section>
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
