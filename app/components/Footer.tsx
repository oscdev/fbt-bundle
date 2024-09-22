import { Text, Link, BlockStack } from "@shopify/polaris";

export function Footer() {
  return (
    <BlockStack inlineAlign="center">
      <Text as="p" fontWeight="regular">
        {" "}
        Copyright © 2024 |{" "}
        <Link
          target="_blank"
          style={{ color: "#2463bc" }}
          url="https://www.oscprofessionals.com/"
        >
          oscprofessionals
        </Link>{" "}
        | All Rights Reserved |{" "}
        <Link
          target="_blank"
          style={{ color: "#2463bc" }}
          url="https://www.oscprofessionals.com/oscp-upsell-cross-sell-app-support/"
        >
          Get in Touch
        </Link>
      </Text>
      <br />
    </BlockStack>
  );
}
