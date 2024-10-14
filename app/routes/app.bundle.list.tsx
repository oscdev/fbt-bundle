import { Layout, Page, Button } from "@shopify/polaris";
import { BundleProductList } from "../components/Bundle/index";
import { useEffect, useState } from "react";
import { json} from "@remix-run/node";
import { useLoaderData} from "@remix-run/react";
import { PlusIcon } from '@shopify/polaris-icons';
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
      backAction={{ content: "Settings", url: "/app/bundle/list" }}
      primaryAction={
        <Button icon={PlusIcon} variant="primary" url= "/app/bundle/new">Create Bundle</Button>
      }
    >      
      <Layout>
        <Layout.Section>
            <BundleProductList productList={bundleProductList} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
