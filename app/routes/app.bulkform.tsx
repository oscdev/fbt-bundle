import { useState, useCallback, useEffect, useMemo } from "react";
import { Page, BlockStack, Layout } from "@shopify/polaris";
import { useLoaderData, useNavigation, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";
import { bulkProduct } from "../services/index";
import { useSubmit } from "@remix-run/react";
import { QL } from "~/helpers/graph-ql";
import { useField, useDynamicList, useForm } from '@shopify/react-form';

import { FbtResource } from "../components/Fbt/index";

export const loader = async ({ request }) => {
  let url = new URL(request.url);
  let ids = new URLSearchParams(url.search).getAll("ids[]");
  return json({ ids });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) || [];

  //console.log("data", data);
  //return json({});
  const stageStatus = await bulkProduct.bulkFormOperation(data.fbtItems, request);
  return json({ stageStatus });
};

const Bulkform = () => {
  const submitForm = useSubmit();
  const { ids } = useLoaderData();
  const [fbt, setFbt] = useState([]);
  const [productsMedia, setProductsMedia] = useState([]);
  const [loadCount, setLoadCount] = useState(0)

  const emptyFbtItemsFactory = (formArg) => ({
    id: formArg.id,
    title: formArg.title,
    handle: formArg.handle,
    crossProducts: formArg.crossProducts
  });

  const {
    submit,
    reset,
    submitting,
    dirty,
    dynamicLists,
  } = useForm({
    dynamicLists: {
      fbtItems: useDynamicList(useMemo(() => { return fbt; }, [fbt]), emptyFbtItemsFactory)
    },
    onSubmit: async (data) => {
      for (let i = 0; i < data.fbtItems.length; i++) {
        data.fbtItems[i].crossProducts = JSON.parse(data.fbtItems[i].crossProducts);
      }
      submitForm({
        fbtItems: JSON.stringify(data.fbtItems)
      }, { method: "post" });        
      return { status: "success" };
    }
  });

  const {
    fbtItems: {
      addItem: addItems,
      editItem: editItems,
      removeItem: removeItems,
      moveItem: moveItems,
      fields: fbtItems,
    }
  } = dynamicLists;


  async function loadFBTData() {
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify({
        query: QL.FBT_PRODUCTS.replace("$ids", "id:" + ids.join(" OR id:")),
      }),
    });
    const { data } = await res.json();    
    const jsonData = data.products.edges.map(item => {
      const node = item.node;
      const relatedProducts = {
        id: node.id,
        title: node.title,
        handle: node.handle,
        crossProducts: (node.metafield && node.metafield.value) ? JSON.stringify(JSON.parse(node.metafield.value).crossProducts) : "[]"
      };      
      return relatedProducts;
    });

    //setFbt([{ id: 123, title: "test", crossProducts: [] }, { id: 456, title: "test", crossProducts: [] }]);

    console.log("jsonData", JSON.stringify(jsonData));
    setFbt(jsonData);

  }
  useEffect(() => {
    loadFBTData();
  }, [loadCount]);

  /****      */

  ////////////
  async function getProductsMedia() { 
    if(!fbtItems.length) return; 
    const productsId = []; 
    //const productsId = fbtItems.map((item) => item.id.value).join(",");
    for (let i = 0; i < fbtItems.length; i++) {
      productsId.push(fbtItems[i].id.value.split("/").pop());
      const crossProducts = JSON.parse(fbtItems[i].crossProducts.value);
      console.log("crossProducts", crossProducts);
      if(crossProducts.length){
        for (let j = 0; j < crossProducts.length; j++) {
          productsId.push(crossProducts[j].id);
        }
      }      
    }
    
    const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify({
            query: `query {
                products(first: 250, query: "id:${productsId.join(" OR id:")}") {
                    edges {
                    node {
                        mediaItemId: id
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

    console.log("data", JSON.stringify(data.products.edges));
    setProductsMedia(data.products.edges);
}

useEffect(() => {
  getProductsMedia();
}, [fbtItems]);
  ////////////

  return (
    <Page
      title="Frequently Bought Together"
      primaryAction={{
        content: "Save",
        disabled: !dirty,
        loading: false,
        onAction: () => {
          submit()
        }
      }}
      backAction={{ content: "Settings", onAction: () => confirmExit() }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="200">
            {
              fbtItems.map(
                ({ id, title, crossProducts }, index) => (
                  <>
                    <FbtResource
                      productId={id}
                      productTitle={title}
                      crossProducts={crossProducts}
                      productsMedia={productsMedia}
                    />
                  </>
                )
              )
            }
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Bulkform;
