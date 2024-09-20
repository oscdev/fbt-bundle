import { useState, useEffect } from "react";
import { Page, Layout, Card, BlockStack, Text, Button, Badge, Spinner, InlineStack, InlineGrid, Banner, ButtonGroup, Checkbox, LegacyCard, SkeletonThumbnail, SkeletonBodyText, } from "@shopify/polaris";
import { authenticate } from "~/shopify.server";
import logo from "../assets/images/oscLogo.png";
import indexStyles from "../assets/index.css";
// import { Redirect } from "@shopify/app-bridge/actions";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ExternalIcon, ChatIcon } from "@shopify/polaris-icons";
import { cnf } from "../../cnf.js";
import { settings } from "../services/settings";
import { useSubmit } from "@remix-run/react";
import { useLoaderData, json, useNavigation } from "@remix-run/react";
import { Footer } from "../components/Footer.jsx";
import support from "../assets/images/support.png";

export const links = () => [{ rel: "stylesheet", href: indexStyles }];

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
  const app = useAppBridge();
  // const redirect = Redirect.create(app);
  const navigation = useNavigation();
  const [appSettings, setAppSettings] = useState({
    appStatus: false,
    themeStatus: null
  });
  const settingsData = useLoaderData();
  console.log("settingsData", settingsData);
  const liveThemeId = settingsData.themeStatus.activeTheme.id;

  useEffect(() => {
    setAppSettings(settingsData)
  }, [settingsData]);

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

  // redirect product block widget settings
  // const redirectProductBlock = () => {
  //   redirect.dispatch(Redirect.Action.ADMIN_PATH, {
  //     path: '/themes/' + liveThemeId + '/editor?template=product&addAppBlockId=' + cnf.UUID + '/frequently&target=mainSection',
  //     newContext: true,
  //   });
  // }

  // redirect app embed settings
  // const redirectAppEmbed = () => {
  //   redirect.dispatch(Redirect.Action.ADMIN_PATH, {
  //     path:
  //       "/themes/" +
  //       liveThemeId +
  //       "/editor?context=apps&template=index&activateAppId=" + cnf.UUID + "/app-embed",
  //     newContext: true,
  //   });
  // };

  // redirect chat button on click
  const handleClick = () => {
    window.tidioChatApi.open();
  };

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            {/* App Enable/Disable section */}
            <Card sectioned>
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <div className="customTitle">
                    <img alt="OSCP Wholesale Logo" width="65px" src={logo} style={{ marginRight: '10px' }} />
                    <Text variant="headingLg" as="h5">
                      Oscp Upsell & Cross Sell <Badge tone={badgeColor}>{badgeContent}</Badge>
                    </Text>
                  </div>
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
                  <ButtonGroup><Button onClick={handleClick} icon={ChatIcon}>Chat with us</Button></ButtonGroup>
                </BlockStack>
                <img
                  alt="Theme Setup"
                  src={support}
                />
              </InlineGrid>
            </Card>
          </Layout.Section>
          <Layout.Section>
            {/* App Embeds section */}
            <InlineGrid gap="400" columns={2}>
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text variant="headingMd" as="h6" fontWeight="bold">
                      App Embeds
                    </Text>
                    {settingsData.themeStatus.embedBlock.is_disabled === true ?
                      <Button icon={ExternalIcon}  url={"https://" + settingsData.shopUrl + "/themes/"+liveThemeId+"/editor?context=apps&template=index&activateAppId="+ cnf.UUID + "/app-embed"}>Enable</Button> : <Button icon={ExternalIcon} onClick={redirectAppEmbed}>View</Button>}
                  </InlineGrid>
                  {settingsData.themeStatus.embedBlock.is_disabled === true ? <Text variant="bodyLg" as="p" fontWeight="semibold" tone="critical">
                    The App is disabled.
                  </Text>
                    :
                    <Text variant="bodyLg" as="p" fontWeight="semibold" tone="success">
                      The App is enabled.
                    </Text>}
                  <Text variant="bodyMd" as="p">
                    You need to enable the app embed to display our widget on your store.
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Click the button to open a new window with the app embed settings. Just click Save.</Text>
                </BlockStack>
              </Card>
              {/* Product Widget section */}
              <Card roundedAbove="sm">
                <BlockStack gap="200">
                  <InlineGrid columns="1fr auto">
                    <Text variant="headingMd" as="h6" fontWeight="bold">
                      Product Widget
                    </Text>
                    <Button icon={ExternalIcon} disabled={settingsData.themeStatus.blocks[0].is_configured === true} 
                    url={"https://" + settingsData.shopUrl + "/themes/"+liveThemeId+"/editor?template=product&addAppBlockId="+ cnf.UUID + "/app-block&target=mainSection"}>{(
                      settingsData.themeStatus.blocks.length !== 0
                        ? (settingsData.themeStatus.blocks[0].is_configured === true ? "App block Enabled" : "Enable App block")
                        : "Theme not Supported"
                    )}
                    </Button>
                  </InlineGrid>
                  {settingsData.themeStatus.blocks.length !== 0 ? (
                    settingsData.themeStatus.blocks[0].is_configured === true ? (
                      <Text variant="bodyLg" as="p" fontWeight="semibold" tone="success">
                        The Frequently Bought Together Widget is enabled.
                      </Text>
                    ) : (
                      <Text variant="bodyLg" as="p" fontWeight="semibold" tone="critical">
                        The Frequently Bought Together Widget is disabled.
                      </Text>
                    )
                  ) : (
                    <Banner status="critical">
                      <Text variant="bodyLg" as="p">
                        This Theme <i><u>{settingsData.themeStatus.activeTheme.name}</u></i> is NOT Supported. {' '}
                      </Text>
                    </Banner>
                  )}
                  <Text variant="bodyMd" as="p">
                    Enable the widget in your theme for the "Frequently Bought Together" section to function on your product page.</Text>
                </BlockStack>
              </Card>
            </InlineGrid>
          </Layout.Section>
          {/* -------------------------- */}

          <Layout.Section>
            {/* App Embeds section */}
            <InlineGrid gap="400" columns={2}>
              <LegacyCard title="Frequently Bought Together">
                <LegacyCard.Section >
                  <Card>
                    <BlockStack gap="200">
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          <Checkbox
                            label=""
                            checked={true}
                          />
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Text variant="bodyMd" alignment='center' as="h3"> + </Text>
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          <Checkbox
                            label=""
                            checked={true}
                          />
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Text variant="bodyMd" alignment='center' as="h3"> + </Text>
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          <Checkbox
                            label=""
                            checked={true}
                          />
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Button disabled>Add to cart</Button>
                    </BlockStack>
                  </Card>
                </LegacyCard.Section>
              </LegacyCard>
              {/* Product Widget section */}
              <LegacyCard title="Simple Bundle">
                <LegacyCard.Section>
                <BlockStack gap="200">
                  <Text variant="bodyMd" as="p">
                    Bundle multiple products that frequently bought together with 1-click and set discount for the bundle
  <Text variant="bodyMd" as="h3">Example: Buy bundle product (A,B,C) will get discount 10%
                    </Text></Text>
                  <Card>
                    <BlockStack gap="200">
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          {/* <Checkbox
                            label=""
                            checked={true}
                          /> */}
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Text variant="bodyMd" alignment='center' as="h3">--------------------------- + ------------------------------</Text>
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          {/* <Checkbox
                            label=""
                            checked={true}
                          /> */}
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Text variant="bodyMd" alignment='center' as="h3">--------------------------- + ------------------------------</Text>
                      <Card>
                        <InlineStack align="start" wrap={false} gap="300">
                          {/* <Checkbox
                            label=""
                            checked={true}
                          /> */}
                          <SkeletonThumbnail size="small" />
                          <SkeletonBodyText lines={2} />
                        </InlineStack>
                      </Card>
                      <Button disabled>Add to cart</Button>
                    </BlockStack>
                  </Card>
                  </BlockStack>
                </LegacyCard.Section>
              </LegacyCard>
            </InlineGrid>
          </Layout.Section>
        </Layout>
      </BlockStack>
      <Footer />
    </Page>
  );
}
