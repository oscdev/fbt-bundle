import { useState, useEffect } from "react";
import { Page, Layout, Card, BlockStack, Text, Button, Badge, InlineStack, InlineGrid, Banner, ButtonGroup } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import logo from "../assets/images/oscLogo.png";
import { ExternalIcon } from "@shopify/polaris-icons";
import { settings } from "../services/settings";
import { useLoaderData, json, useNavigate, useSubmit } from "@remix-run/react";
import FBT from "../assets/images/fbt.jpg";
import Bundle from "../assets/images/bundle.jpg";

// get loader data for app settings and theme settings (Enable/Disable) 
async function getLoaderData(request) {
  const { admin, session } = await authenticate.admin(request);
  const [appStatus, themeStatus, shopName] = await Promise.all([
    await settings.getAppStatus(admin),
    await settings.getThemeStatus(admin, session),
    await settings.shopDetail(admin)
  ])
  return {
    appStatus,
    themeStatus,
    shopUrl: admin.rest.session.shop || '',
    shopName
  };
}

// get loader data for app settings and theme settings (Enable/Disable)
export const loader = async ({ request }) => {
  console.log('Before data fetch', new Date());
  const appSettingsData = await getLoaderData(request);
  console.log('After data fetch', new Date());
  return json(appSettingsData);
};

// set app status (Enable/Disable)
export const action = async ({ request }) => {
  const formData = await request.formData();
  const {
    appStatus
  } = JSON.parse(formData.get("settingsData"));
  const { admin } = await authenticate.admin(request);
  const [status] = await Promise.all([
    await settings.setAppStatus(admin, (appStatus) ? '0' : '1')
  ]);
  return json({ status });
};
export default function Index() {
  const submitForm = useSubmit();
  const navigate = useNavigate();
  const [appSettings, setAppSettings] = useState({
    appStatus: true,
    themeStatus: null
  });
  const settingsData = useLoaderData();
  useEffect(() => {
    setAppSettings(settingsData)
  }, [settingsData]);

  // handle save button
  const handleSave = async () => {
    submitForm({ settingsData: JSON.stringify(appSettings) }, { method: "post" });
  }

  const buttonText =
    appSettings?.appStatus === true
      ? "Disable"
      : "Enable";

  const badgeContent =
    appSettings?.appStatus === true
      ? "ON"
      : "OFF";

  const badgeColor =
    appSettings?.appStatus === true
      ? "success"
      : "attention";

  // redirect chat button on click
  // const handleClick = () => {
  //   window.tidioChatApi.open();
  // };

  function handleFBTRedirection() {
    window.open(`https://${settingsData?.shopUrl}/admin/products`, "_parent");
  }

  return (
    <Page title={'Hi' + (settingsData?.shopName?.name ? ', ' + settingsData?.shopName?.name + ' ' : ' ') + '👋'}>
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
                      Oscp Upsell & Cross Sell <Badge tone={badgeColor}>{badgeContent}</Badge>
                    </Text>
                  </InlineStack>
                  <div>
                    <Button onClick={handleSave}>{buttonText}</Button>
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
          {(settingsData.themeStatus?.blocks[0]?.is_configured === true) && (settingsData.themeStatus?.embedBlock?.is_disabled === false) ? "" : (
            <Layout.Section>
              <Banner
                title={'Activate our app on your theme'}
                tone="warning"
              >
                <BlockStack gap="200">
                  <Text variant="bodyLg" as="p">
                    Our application Grid is not configured in your theme. It is required to be enabled to start storefront integration.</Text>
                  <Text variant="bodyLg" as="p" alignment="end"><Button url="/app/theme-setup" variant="primary">Activate App</Button></Text>
                </BlockStack>
              </Banner>
            </Layout.Section>
          )}
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
                    <img src={FBT} alt="fbt" height="300" width="300" loading="lazy"/>
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
                    <img src={Bundle} alt="fbt bundle" height="300" width="300" loading="lazy"/></Text>
                </BlockStack>
              </Card>
            </InlineGrid>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}