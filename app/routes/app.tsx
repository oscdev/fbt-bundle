import type { HeadersFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { useNavigation } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { BlockStack, Box, Spinner } from "@shopify/polaris";
import fs from "fs";
import { Footer } from "../components/Footer";
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  // Log the complete request information
  const requestInfo = {
    date: new Date(),
    method: request.method,
    url: request.url,
    body: request.body,
    headers: Object.fromEntries(request.headers),
    query: request.query,
    params: request.params,
  };

  // Write the request information to a log file
  fs.appendFile(`${process.cwd()}/storage/logs/${session?.shop}.txt`, " --------------------Generated Request Logs----------- \n\n " + JSON.stringify(requestInfo, null, 2),  err => {  })

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });


};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      {/* <BlockStack gap="300"> */}
      <NavMenu>
        <Link to="/app" rel="home">Home</Link>
        <Link to="/app/bundle/list">Bundle Offers</Link>
        <Link to="/app/help">Help</Link>
      </NavMenu>
      {navigation.state === "loading" && (
        <div className="loading-overlay-container" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size="large" accessibilityLabel="Loading..." />
          <div className="loading-overlay-spinner">
            Loading please wait..
          </div>
        </div>
      )}
      <Outlet />
      <Box padding="300">
      <Footer />
      </Box>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
