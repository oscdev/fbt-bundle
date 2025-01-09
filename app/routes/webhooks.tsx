import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import events from "../helpers/event-notifications";


export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(
    request
  );

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
        const existingStoreDetails = await db.store.findFirst({
          where: {
            myshopifyDomain: shop
          }
        })
        if (existingStoreDetails) {
          console.log("existingStoreDetails===", existingStoreDetails)
          await db.store.deleteMany({ where: { myshopifyDomain: shop } });
          events.emit('oscp:send:owner:appUninstalled', existingStoreDetails);
        } else {
          console.log("Store details do not exist in store table. Old User");
        }
      }
     
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
      console.log("Webhook ----------------------", topic);
      throw new Response();
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
