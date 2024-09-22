import { useState } from 'react'
import { TextField, Card, Form, FormLayout, Layout, Text, BlockStack, InlineStack, Checkbox, Popover, DatePicker } from "@shopify/polaris";
export function BundleDiscountInfo(pros) {
  const { globalPriceRules } = pros;
  const [endDateEnable, setEndDateEnable] = useState(false);
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
    end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
  });
  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingLg" as="h5">Apply Discount</Text>
        <Form onSubmit={() => { }}>
          <FormLayout>
            {globalPriceRules.map(({ type, value, startAt, endAt }, index) => (
              <>
                <InlineStack align="start" wrap={false} gap="300">
                  <TextField
                    label={<Text variant="headingMd" as="h6">Discount type</Text>}
                    value={type.value}
                    onChange={(e) => type.onChange(e)}
                    autoComplete="off"
                  />
                  <TextField
                    label={<Text variant="headingMd" as="h6">Discount value</Text>}
                    value={value.value}
                    onChange={(e) => value.onChange(e)}
                    autoComplete="off"
                  />
                   <Popover
                    active={startVisible}
                    activator={  <TextField
                      label={<Text variant="headingMd" as="h6">Start At</Text>}
                      value={value.value} 
                      onChange={(e) => value.onChange(e)}
                      autoComplete="off"
                      onFocus={() => setStartVisible(true)}
                    />}
                    autofocusTarget="first-node"
                    onClose={() => setStartVisible(false)}  
                  >
                    <DatePicker
                      month={9}
                      year={2024}
                      onChange={setSelectedDates}
                      // onMonthChange={handleMonthChange}
                      selected={selectedDates}
                    />
                  </Popover>
                  <Popover
                    active={endVisible}
                    activator={ <TextField
                      label={<Text variant="headingMd" as="h6">End At</Text>}
                      value={value.value}
                      onChange={(e) => value.onChange(e)}
                      autoComplete="off"
                      disabled={!endDateEnable}
                      connectedLeft={<Checkbox
                        label="Basic checkbox"
                        labelHidden={true}
                        checked={endDateEnable}
                        onChange={() => { setEndDateEnable(!endDateEnable) }}
                        onFocus={() => setEndVisible(true)}
                      />}
                    />}
                    autofocusTarget="first-node"
                    onClose={() => setEndVisible(false)}
                  >
                    <DatePicker
                      month={9}
                      year={2024}
                      onChange={setSelectedDates}
                      // onMonthChange={handleMonthChange}
                      selected={selectedDates}
                    />
                  </Popover>
                </InlineStack>
              </>
            )
            )}
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  )
}
