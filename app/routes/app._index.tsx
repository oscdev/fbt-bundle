import { useState, useEffect } from "react";
import { Page, Layout, Card, BlockStack, Text, Button, Badge, Spinner, InlineStack, InlineGrid, Banner, ButtonGroup, Checkbox, LegacyCard, SkeletonThumbnail, SkeletonBodyText,Box } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import logo from "../assets/images/oscLogo.png";
import { ExternalIcon, ChatIcon } from "@shopify/polaris-icons";
// import { cnf } from "../../cnf.js";
import { settings } from "../services/settings";
import { useLoaderData, json, useNavigation,useNavigate, useSubmit } from "@remix-run/react";
import { Footer } from "../components/Footer.jsx";
import support from "../assets/images/support.png";
import FBT from "../assets/images/fbt.jpg";

// get loader data for app settings and theme settings (Enable/Disable) 
async function getLoaderData(request) {
  const { admin } = await authenticate.admin(request);
  const [appStatus, themeStatus] = await Promise.all([
    await settings.getAppStatus(request),
    await settings.getThemeStatus(request)
  ])
  return {
    appStatus,
    themeStatus,
    shopUrl: admin.rest.session.shop || ''
  };
}

// get loader data for app settings and theme settings (Enable/Disable)
export const loader = async ({ request }) => {
  const appSettingsData = await getLoaderData(request);
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
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [appSettings, setAppSettings] = useState({
    appStatus: false,
    themeStatus: null
  });
  const settingsData = useLoaderData();

  useEffect(() => {
    setAppSettings(settingsData)
  }, [settingsData]);

  const productBlock = settingsData.themeStatus.blocks.find(
    (block) => block.key === "templates/product.json",
  );

  // handle save button
  const handleSave = async () => {
    submitForm({ settingsData: JSON.stringify(appSettings) }, { method: "post" });
  }

  const buttonText =
    appSettings.appStatus === true
      ? "Disable"
      : "Enable";

  const badgeContent =
    appSettings.appStatus === true
      ? "ON"
      : "OFF";

  const badgeColor =
    appSettings.appStatus === true
      ? "success"
      : "attention";

      const liveThemeId = settingsData.themeStatus.activeTheme.id;
  // redirect chat button on click
  const handleClick = () => {
    window.tidioChatApi.open();
  };

  return (
    <Page title="Hi, Welcome to OSCP Upsell & Cross Sell App">
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
                    <Button onClick={handleSave} icon={(navigation.state === "loading") ? <Spinner size="small" /> : <></>}>{buttonText}</Button>
                  </div>
                </InlineGrid>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section>
            {/* Free assistance section */}
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
          </Layout.Section>
          {((!settingsData.themeStatus.embedBlock.is_configured) || (!productBlock.is_configured)) && (
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
                    <Button variant="primary" onClick={() => navigate("/app/bundle/new")} icon={ExternalIcon}>Create FBT</Button>
                  </InlineGrid>
                   <Text  variant="headingMd" as="h6" alignment="center"><img src={FBT} alt="Theme Setup" width="300px" /></Text> 
                    </BlockStack>
                </Card>
                <Card roundedAbove="sm">
                    <BlockStack gap="200">
                    <InlineGrid columns="1fr auto">
                    <Text variant="headingMd" as="h6" fontWeight="bold">Simple Bundle</Text>
                    <Button variant="primary" onClick={() => navigate("/app/bundle/new")} icon={ExternalIcon}>Create FBT Bundle</Button>
                  </InlineGrid>
                  <Text  variant="headingMd" as="h6" alignment="center"><img src={FBT} alt="Theme Setup" width="300px" /></Text>   
                    </BlockStack>
                </Card>
            </InlineGrid>
        </Layout.Section>
        </Layout>
      </BlockStack>
      <Footer />
    </Page>
  );
}
