import { Layout, Page, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { BundleProductList } from "../components/Bundle/index";
import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigate } from "@remix-run/react";

import { bundle } from "../services/index";


export const loader = async ({ params, request }) => {
  const bundleList = await bundle.getProducts(request);
  return json(bundleList);
};


export default function BundleList() {
  const bundleResult = useLoaderData();
  const [bundleProductList, setBundleProductList] = useState([]);

  useEffect(() => {
    setBundleProductList(bundleResult);
  }, [bundleResult])



  return (
    <Page
      title="Bundle List"
      backAction={{ content: "Settings", url: "/app" }}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            <BundleProductList productList={bundleProductList} />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
