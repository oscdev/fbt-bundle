import { Layout, Page, BlockStack, Banner } from "@shopify/polaris";
import { useField, useDynamicList, useForm } from '@shopify/react-form';
import { BundleInfo, Preview, Resource, BundleDiscountInfo, Customize } from "../components/Bundle/index";
import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";
import { Confirm } from "~/components/Confirm";
import { bundle, settings } from "../services/index";

export const action = async ({ params, request }) => {
  const formData = await request.formData();
  const bundleData = JSON.parse(formData.get("bundleData"));
  const cartItemsMedia = JSON.parse(formData.get("cartItemsMedia"));
  const removableCartItems = JSON.parse(formData.get("removableCartItems"));

  const savedResult = await bundle.setProduct(request, bundleData, cartItemsMedia);

  const setBundleAssociatedResult = await bundle.setBundleAssociated(request, bundleData, savedResult);
  

  if(removableCartItems.length){
    const unsetBundleAssociatedResult = await bundle.unsetBundleAssociated(request, removableCartItems);
  }
  console.log('saveResult = ', savedResult)
  //return { success: true, }
  return redirect("/app/bundle/list");
};

export const loader = async ({ params, request }) => {
  const handle = params.handle;
  const bundleResult = (handle == "new") ? {} : await bundle.getProduct(request, handle);
  const shopData = await settings.shopDetail(request);
  return json({ bundleResult, handle, shopData });
};


export default function Bundle() {
  const { bundleResult, handle, shopData } = useLoaderData();
  const [showToast, setShowToast] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const submitForm = useSubmit();
  const [isConfirmExit, setIsConfirmExit] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState(false);
  const [cartItemsMedia, setCartItemsMedia] = useState([]);

  const [removableCartItems, setRemovableCartItems] = useState([]);

  const navigate = useNavigate();
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

  const today = new Date();
  const defaultGlobalPriceRules = [{
    value: '',
    type: 'percent',
    startAt: today.toISOString().split('T')[0],
    endAt: null
  }]

  const {
    submit,
    reset,
    submitting,
    submitErrors,
    dirty,
    dynamicLists,
    fields: { bundleName, description, bundleHandle, componentMetaId, bundlePrice },
  } = useForm({
    fields: {
      bundleId: useField(bundleResult.id || ''),
      metaId: useField(bundleResult.metafield?.id || ''),
      componentMetaId: useField(bundleResult.components?.id || ''),
      bundleName: useField(bundleResult.title || ''),
      bundleHandle: useField(bundleResult.handle || ''),
      bundlePrice: useField(bundleResult.price || ''),
      description: useField(bundleResult.bodyHtml || ''),
      customer: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.conditions.customer : ''),
      minPurchasableItems: useField(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.conditions.minPurchasableItem : '')
    },
    dynamicLists: {
      expandedCartItems: useDynamicList(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.expandedCartItems : [], emptyExpandedCartItemsFactory),
      globalPriceRules: useDynamicList(bundleResult.metafield?.value ? JSON.parse(bundleResult.metafield?.value).expand.globalPriceRules : defaultGlobalPriceRules, emptyGlobalPriceRulesFactory)
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
      if (!data.globalPriceRules[0].value) {
        remoteErrors.push("Discount value is mandatory");
      }

      if (remoteErrors.length) {
        setIsFormSubmitting(false);
        return { status: "fail", errors: remoteErrors };
      } else {
       submitForm({ 
        bundleData: JSON.stringify(data),
        cartItemsMedia: JSON.stringify(cartItemsMedia),
        removableCartItems: JSON.stringify(removableCartItems)
      }, { method: "post" });
      setTimeout(async() => {
        setShowToast(true);
      }, 2000)
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
    console.log('bundleHandle', bundleHandle.value);
    console.log('meta', meta);
    if(bundleHandle.value == meta.value) {
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
      {errorBanner}
        <Layout.Section>
          <BlockStack gap="300">
            {/* {removableCartItems.toString()} <br />             */}
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
              onSetRemovableCartItems={onSetRemovableCartItems}
              cartItemsMedia={cartItemsMedia}
              setCartItemsMedia={setCartItemsMedia}              
            />
            <BundleDiscountInfo
              globalPriceRules={globalPriceRules}
              onAddGlobalPriceRules={addGlobalPriceRules}
              onRemoveGlobalPriceRules={removeGlobalPriceRules}
              onMoveGlobalPriceRules={moveGlobalPriceRules}
              bundlePrice={bundlePrice}
              cartItems={cartItems}
              cartItemsMedia={cartItemsMedia}
            />
            {/* <Customize /> */}
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Preview
            bundleName={bundleName}
            bundlePrice={bundlePrice}
            description={description}
            cartItems={cartItems}
            cartItemsMedia={cartItemsMedia}
            globalPriceRules={globalPriceRules}
            currencyCodes={shopData}
          />
        </Layout.Section>
      </Layout>
      {showToast && 
         shopify.toast.show("Bundle product created successfully!", {onDismiss: () => setShowToast(false)})
        }
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
