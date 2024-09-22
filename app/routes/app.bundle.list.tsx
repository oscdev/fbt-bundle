import { Layout, Page, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { BundleInfo } from "../components/Bundle/index";

import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit , useNavigate} from "@remix-run/react";

import { bundle } from "../services/index";


export const loader = async ({ params, request }) => {
    const bundleList = await bundle.getProducts(request); 
  return json({bundleList});
};


export default function BundleList() {
  const bundleResult = useLoaderData();
  
  return (
    <Page
      title="Bundle List"      
      backAction={{ content: "Settings", onAction: () => { } }}
    >
      <TitleBar title="Additional page" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="300">
            List
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
