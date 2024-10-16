import { Layout, Page } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate, MONTHLY_PLAN, ANNUAL_PLAN } from "~/shopify.server";
import { subscription } from "../services/index";
import { SubscriptionCards } from "../components/Subscriptions/index";

export const loader = async ({ params, request }) => {
    const u = new URL(request.url);
    const plan = u.searchParams.get("plan");
    const action = u.searchParams.get("action");
    const subscriptionId = u.searchParams.get("subscriptionId");
    const { billing, session } = await authenticate.admin(request);
    console.log("session", session)

    if (plan && action !== 'unsubscribe') {        
        await billing.require({
            plans: (plan == 'annual') ? [ANNUAL_PLAN] : [MONTHLY_PLAN],
            isTest: true,
            returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_APP_NAME}/app/subscriptions`,
            onFailure: async () => billing.request({
                plan: (plan == 'annual') ? ANNUAL_PLAN : MONTHLY_PLAN, //MONTHLY_PLAN,
                returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_APP_NAME}/app/subscriptions`,
                isTest: true
            }),
        });
    }

    if (plan && action == 'unsubscribe') {
        const { billing } = await authenticate.admin(request);
        await billing.cancel({
            subscriptionId: subscriptionId,
            prorate: true,
        });
    }
    const activeSubscription = await subscription.get(request);
    return json(activeSubscription);
};

export default function Billing() {
    const subscriptions = useLoaderData();
    console.log("subscriptions", subscriptions)
    const [activeSubscription, setSactiveSubscription] = useState([]);

    useEffect(() => {
        setSactiveSubscription(subscriptions)
    }, [subscriptions])

    return (
        <Page title="Billing">
            <Layout>
                <Layout.Section>
                    <SubscriptionCards
                        activeSubscription={activeSubscription}
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
