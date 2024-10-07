import { QL } from "../../helpers/graph-ql";
import { authenticate } from "~/shopify.server";

/*
Output:
{"appStatus":true,"themeStatus":{"activeTheme":{"id":170592338223,"name":"Dawn","created_at":"2024-08-02T06:12:59-04:00","updated_at":"2024-08-05T04:02:29-04:00","role":"main","theme_store_id":887,"previewable":true,"processing":false,"admin_graphql_api_id":"gid://shopify/Theme/170592338223"},"blocks":[{"key":"templates/product.json","public_url":null,"created_at":"2024-08-02T06:13:22-04:00","updated_at":"2024-08-05T04:02:29-04:00","content_type":"application/json","size":1885,"checksum":"a81809d8cad6edbba5d1f8c757d345a1","theme_id":170592338223,"theme_liquid":"sections/main-product.liquid","is_configured":true}],"embedBlock":{"is_configured":true,"is_disabled":false}}}
*/
export const modelShopSettings = {
    // The getAppStatus method is an asynchronous function that takes a request object as a parameter
    getAppStatus: async function (request) {
        try {
            // Authenticate the admin using the request object
            const { admin } = await authenticate.admin(request);
            // Execute a GraphQL query to get the app status
            const shopData = await admin.graphql(
                QL.APP_SETTING_GET_MUTATION
            );

            // Parse the JSON response from the GraphQL query
            const shopDataJson = await shopData.json();
            // Return the app status value from the response
            return shopDataJson.data.currentAppInstallation.metafield.value;
        } catch (error) {
            // If an error occurs, log a warning message with the error details
            console.warn('AppStatus Error', JSON.stringify(error))
        }
    },


    // The setAppStatus method is an asynchronous function that takes an admin object and a status value as parameters
    setAppStatus: async function (admin, status) {
        try {
            // Execute a GraphQL query to get the current app settings
            const shopData = await admin.graphql(
                QL.APP_SETTING_GET_MUTATION
            );



            const shopDataJson = await shopData.json();
            // Execute a GraphQL mutation to set the app status
            const shopSetting = await admin.graphql(
                QL.APP_SETTING_SET_MUTATION,
                {
                    variables: {
                        "metafieldsSetInput": [
                            {
                                "namespace": "app_settings",
                                "key": "app_enabled",
                                "type": "boolean",
                                "value": status,
                                "ownerId": shopDataJson.data.currentAppInstallation.id
                            }
                        ]
                    },
                }
            );
            const shopSettingJson = await shopSetting.json();
            // Return the new app status value from the response
            return shopSettingJson.data.metafieldsSet.metafields[0].value;

        } catch (error) {
            console.warn('setAppStatus Error', JSON.stringify(error))
        }
    },

    shopDetail: async function (request) {
		try {
			const { admin } = await authenticate.admin(request);

			const shopData = await admin.graphql(
				QL.SHOP_CURRENCY
			);

			const responseJson = await shopData.json();
			return responseJson.data.shop;
		} catch (error) {
			console.warn("Error : " + error);
		}
	},

    getThemeStatus: async function (request) {
        try {
            // Initialize an empty object to store the active theme
            let activeTheme = {};
            // Authenticate the admin using the request object
            const { session, admin } = await authenticate.admin(request);
            // Get all themes using the admin's REST API
            const themes = await admin.rest.resources.Theme.all({
                session: session
            });

            // Loop through each theme and find the active theme with the role 'main'
            for (var theme of themes.data) {
                if (theme.role == 'main') {
                    activeTheme = theme;
                }
            }
            // Call the checkTheme method with the active theme and request object, and return the result
            return await this.checkTheme(activeTheme, request)
        } catch (error) {
            console.warn('getThemeStatus error ===== ', error)
            // Return an empty object as a fallback
            return {};
        }
    },

    // The checkTheme method is an asynchronous function that takes an activeTheme object and a request object as parameters
    checkTheme: async function (activeTheme, request) {
        // Use Promise.all to concurrently fetch the supported blocks and embed block for the active theme
        const [blocks, embedBlock] = await Promise.all([
            await this.getSupportedBlock(activeTheme, request),
            await this.getEmbedBlock(activeTheme, request)
        ])
        // Return an object containing the active theme, supported blocks, and embed block
        return {
            activeTheme,
            blocks,
            embedBlock
        }
    },

    // The getSupportedBlock method is an asynchronous function that takes an activeTheme object and a request object as parameters
    getSupportedBlock: async function (activeTheme, request) {
        try {
            // Define an array of supported block templates
            const APP_BLOCK_TEMPLATES = ['product'];

            const { session, admin } = await authenticate.admin(request);

            // Get all assets for the active theme using the admin's REST API
            const assets = await admin.rest.resources.Asset.all({
                session: session,
                theme_id: activeTheme.id
            })

            // Filter the assets to find the ones that match the supported block templates
            const blocks = assets.data.filter((file) => {
                return APP_BLOCK_TEMPLATES.some(template => file.key === `templates/${template}.json`);
            })

            // Use Promise.all to concurrently process each block
            await Promise.all(blocks.map(async (file, index) => {
                // Get the asset JSON for the current block
                let assetJson = await admin.rest.resources.Asset.all({
                    session: session,
                    theme_id: activeTheme.id,
                    asset: {
                        key: file.key,
                    }
                })

                // Parse the asset JSON and get the asset JSON string
                const assetJsonData = JSON.parse(assetJson.data[0].value);
                const assetJsonString = JSON.stringify(assetJson.data[0].value);

                // Check if the asset JSON string contains the app block extension ID
                const isAppBlock = assetJsonString.search(`${process.env.SHOPIFY_UPSELL_CROSS_EXTENSION_ID}`)

                // Find the main section in the asset JSON
                const main = Object.entries(assetJsonData.sections).find(([id, section]) => id === 'main' || section.type.startsWith("main-"))

                // Set the theme_liquid and is_configured properties of the block object
                file.theme_liquid = `sections/${main[1].type}.liquid`
                file.is_configured = (isAppBlock > -1) ? true : false;

            }))
            return blocks
        } catch (error) {
            console.warn('getSupportedBlock error === ', error)
            return []
        }
    },

    // The getEmbedBlock method is an asynchronous function that takes an activeTheme object and a request object as parameters
    getEmbedBlock: async function (activeTheme, request) {
        // Define the key to fetch the embed block
        const key = 'config/settings_data.json';

        // Initialize the output object with default values
        const output = {
            is_configured: false,
            is_disabled: true
        };
        try {
            const { session, admin } = await authenticate.admin(request);

            // Get the embed block asset for the active theme
            const embedBlock = await admin.rest.resources.Asset.all({
                session: session,
                theme_id: activeTheme.id,
                asset: {
                    key: key,
                }
            })

            const assetJsonString = JSON.parse(embedBlock.data[0].value);

            // Iterate through the blocks in the asset JSON and check for the app block extension ID
            for (const [key, value] of Object.entries(assetJsonString.current.blocks)) {
                if (JSON.stringify(value).search(`${process.env.SHOPIFY_UPSELL_CROSS_EXTENSION_ID}`) > -1) {
                    output.is_configured = true;
                    output.is_disabled = value.disabled;
                }
            }
            // Return the output object
            return output;
        } catch (error) {
            console.warn('getEmbedBlock error === ', error)
            return output;
        }
    },

    setBundleSearchableDefination: async function (admin) {
        try {
            const def = await admin.graphql(
                QL.SET_BUNDLE_SEARCHABLE_MUTATION,
                {
                    variables: {
                        "definition": {
                            "name": "Bundle Searchable",
                            "namespace": "oscp",
                            "key": "fbtSearchable",
                            "type": "single_line_text_field",
                            "ownerType": "PRODUCT",
                            "capabilities": {
                                "adminFilterable": {
                                "enabled": true
                                }
                            },
                            "access": {
                                "admin": "PRIVATE"
                            },
                        }
                    }
                }
            );
            const defJson = await def.json();
            console.log('defJson', JSON.stringify(defJson))
            return defJson;
        } catch (error) {

        }
    },

    cartTransformCreate: async function (admin) {
        try {
            const APP_CARTTRANSFORM_SET_MUTATION = QL.APP_CARTTRANSFORM_SET_MUTATION.replace("$FUNCTION_ID", `${process.env.SHOPIFY_CART_TRANSFORMER_ID}`);
            const shopSetting = await admin.graphql(APP_CARTTRANSFORM_SET_MUTATION);
            const shopSettingJson = await shopSetting.json();
            console.log('APP_CARTTRANSFORM_SET_MUTATION', JSON.stringify(shopSettingJson))
            return shopSettingJson.data;

        } catch (error) {
            console.warn('setAppStatus Error', JSON.stringify(error))
        }
    }

}



