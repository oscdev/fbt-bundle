import { Layout, Page, Button } from "@shopify/polaris";
import { BundleProductList } from "../components/Bundle/index";
import { useEffect, useState } from "react";
import { json} from "@remix-run/node";
import { PlusIcon } from '@shopify/polaris-icons';
import { QL } from "~/helpers/graph-ql";

export const loader = async ({ params, request }) => {
  //const bundleList = await bundle.getProducts(request);
  //return json(bundleList);
  return json({});
};

export default function BundleList() {
  //const bundleResult = useLoaderData();
  const [bundleProductList, setBundleProductList] = useState([]);

  /*** */
  async function loadBundleLists() {
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify({
        query: QL.GET_BUNDLES_MUTATION,
      }),
    });
    const { data } = await res.json();    
    setBundleProductList(data.products.edges)
  }

  useEffect(() => {    
    loadBundleLists();
  }, []);
  /*** */

  return (
    <Page
      title="Bundle List"
      backAction={{ content: "Settings", url: "/app" }}
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
