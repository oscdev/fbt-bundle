import { Layout, Text, InlineGrid, BlockStack, Banner, PageActions, Spinner } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { constents } from "../../helpers/constents";

//Create the dashboard page Design
//@ts-ignore
export function ThemeAlert(props) {
    const { extensionId, shop } = props;

    const [loading, setLoading] = useState(true);
    const [themeBlocks, setThemeBlocks] = useState([]);
    const [liveTheme, setLiveTheme] = useState({});

    useEffect(() => {
        getThemeFiles();
    }, []);

    async function getThemeFiles() {
        setLoading(true);
        const result = await fetch("/app/theme-json").then((res) => res.json());
        const blocks = constents.theme_extension_blocks;

        setLiveTheme(result);

        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < result.files.nodes.length; j++) {
                if (blocks[i].fileName === result.files.nodes[j].filename) {
                    const assetJsonString = JSON.parse(result.files.nodes[j].body.content);
                    if (blocks[i].extesionHandle == 'app-embed') {
                        for (const [key, value] of Object.entries(assetJsonString.current.blocks)) {
                            if ((JSON.stringify(value).search(`${blocks[i].extesionHandle}/${extensionId}`) > -1)) {
                                blocks[i].isEnabled = !value.disabled;
                            }
                        }
                    } else {
                        for (const [key, value] of Object.entries(assetJsonString.sections.main.blocks)) {
                            if ((JSON.stringify(value).search(`${blocks[i].extesionHandle}/${extensionId}`) > -1)) {
                                blocks[i].isEnabled = !value.disabled;
                            }
                        }
                    }
                }
            }
        }
        setLoading(false);
        setThemeBlocks(blocks);
    }

    return (
        <Layout.Section>
            {(loading) ? (
                <Spinner accessibilityLabel="Spinner example" size="large" />
            ) : (
                <Banner
                    title={'Activate our app on your live theme (' + liveTheme.name + ')'}
                    tone="info"
                >
                    <InlineGrid gap="400" columns={3}>
                        {themeBlocks.map(({ blockName, fileName, extesionHandle, description, isMandatory, isEnabled, editorUri }, index) => (
                            <div key={index}>
                                <Banner
                                    title={blockName}
                                    tone={isEnabled ? "success" : "warning"}
                                >
                                    <BlockStack gap="200">
                                        <Text as="p" variant="bodyMd">
                                            {description}
                                        </Text>
                                    </BlockStack>
                                    <PageActions
                                        primaryAction={{
                                            content: (isEnabled) ? 'View' : 'Enable block',
                                            url: editorUri.replace('$shopUrl', shop).replace('$themeId', liveTheme.id.split('/').pop()).replace('$uuid', extensionId),
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
