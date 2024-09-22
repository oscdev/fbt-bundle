import { Layout, Card, Text, InlineGrid, Button, BlockStack, Banner } from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";

//Create the dashboard page Design
//@ts-ignore
export function ThemeSetup(props) {
    const { settingsData } = props;
    const liveThemeId = settingsData.themeStatus.activeTheme.id;

    return (
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
                                <Button icon={ExternalIcon} target="_blank" url={"https://" + settingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?context=apps&template=index&activateAppId=7f58f248-eb9e-4678-860e-39566c950875/app-embed"}>Enable</Button> : <Button icon={ExternalIcon} target="_blank" url={"https://" + settingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?context=apps&template=index&activateAppId=7f58f248-eb9e-4678-860e-39566c950875/app-embed"}>View</Button>}
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
                            <Button icon={ExternalIcon} target="_blank" disabled={settingsData.themeStatus.blocks[0].is_configured === true}
                                url={"https://" + settingsData.shopUrl + "/admin/themes/" + liveThemeId + "/editor?template=product&addAppBlockId=7f58f248-eb9e-4678-860e-39566c950875/frequently&target=mainSection"}>{(
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
    );
}
