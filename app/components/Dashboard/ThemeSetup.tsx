import { Layout, Card, Text, InlineGrid, Button, BlockStack, Banner } from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";

//Create the dashboard page Design
//@ts-ignore
export function ThemeSetup(props) {
    const { settingsData } = props;
    const liveThemeId = settingsData.appSettingsData.themeStatus?.activeTheme?.id;
    return (
        <Layout.Section>
            <Card>
                <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">
                        Theme Status <small><i>(Live Theme: {settingsData.appSettingsData.themeStatus?.activeTheme?.name})</i></small>
                    </Text>
                    {/* App Embeds section */}
                    <InlineGrid gap="400" columns={3}>
                        <Card roundedAbove="sm">
                            <BlockStack gap="200">
                                <InlineGrid columns="1fr auto">
                                    <Text variant="headingMd" as="h6" fontWeight="bold">
                                        App Embeds
                                    </Text>
                                    {settingsData.appSettingsData.themeStatus?.embedBlock?.is_disabled === true ?
                                        <Button icon={ExternalIcon} target="_blank" url={"https://" + settingsData.appSettingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?context=apps&template=index&activateAppId=" +  settingsData.uuid + "/app-embed"}>Enable</Button> : <Button icon={ExternalIcon} target="_blank" url={"https://" + settingsData.appSettingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?context=apps&template=index&activateAppId=" +  settingsData.uuid + "/app-embed"}>View</Button>}
                                </InlineGrid>
                                {settingsData.appSettingsData.themeStatus?.embedBlock?.is_disabled === true ? <Text variant="bodyLg" as="p" fontWeight="semibold" tone="critical">
                                    The App is disabled.
                                </Text>
                                    :
                                    <Text variant="bodyLg" as="p" fontWeight="semibold" tone="success">
                                        The App is enabled.
                                    </Text>}
                                <Text as="p" variant="bodyMd">
                                    <Banner tone="info">
                                        <b>Mandatory.</b>
                                        <br />
                                        Enable/Disable OSCP Upsell and Cross Sell on App Embeds.
                                    </Banner>
                                </Text>
                            </BlockStack>
                        </Card>
                        {/* Product Widget section */}
                        <Card roundedAbove="sm">
                            <BlockStack gap="200">
                                <InlineGrid columns="1fr auto">
                                    <Text variant="headingMd" as="h6" fontWeight="bold">
                                        Product Widget
                                    </Text>
                                    <Button icon={ExternalIcon} target="_blank"
                                        url={"https://" + settingsData.appSettingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?template=product&addAppBlockId=" +  settingsData.uuid + "/frequently&target=mainSection"}>{(
                                            settingsData.appSettingsData.themeStatus?.blocks?.length !== 0
                                                ? (settingsData.appSettingsData.themeStatus?.blocks[0]?.is_configured === true ? "View" : "Enable App block")
                                                : "Theme not Supported"
                                        )}
                                    </Button>
                                </InlineGrid>
                                <Text as="p" variant="bodyMd">
                                    <Banner tone="info">
                                        <b>Mandatory.</b>
                                        <br />
                                        Enable/Disable layout design to display "Frequently Bought Together" section on the product detail page.
                                    </Banner>
                                </Text>
                            </BlockStack>
                        </Card>
                        <Card roundedAbove="sm">
                            <BlockStack gap="200">
                                <InlineGrid columns="1fr auto">
                                    <Text variant="headingMd" as="h6" fontWeight="bold">
                                        Bundle Widget
                                    </Text>
                                    <Button icon={ExternalIcon} target="_blank"
                                        url={"https://" + settingsData.appSettingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?template=product&addAppBlockId=" +  settingsData.uuid + "/fbt-bundle&target=mainSection"}>{(
                                            settingsData.appSettingsData.themeStatus?.blocks?.length !== 0
                                                ? (settingsData.appSettingsData.themeStatus?.blocks[0]?.is_configured === true ? "View" : "Enable Bundle block")
                                                : "Theme not Supported"
                                        )}
                                    </Button>
                                </InlineGrid>
                                <Text as="p" variant="bodyMd">
                                    <Banner tone="info">
                                        <b>Mandatory.</b>
                                        <br />
                                        Enable/Disable layout design to display "FBT Bundle" section on the product detail page.
                                    </Banner>
                                </Text>
                            </BlockStack>
                        </Card>
                    </InlineGrid>
                </BlockStack>
            </Card>
        </Layout.Section>
    );
}
