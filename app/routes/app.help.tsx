import { List, BlockStack, Button, Card, Image, Box, InlineGrid, Page, Text, ButtonGroup } from "@shopify/polaris";
import { EmailIcon, ExternalIcon, PersonFilledIcon, StarFilledIcon } from "@shopify/polaris-icons";
import logo from "../assets/images/oscLogo.png";
import support from "../assets/images/support.png";
import { settings } from "../services/index.js";
import { useLoaderData, json } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";

  // get loader data for app settings and theme settings (Enable/Disable)
  export const loader = async ({ request }) => {
    //const appSettingsData = await getLoaderData(request);
    const { admin } = await authenticate.admin(request);
    const zoomMeet = process.env.ZOOM_MEET_KEY;
    const appName = process.env.APPNAME;
    const siteUrl = process.env.SITEURL;
    return json({ zoomMeet,appName, siteUrl, shopUrl: admin.rest.session.shop || ''});
  };
// help component
export default function Help() {
  const settingsData = useLoaderData();
  // redirects to shopify app store for app installation
  function wholesaleRedirect() {
    window.open("https://apps.shopify.com/custom-pricing-wholesale/", "_blank");
  }
  function upsellRedirect() {
    window.open("https://apps.shopify.com/oscp-sales-volume-discount/", "_blank");
  }
  const redirectZoomMeetings = () => {
    window.open("https://calendar.app.google/" + settingsData.zoomMeet + "", "_blank");
  }

  return (
    <Page
      title="Help"
      narrowWidth={false}
      backAction={{ content: "Settings", url: "/app" }}
    >
      <BlockStack gap="500">
        <Card roundedAbove="sm">

          <InlineGrid columns="1fr auto">

            <div className="support_text">
              <BlockStack gap="300">
                <Text variant="headingMd" as="h2"> For assistance, please reach out to our support team.
                </Text>
                <Text variant="bodyMd" as="span"> Schedule a Meeting to assist with the setup process, discount configurations, widget customizations, or any other concerns.</Text>
              </BlockStack>
              <Box padding='400' style={{ marginTop: '10px' }}>
                <a style={{ textDecoration: 'none' }} target='blank'><Button onClick={redirectZoomMeetings}> Schedule a Meeting with Us </Button></a>
              </Box>
            </div>

            <div className="support_img" style={{ width: '100px', height: '100px' }}>
              <Image
                source={support}
                alt="support_img"
                width="100%"
                height="100%"
              />
            </div>

          </InlineGrid>

        </Card>
        {/* contact us section */}
        <Card roundedAbove="sm">
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">Contact our support team</Text>
            <a style={{ textDecoration: 'none' }} target='blank' href='mailto:apps@oscprofessionals.com'><Button icon={EmailIcon} variant="plain">Email Us</Button></a>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">We can answer your queries and assist with customizing the app to suit your theme.</Text>
          </InlineGrid>
        </Card>
        <Card roundedAbove="sm">
          {/* user guide section */}
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">Check the user guide</Text>
            <a style={{ textDecoration: 'none' }} target='blank' href={`${settingsData.siteUrl}/upsell-cross-sell-app-user-guide/`}><Button variant="plain" icon={PersonFilledIcon}>User Guide</Button></a>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">Our user guide has step by step instructions on how to setup and use the app.</Text>
          </InlineGrid>
        </Card>
        <Card roundedAbove="sm">
          {/* faq section */}
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">Check the FAQs</Text>
            <a style={{ textDecoration: 'none' }} target='blank' href={`${settingsData.siteUrl}/oscp-upsell-cross-sell-app#oscp-upsell-cross-sell-faq`}><Button variant="plain" icon={ExternalIcon}>FAQs</Button></a>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">Check out our FAQ section for detailed answers about app functionalities and compatibility.</Text>
          </InlineGrid>
        </Card>
        <Card roundedAbove="sm">
          <BlockStack gap="400">
            <InlineGrid columns="auto 1fr" alignItems="center">
              <div className="support_img" style={{ width: '24px', height: '24px', marginRight: '8px' }}>
                <Image
                  source={support}
                  alt="support_img"
                  width="100%"
                  height="100%"
                />
              </div>
              {/* <Icon source={ChatReferralIcon} tone="base" /> */}
              <Text variant="headingMd" as="h2"> Contact the support team </Text>
            </InlineGrid>

            <Text variant="bodyMd" as="h2"> To Send useful information to the support team and solve your issue as soon as possible,please follow these instructions:</Text>
            <List type="number">
              <List.Item> <Button variant="plain" url={'https://${settingsData.appSettingsData.shopUrl}/admin/settings/apps/app_installations/app/${settingsData.appName}'}>Click Here</Button> to Open the OSCP Upsell & Cross Sell application in Settings </List.Item>
              <List.Item>Scroll to the bottom of the Page, and click the <b>Share logs</b> button</List.Item>
              <List.Item>After sharing the logs with us,send us a message through the bubble in the buttom-right of the screen and tell us about your issue</List.Item>
            </List>
          </BlockStack>
        </Card>
        <Card roundedAbove="sm">
        <InlineGrid columns="1fr auto">
                <BlockStack gap="300">
                  <Text variant="headingMd" as="h6" fontWeight="bold">
                    Feedback
                  </Text>
                  <Text variant="bodyLg" as="p">
                    Your feedback is valuable to us! Please share your experience using the OSCP Upsell & Cross Sell App.</Text>
                  <ButtonGroup><Button target="_blank" url="https://apps.shopify.com/oscp-upsell-cross-sell-1#modal-show=ReviewListingModal">Share Feedback</Button></ButtonGroup>
                </BlockStack>
              </InlineGrid>
        </Card>
        {/* apps section for other apps */}
        <Text variant="headingMd" as="h2">Try our other apps</Text>
        <InlineGrid gap="400" columns={2}>
          <Card roundedAbove="sm">
            <Box padding="400" borderRadius="100">
              <BlockStack gap="200">
                <InlineGrid columns="1fr auto">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img alt="OSCP Wholesale Logo" width="50px" src={logo} style={{ marginRight: '10px' }} />
                    <Text variant="headingMd" as="h2">OSCP Wholesale</Text>
                  </div>
                  <Button variant="plain" onClick={wholesaleRedirect} icon={ExternalIcon}>
                    View App
                  </Button>
                </InlineGrid>

                <Text variant="bodySm" as="span">
                  <Button variant="plain" icon={StarFilledIcon}>3.8 (8 Reviews)</Button>
                </Text>
                <Text variant="bodyMd" as="span">
                  Create Wholesale pricing based on Collections, Products, and their variants using Customer Tags.
                </Text>
              </BlockStack>
            </Box>
          </Card>
          <Card roundedAbove="sm">
            <Box padding="400" borderRadius="100">
              <BlockStack gap="400">
                <InlineGrid columns="1fr auto">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img alt="OSCP Wholesale Logo" width="50px" src={logo} style={{ marginRight: '10px' }} />
                    <Text variant="headingMd" as="h2">OSCP Sales & Volume Discount</Text>
                  </div>
                  <Button variant="plain" onClick={upsellRedirect} icon={ExternalIcon}>View App</Button>
                </InlineGrid>
                <Text variant="bodySm" as="span">
                  <Button variant="plain" icon={StarFilledIcon}>5 (1 Review)</Button>
                </Text>
                <Text variant="bodyMd" as="span">
                  Enhance sales with volume discounts and tiered discounts.
                </Text>
              </BlockStack>
            </Box>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>

  );
}
