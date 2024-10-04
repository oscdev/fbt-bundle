import { useState, useCallback } from "react";
import { TextField, Card, Form, FormLayout, Select, Text, BlockStack, InlineStack, Checkbox, Popover, DatePicker } from "@shopify/polaris";
export function BundleDiscountInfo(pros) {
  const { globalPriceRules, onAddGlobalPriceRules, bundlePrice, cartItems, cartItemsMedia, currencyCodes, calculatePrice, onCalculatePrice } = pros;

  const currency = currencyCodes.currencyFormats.moneyInEmailsFormat;


  //const [isPriceDynamically, setIsPriceDynamically] = useState(false);

  const [endDateEnable, setEndDateEnable] = useState((globalPriceRules[0]?.endAt.value) ? true : false);
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);

  function getFormatedDate(date) {
    if (!date) return;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const d = new Date(date);
    return monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingMd" as="h2">Price And Discount</Text>
        <Form onSubmit={() => { }}>
          <FormLayout>
            <BlockStack gap="300">
              <TextField
                label="Bundle Price"
                prefix={currency.replace('{{amount}}', '')}
                //value={getBundlePrice(cartItems, cartItemsMedia)}
                value={bundlePrice.value}
                readOnly={calculatePrice.value}
                onChange={(e) => { bundlePrice.onChange(e) }}
                placeholder="0.00"
                autoComplete="off"
                connectedRight={<Checkbox
                  label="Calculate Price Dynamically"
                  checked={calculatePrice.value}
                  onChange={(e) => {
                    calculatePrice.onChange(e);
                    if (e) onCalculatePrice(cartItems, cartItemsMedia);
                  }}
                />}
              />

              <Checkbox
                label={"Apply Discounts"}
                checked={globalPriceRules.length}
                onChange={(e) => {
                  if(!globalPriceRules.length){
                    const today = new Date();
                    onAddGlobalPriceRules({
                      value: '',
                      type: 'percent',
                      startAt: today.toISOString().split('T')[0],
                      endAt: null
                    })
                  }                  
                }}
              />

            </BlockStack>
            {globalPriceRules.map(({ type, value, startAt, endAt }, index) => (
              <>
                <BlockStack gap="300" key={"price-" + index}>

                  <InlineStack align="start" wrap={false} gap="300">

                    <TextField
                      placeholder="Discount in percent: e.g. 10"
                      suffix="%"
                      label="Discount Value"
                      value={value.value}
                      onChange={(e) => value.onChange(e)}
                      autoComplete="off"
                    />

                    <Popover
                      active={startVisible}
                      activator={<TextField
                        label="Start At"
                        value={getFormatedDate(startAt.value)}
                        autoComplete="off"
                        onFocus={() => setStartVisible(true)}
                      />}
                      autofocusTarget="first-node"
                      onClose={() => setStartVisible(false)}
                    >
                      <DatePicker
                        month={new Date(startAt.value).getMonth()}
                        year={new Date(startAt.value).getFullYear()}
                        onChange={(date) => {
                          startAt.onChange(date.start);
                          setStartVisible(false);
                        }}
                        selected={new Date(startAt.value)}
                      />
                    </Popover>
                    <Popover
                      active={(endDateEnable) && endVisible}
                      activator={<TextField
                        label="End At"
                        value={getFormatedDate(endAt.value)}
                        autoComplete="off"
                        placeholder="End At"
                        disabled={!endDateEnable}
                        onFocus={() => setEndVisible(true)}
                        connectedLeft={<Checkbox
                          label="Basic checkbox"
                          labelHidden={true}
                          checked={endDateEnable}
                          onChange={() => {
                            setEndDateEnable(!endDateEnable);
                            setTimeout(() => {
                              (endDateEnable) && endAt.onChange(null)
                            }, 200);
                          }}
                          onFocus={() => setEndVisible(true)}
                        />}
                      />}
                      autofocusTarget="first-node"
                      onClose={() => setEndVisible(false)}
                    >
                      <DatePicker
                        month={(endAt.value) ? new Date(endAt.value).getMonth() : new Date().getMonth()}
                        year={(endAt.value) ? new Date(endAt.value).getFullYear() : new Date().getFullYear()}
                        onChange={(date) => {
                          endAt.onChange(date.end);
                          setEndVisible(false);
                        }}
                        selected={(endAt.value) ? new Date(endAt.value) : new Date()}
                      />
                    </Popover>
                  </InlineStack>
                </BlockStack>

              </>
            )
            )}
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  )
}
