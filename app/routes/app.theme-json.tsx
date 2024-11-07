import { json } from "@remix-run/node";
import { settings } from "../services/index.js";
import { authenticate } from "~/shopify.server";
import { constents } from "../helpers/constents";

export const loader = async ({ params, request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  const fileNames = constents.theme_extension_blocks.map((block) => block.fileName);
  const theme = await settings.getThemes(admin, session, fileNames);
  return json(theme, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};