import { useState, useCallback } from "react";
import { TextField, Card, Form, FormLayout, Select, Text, BlockStack, InlineStack, Checkbox, Popover, DatePicker, Button, PageActions, IndexTable, Box } from "@shopify/polaris";
import { XIcon, ArrowDownIcon, ArrowUpIcon } from '@shopify/polaris-icons';
export function BundleDiscountInfo(pros) {
  const { globalPriceRules, onAddGlobalPriceRules, onRemoveGlobalPriceRules, bundlePrice, cartItems, cartItemsMedia, currencyCodes, calculatePrice, onCalculatePrice } = pros;
  const currency = currencyCodes.currencyFormats.moneyInEmailsFormat;  
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState();
  const [endDateActiveRowIndex, setEndDateActiveRowIndex] = useState();

  function getFormatedDate(date) {
    if (!date) return;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const d = new Date(date);
    return monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  const discoubtsRowMarkup = globalPriceRules.map(({ type, value, startAt, endAt }, index) => (
    <IndexTable.Row
      id={index}
      key={index}
      position={index}
    >
      <IndexTable.Cell>
        <TextField
          placeholder="E.g. 10"
          prefix="%"
          type="number"
          max={99.99}
          min={0.01}
          label="Discount Value"
          labelHidden
          value={value.value}
          onChange={(e) => {
            if ((parseFloat(e) < 100) || (e == '')) value.onChange(e)
          }
          }
          autoComplete="off"
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Popover
          active={startVisible && activeRowIndex === index}
          activator={<TextField
            label="Start At"
            labelHidden
            value={getFormatedDate(startAt.value)}
            autoComplete="off"
            onFocus={() => {
              setActiveRowIndex(index);
              setStartVisible(true);
            }}
          />}
          autofocusTarget="first-node"
          onClose={() => setStartVisible(false)}
        >
          <Card>
            <DatePicker
              month={new Date(startAt.value).getMonth()}
              year={new Date(startAt.value).getFullYear()}
              disableDatesBefore={new Date(Date.now() - 1000 * 60 * 60 * 24)}
              onChange={(date) => {
                startAt.onChange(new Date(date.start.getTime() + (1000 * 60 * 60 * 24)).toISOString().split('T')[0]);
                setStartVisible(false);
              }}
              selected={new Date(startAt.value)}
            />
          </Card>
        </Popover>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <InlineStack align="start" wrap={false} gap="300">
          <Box>
            <Checkbox
              label="Basic checkbox"
              labelHidden={true}
              checked={endAt.value ? true : false}
              onChange={(e) => {                
                if (e && !endAt.value) {
                  endAt.onChange(new Date(new Date(startAt.value).getTime() + (1000 * 60 * 60 * 24)))                  
                } else {
                  endAt.onChange(null);
                }
              }}              
            />
          </Box>
          <Box>
            <Popover              
              active={endVisible && endDateActiveRowIndex === index}
              activator={<TextField
                label="End At"
                labelHidden
                value={getFormatedDate(endAt.value)}
                autoComplete="off"
                placeholder="End At"
                disabled={!endAt.value ? true : false}
                onFocus={() => {
                  setEndVisible(true);
                  setEndDateActiveRowIndex(index);
                }}
              />}
              autofocusTarget="first-node"
              onClose={() => setEndVisible(false)}
              preferredPosition="below"
              ariaHaspopup={false}
            >
              <Card>
                <DatePicker
                  month={(endAt.value) ? new Date(endAt.value).getMonth() : new Date().getMonth()}
                  year={(endAt.value) ? new Date(endAt.value).getFullYear() : new Date().getFullYear()}
                  disableDatesBefore={new Date(startAt.value)}
                  onChange={(date) => {
                    endAt.onChange(new Date(date.end.getTime() + (1000 * 60 * 60 * 24)).toISOString().split('T')[0]);
                    setEndVisible(false);
                  }}
                  selected={(endAt.value) ? new Date(endAt.value) : new Date(new Date(startAt.value).getTime() + (1000 * 60 * 60 * 24))}
                />
              </Card>
            </Popover>
          </Box>
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Button size="large" variant="plain" tone="critical" icon={XIcon} onClick={() => {
          onRemoveGlobalPriceRules(index)
        }}></Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ),
  );

  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingMd" as="h2">Price and Discount</Text>
        <Form onSubmit={() => { }}>
          <FormLayout>
            <BlockStack gap="300">
              <TextField
                label="Bundle Price"
                prefix={currency.replace('{{amount}}', '')}
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
                  if (!globalPriceRules.length) {
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
            {((globalPriceRules.length)) && (
              <>
                <IndexTable
                  resourceName={{
                    singular: 'Discount',
                    plural: 'Discounts',
                  }}
                  itemCount={globalPriceRules.length}
                  headings={[
                    { title: 'Discount Value' },
                    { title: 'Start At' },
                    { title: 'End At' },
                    { title: '' }
                  ]}
                  selectable={false}
                >
                  {discoubtsRowMarkup}
                </IndexTable>
                
                <PageActions
                  primaryAction={{
                    content: 'Add More Discounts',
                    disabled: (globalPriceRules.length >= 3) ? true : false,
                    onAction: () => {
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
              </>
            )}
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  )
}
