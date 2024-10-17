import { Banner, BlockStack, Button, Card, Icon, Box, InlineGrid, Page, Text } from "@shopify/polaris";
import { EmailIcon, ExternalIcon, InfoIcon, PersonFilledIcon, QuestionCircleIcon, StarFilledIcon } from "@shopify/polaris-icons";
import logo from "../assets/images/logo.jpg";
import { useNavigate } from "@remix-run/react";

// help component
export default function Help() {
  const navigate = useNavigate();
  // redirects to shopify app store for app installation
  function wholesaleRedirect() {
    window.open("https://apps.shopify.com/custom-pricing-wholesale/", "_blank");
  }
  function upsellRedirect() {
    window.open("https://apps.shopify.com/oscp-sales-volume-discount/", "_blank");
  }


  return (
    <Page
      title="Help"
      narrowWidth={false}
      backAction={{ content: "Settings", url: "/app" }}
    >
      <BlockStack gap="500">
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
            <Text variant="headingMd" as="h2">User guide</Text>
            <a style={{ textDecoration: 'none' }} target='blank' href={'https://www.oscprofessionals.com/upsell-cross-sell-app-user-guide/'}><Button variant="plain" icon={PersonFilledIcon}>User Guide</Button></a>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">Our user guide has step by step instructions on how to setup and use the app.</Text>
          </InlineGrid>
        </Card>
        <Card roundedAbove="sm">
          {/* faq section */}
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">FAQs</Text>
            <a style={{ textDecoration: 'none' }} target='blank' href={'https://www.oscprofessionals.com/oscp-upsell-cross-sell-app#oscp-upsell-cross-sell-faq'}><Button variant="plain" icon={ExternalIcon}>FAQs</Button></a>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">Check out our FAQ section for detailed answers about app functionalities and compatibility.</Text>
          </InlineGrid>
        </Card>
        <Card roundedAbove="sm">
          {/* Settings section */}
          <InlineGrid columns="1fr auto">
            <Text variant="headingMd" as="h2">App Settings</Text>
            <Button onClick={() => navigate("/app/theme-setup")} variant="plain" icon={ExternalIcon}>Settings</Button>
          </InlineGrid>
          <InlineGrid columns="1fr auto">
            <Text variant="bodyMd" as="span">Check out our Widget section.</Text>
          </InlineGrid>
        </Card>
        {/* apps section for other apps */}
        <Text variant="headingMd" as="h2">Try our other apps</Text>
        <InlineGrid gap="400" columns={2}>
          <Card roundedAbove="sm">
            <Box background="bg-fill-info" padding="400" borderRadius="100">
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
            <Box background="bg-fill-info" padding="400" borderRadius="100">
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
      <script src="//code.tidio.co/q0squwybsexugfdrwpuxt4cvrtsaxkzo.js" />
    </Page>
  );
}