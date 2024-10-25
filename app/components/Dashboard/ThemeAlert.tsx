import { Layout, Text, InlineGrid, BlockStack, Banner, PageActions, Spinner, Badge } from "@shopify/polaris";
import { useState, useEffect } from "react";

//Create the dashboard page Design
//@ts-ignore
export function ThemeAlert(props) {
    //const { } = props;
    const [loading, setLoading] = useState(true);    
    const [liveTheme, setLiveTheme] = useState({});

    useEffect(() => {
        getThemeFiles();
    }, []);

    async function getThemeFiles() {
        setLoading(true);
        const result = await fetch("/app/theme-json").then((res) => res.json());
        console.log('theme', result);
        setLiveTheme(result);
        setLoading(false);    }

    return (
        <Layout.Section>
            {(loading) ? (
                <Spinner accessibilityLabel="Spinner example" size="large" />
            ) : (
                <Banner
                    title={'Activate our app on your live theme (' + liveTheme.themeName + ')'}
                    tone="info"
                >
                    <InlineGrid gap="400" columns={3}>
                        {liveTheme.blocks.map(({ blockName, fileName, extesionHandle, description, isMandatory, isEnabled, editorUri }, index) => (
                            <div key={index}>
                                <Banner
                                    title={blockName}
                                    tone={isEnabled ? "success" : "warning"}
                                >
                                    {(isMandatory && !isEnabled) && <Badge tone="critical">MANDATORY</Badge>}
                                    {isEnabled && <Badge tone="success">Enabled</Badge>} 
                                    <BlockStack gap="200">                                                                               
                                        <Text as="p" variant="bodyMd">
                                            {description}
                                        </Text>
                                    </BlockStack>
                                    <PageActions
                                        primaryAction={{
                                            content: (isEnabled) ? 'View' : 'Enable block',
                                            url: editorUri,
                                            target: '_blank',
                                        }}
                                    />
                                </Banner>
                            </div>
                        ))}
                    </InlineGrid>
                </Banner>
            )}
        </Layout.Section>
    );
}
