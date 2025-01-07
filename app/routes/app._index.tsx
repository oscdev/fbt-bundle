import { useState, useEffect } from "react";
import { Page, Layout, Card, BlockStack, Text, Button, Badge, InlineStack, InlineGrid, Banner, ButtonGroup } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import logo from "../assets/images/oscLogo.png";
import { ExternalIcon } from "@shopify/polaris-icons";
import { settings } from "../services/settings";
import { useLoaderData, json, useNavigate, useSubmit } from "@remix-run/react";
import FBT from "../assets/images/fbt.jpg";
import Bundle from "../assets/images/bundle.jpg";
import { ThemeAlert } from "../components/Dashboard/index";

export const loader = async ({ request }) => {
  //const { session } = await authenticate.admin(request);
  //console.log("Home page session -----", session);
  return json({});
};

// set app status (Enable/Disable)
export const action = async ({ request }) => {
  const formData = await request.formData();
  const {
    appStatus
  } = JSON.parse(formData.get("settingsData"));

  const { admin } = await authenticate.admin(request);
  const [status] = await Promise.all([
    await settings.setAppStatus(admin, (appStatus == "true") ? '0' : '1')
  ]);
  return json({ status });
};
export default function Index() {
  const submitForm = useSubmit();
  const navigate = useNavigate();
  const [loadCount, setLoadCount] = useState(0)
  const [homeData, setHomeData] = useState({})
  //const { session } = useLoaderData();

  async function loadHomeData() {
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify({
        query: `query {
            currentAppInstallation{
              id
              metafield(namespace: "app_settings", key: "app_enabled") {
                value
              }
            }
            shop {
              name
              currencyCode
              currencyFormats {
                moneyInEmailsFormat
                moneyWithCurrencyInEmailsFormat
              }
            }
          }`,
      }),
    });

    const { data } = await res.json();
    setHomeData(data)
  }

  useEffect(() => {
    loadHomeData();
  }, [loadCount]);


  // handle save button
  const handleSave = async () => {
    submitForm({
      settingsData: JSON.stringify({
        appStatus: homeData?.currentAppInstallation?.metafield?.value,
      })
    }, { method: "post" });
    setTimeout(() => {
      setLoadCount(loadCount + 1)
    }, 1000)
  }

  async function handleFBTRedirection() {
    const filterObj = [];
    //filterObj.push("NOT metafields.oscp.fbtSearchable:searchable");
    const pickedResource = await window.shopify.resourcePicker({
      type: 'product',
      action: "add",
      multiple: true,
      filter: {
        query: filterObj.join(" AND "),
        variants: false,
      },
    });

    const ids = pickedResource.map((item) => {return "ids[]="+item.id.split("/").pop()});
    console.log("ids", ids.join("&"));
    navigate(`/app/bulkform?${ids.join("&")}`);
    //window.open(`https://${session.shop}/admin/products`, "_parent");
  }

  return (
    <Page title={'Hi' + (homeData?.shop?.name ? ', ' + homeData?.shop?.name + ' ' : ' ') + '👋'}>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            {/* App Enable/Disable section */}
            <Card>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <InlineStack blockAlign="center">
                    <img alt="OSCP Wholesale Logo" width="65px" src={logo} style={{ marginRight: '10px' }} />
                    <Text variant="headingLg" as="h5">
                      OSCP Bundle & Upsell 
                      {(homeData?.currentAppInstallation?.metafield?.value == "true") ? <Badge tone="success">ON</Badge> : <Badge tone="attention">OFF</Badge>}

                    </Text>
                  </InlineStack>
                  <div>
                    <Button onClick={handleSave}>{((homeData?.currentAppInstallation?.metafield?.value == "true")) ? 'Disable' : 'Enable'}</Button>
                  </div>
                </InlineGrid>
              </BlockStack>
            </Card>
          </Layout.Section>
          {/* Free assistance section */}
          {/* <Layout.Section>
            <Card>
              <InlineGrid columns="1fr auto">
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h6" fontWeight="bold">
                    Free assistance
                  </Text>
                  <Text variant="bodyLg" as="p">
                    If you need support with any features or setup, please reach out to our support team.</Text>
                  <ButtonGroup>
                  <Button variant="primary" target="_blank" url="https://www.oscprofessionals.com/upsell-cross-sell-app-user-guide/">Get Started</Button>
                    <Button variant="primary" onClick={handleClick} icon={ChatIcon}>Chat with us</Button>
                  </ButtonGroup>
                </BlockStack>
                <img
                  alt="Theme Setup"
                  src={support}
                />
              </InlineGrid>
            </Card>
          </Layout.Section> */}

          <ThemeAlert />

          <Layout.Section>
            <InlineGrid gap="400" columns={2}>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text variant="headingMd" as="h6" fontWeight="bold">Frequently Bought Together</Text>
                    <Button variant="primary" onClick={handleFBTRedirection} icon={ExternalIcon}>
                      Create FBT
                    </Button>
                  </InlineGrid>
                  <Text variant="headingMd" as="h6" alignment="center">
                    <img src={FBT} alt="fbt" height="300" width="300" loading="lazy" />
                  </Text>
                </BlockStack>
              </Card>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text variant="headingMd" as="h6" fontWeight="bold">FBT Bundle</Text>
                    <Button variant="primary" onClick={() => navigate("/app/bundle/new")} icon={ExternalIcon}>Create FBT Bundle</Button>
                  </InlineGrid>
                  <Text variant="headingMd" as="h6" alignment="center">
                    <img src={Bundle} alt="fbt bundle" height="300" width="300" loading="lazy" /></Text>
                </BlockStack>
              </Card>
            </InlineGrid>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}