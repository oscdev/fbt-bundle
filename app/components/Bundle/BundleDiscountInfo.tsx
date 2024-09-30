import { useState } from 'react'
import { TextField, Card, Form, FormLayout, Select, Text, BlockStack, InlineStack, Checkbox, Popover, DatePicker } from "@shopify/polaris";
export function BundleDiscountInfo(pros) {
  const { globalPriceRules } = pros;
  // const [endDateEnable, setEndDateEnable] = useState(false);
  // const [startVisible, setStartVisible] = useState(false);
  // const [endVisible, setEndVisible] = useState(false);
  // const [selectedDates, setSelectedDates] = useState({
  //   start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
  //   end: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (EST)'),
  // });

  // const options = [
  //   {label: 'Percent', value: 'percent'},
  //   {label: 'Fixed', value: 'fixed'},
  // ];

  return (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingMd" as="h2">Apply Discount</Text>
        <Form onSubmit={() => { }}>
          <FormLayout>
            {globalPriceRules.map(({ type, value, startAt, endAt }, index) => (
              <>
                <InlineStack align="start" wrap={false} gap="300">
                  <TextField
                    label={<Text variant="headingMd" as="h6">Discount type</Text>}
                    value={type.value}
                    // onChange={(e) => type.onChange(e)}
                    autoComplete="off"
                  />
                  {/* <Select
                    label={<Text variant="headingMd" as="h6">Discount Type</Text>}
                    options={options}
                    onChange={(e) => type.onChange(e)}
                    value={type.value}
                  /> */}
                  <TextField
                    placeholder="Discount in percent: e.g. 10"
                    suffix="%"
                    label={<Text variant="headingMd" as="h6">Discount Value</Text>}
                    value={value.value}
                    onChange={(e) => value.onChange(e)}
                    autoComplete="off"
                  />
                  {/* <Popover
                    active={startVisible}
                    activator={<TextField
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
                    activator={<TextField
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
                  </Popover> */}
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
