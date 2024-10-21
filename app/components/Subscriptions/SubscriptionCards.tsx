import { InlineGrid, Card, BlockStack, List, PageActions, Text, Icon, LegacyStack } from "@shopify/polaris";
import { constents } from "../../helpers/constents";
import {PlusCircleIcon} from '@shopify/polaris-icons';
export function SubscriptionCards(pros) {
    const { activeSubscription } = pros;
    return (
        <InlineGrid gap="400" columns={3}>
            {constents.subscription_plans.map(({ name, price, description, action, features }, index) => (
                <Card roundedAbove="sm" key={index} background={(activeSubscription.length) ? (activeSubscription[0].name == name) ? 'bg-surface-success' : 'bg-surface' : ((name == 'Basic') ? 'bg-surface-success' : 'bg-surface')}>
                    <BlockStack gap="200">
                        <Text variant="headingMd">{name}</Text>
                        <List type="bullet">
                            {features.map((feature, index) => (
                                <List.Item key={index}>
                                    <LegacyStack spacing="tight">
                                        <Icon source={PlusCircleIcon} tone="base" />
                                        <div>{feature}</div>
                                    </LegacyStack> 
                                </List.Item>
                            ))}
                        </List>
                    </BlockStack>
                    {(name != 'Basic') && <PageActions
                        primaryAction={{
                            content: (activeSubscription.length && activeSubscription[0].name == name) ? 'Unsubscribe' : 'Subscribe',
                            url: (activeSubscription.length && activeSubscription[0].name == name) ? action + '&action=unsubscribe&subscriptionId=' + activeSubscription[0].id : action,
                        }}
                    />}
                    
                </Card>
            ))}
        </InlineGrid>
    );
}
