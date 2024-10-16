import { QL } from "~/helpers/graph-ql";
import { authenticate } from "~/shopify.server";

export const subscription = {
    get: async function (request) {
        const { admin } = await authenticate.admin(request);
        const subscriptionsReq = await admin.graphql(
            QL.GET_SUBSCRIPTIONS
        );
        const subscriptionsRes = await subscriptionsReq.json();
        return subscriptionsRes.data.app.installation.activeSubscriptions
    },
};