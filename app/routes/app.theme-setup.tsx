import { Page, Layout, Frame } from "@shopify/polaris";
import { ThemeSetup } from "../components/Dashboard/ThemeSetup";
import { settings } from "../services/index.js";
import { useLoaderData, json, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server.js";

async function getLoaderData(request) {
    const { admin } = await authenticate.admin(request);
    const [ themeStatus] = await Promise.all([
      await settings.getThemeStatus(request)
    ])
    return {
      themeStatus,
      shopUrl: admin.rest.session.shop || ''
    };
  }
  
  // get loader data for app settings and theme settings (Enable/Disable)
  export const loader = async ({ request }) => {
    const appSettingsData = await getLoaderData(request);
    const uuid = process.env.SHOPIFY_UPSELL_CROSS_EXTENSION_ID;
    return json({ uuid, appSettingsData});
  };

//@ts-ignore
export default function Index() { 
    const navigate = useNavigate();
    const settingsData = useLoaderData();
  return (
    <Page title="Theme Setup" backAction={{ onAction: () => navigate("/app") }}>
        <Layout> 
          {settingsData?.themeStatus !== null ? (
            <ThemeSetup settingsData={settingsData} />
          ): null}
        </Layout>
    </Page>
  );
}