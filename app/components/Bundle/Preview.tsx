import { Card, Text, BlockStack, InlineStack, SkeletonThumbnail, SkeletonBodyText, Button, Thumbnail, Badge, Box, Divider } from '@shopify/polaris';
import divider from '../../assets/images/divider.png';
export function Preview(pros) {
  const { bundleName, bundlePrice, labelOnCard, cartItems, cartItemsMedia, currencyCodes, globalPriceRules } = pros;
  const currency = currencyCodes.currencyFormats.moneyInEmailsFormat;

  const totalWithHighestDiscount = () => {
    const currentDate = new Date(new Date().setHours(0, 0, 0, 0));

    let highestValueObject = null;
    let highestValue = 0;

    globalPriceRules.forEach((obj) => {
      const startDate = new Date(new Date(obj.startAt.value).setHours(0, 0, 0, 0));
      const endDate = (obj.endAt.value) ? new Date(new Date(obj.endAt.value).setHours(0, 0, 0, 0)) : Infinity;
      if (obj.value.value && startDate <= currentDate && endDate >= currentDate) {
        if (parseInt(obj.value.value) > highestValue) {
          highestValue = parseInt(obj.value.value);
          highestValueObject = obj;
        }
      }
    });
    
    return (highestValueObject) ? <>
      <Text variant="bodyLg" as="p" fontWeight="semibold" textDecorationLine="line-through">{currency.replace('{{amount}}', bundlePrice.value)}</Text>
      <Text variant="bodyLg" as="p" fontWeight="semibold" tone="critical">{currency.replace('{{amount}}', (bundlePrice.value - ((highestValueObject.value.value / 100) * bundlePrice.value)).toFixed(2))}</Text>     
    </> : <Text variant="bodyLg" as="p" fontWeight="semibold" tone="critical">{currency.replace('{{amount}}', bundlePrice.value)}</Text>
  }

  return (
    <BlockStack gap="300">
      <Card>
        <BlockStack gap="100">
          <Text variant="headingMd" as="h6" alignment="center">Preview</Text>
          <Divider />
          <Box padding="200"><Text alignment="center" variant="headingMd" as="h6">{(bundleName.value) ? bundleName.value : "Bundle of 3 Combos"}</Text></Box>

          {cartItems.map(
            ({ merchandiseId, defaultQuantity }, index) => (
              <>
                {cartItemsMedia.map(
                  ({ node: { id, title, featuredImage, variants } }) => (
                    (merchandiseId.value === id.split("/").pop()) && (
                      <>
                        <InlineStack align="start" blockAlign='center' wrap={false} gap="300">
                          <Thumbnail
                            source={featuredImage?.url}
                            alt={title}
                          />
                          {/* Display title and price */}
                          <Text variant="bodyLg" as="p"><Badge tone="success">{defaultQuantity.value}</Badge> x {title}</Text>
                        </InlineStack>
                        <Text alignment="end" variant="bodyLg" as="p" fontWeight="semibold">{currency.replace('{{amount}}', '')}{variants.edges[0].node.price} {'  '}</Text>
                        {(index !== cartItemsMedia.length - 1) ? <Text variant="bodyMd" alignment='center' as="h3">
                          <img width="100%" src={divider} alt="divider" />
                        </Text> : ''}
                      </>
                    )
                  ),
                )}
              </>
            ),
          )}

          {(!cartItems.length) ? (
            <>
              <BlockStack gap="300">
                <InlineStack align="start" wrap={false} gap="300">
                  <SkeletonThumbnail size="small" />
                  <SkeletonBodyText lines={2} />
                </InlineStack>
                <Text variant="bodyMd" alignment='center' as="h3"><img width="100%" src={divider} alt="divider" /></Text>
                <InlineStack align="start" wrap={false} gap="300">
                  <SkeletonThumbnail size="small" />
                  <SkeletonBodyText lines={2} />
                </InlineStack>
                <Text variant="bodyMd" alignment='center' as="h3"><img width="100%" src={divider} alt="divider" /></Text>
                <InlineStack align="start" wrap={false} gap="300">
                  <SkeletonThumbnail size="small" />
                  <SkeletonBodyText lines={2} />
                </InlineStack>
              </BlockStack>
            </>
          ) : null}

          <Box padding="100">
            <Badge tone="info">
              {(labelOnCard.value) ? labelOnCard.value : "Buy this combo and get 10% OFF"}
            </Badge>
          </Box>

          {(cartItemsMedia.length && bundlePrice.value) ? <Box padding="100">
            {/* Display the total price */}
            <InlineStack wrap={false} gap="300" align="center">
              <Text variant="bodyLg" as="p" fontWeight="semibold">Total: </Text>
              {totalWithHighestDiscount()}
            </InlineStack>
          </Box> : <Box padding="100">
            <InlineStack wrap={false} gap="300" align="center">
              <Text variant="bodyLg" as="p" fontWeight="semibold">Total: </Text>
              <SkeletonBodyText lines={1} />
              <SkeletonBodyText lines={1} />
            </InlineStack>
          </Box>}

          <Button variant="primary" disabled={!cartItems.length}>Add to Bundle</Button>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
