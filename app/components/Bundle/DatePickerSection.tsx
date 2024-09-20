// Importing necessary components and utilities from the Shopify Polaris library.
import { Card, FormLayout, Popover, TextField, Checkbox, DatePicker, Layout, Box, BlockStack, InlineStack, Text, Form } from "@shopify/polaris";
import { useEffect, useState } from "react";


// Define the `DatePickerSection` component as a React functional component.
export function DatePickerSection({ startDate, setStartDate, endDate, setEndDate }) {
  // Variables declaration and initialization for managing state.
  const [startVisible, setStartVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [setEndDateEnabled, setSetEndDateEnabled] = useState(!!endDate);
  const [startMonth, setStartMonth] = useState(startDate instanceof Date ? startDate.getMonth() : new Date().getMonth());
  const [startYear, setStartYear] = useState(startDate instanceof Date ? startDate.getFullYear() : new Date().getFullYear());
  const [endMonth, setEndMonth] = useState(endDate instanceof Date ? endDate.getMonth() : new Date().getMonth());
  const [endYear, setEndYear] = useState(endDate instanceof Date ? endDate.getFullYear() : new Date().getFullYear());


  // Helper function to get today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight
  const minDate = today;

  // Helper function to format dates
  const formatDate = (date) => {
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toISOString().slice(0, 10)
      : '';
  };


  // Get formatted date values for start and end dates fields
  const formattedStartValue = startDate ? formatDate(startDate) : '';
  const formattedEndValue = endDate ? formatDate(endDate) : formatDate(new Date());


  // Normalize date without timezone offset
  const normalizeDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {

      return new Date();  // Return a default valid date
    }
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  };

  // Handle date selection
  const handleDateSelection = (selectedDate, setDateCallback) => {
    // Check if the selected date is valid and not NaN
    if (selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      const adjustedDate = normalizeDate(selectedDate);
      setDateCallback(adjustedDate); // Update the state with the normalized date
    } else {
      setDateCallback(null); // Handle invalid date selection
    }
  };


  // Handle date selection for start and end dates
  const handleStartDateSelection = (value) => {
    if (value && value.start) {
      handleDateSelection(value.start, setStartDate);
      setStartVisible(false);
    }
    // Set start month and year value based on the selected date value.start object
    setStartMonth(value.start.getMonth());
    setStartYear(value.start.getFullYear());
  };


  // Handle date selection for end dates if setEndDateEnabled is true
  const handleEndDateSelection = (value) => {
    // Check if a valid date range is provided and if the start date exists
    if (value && value.start) {
      // Update the end date state using the handleDateSelection function
      handleDateSelection(value.start, setEndDate);
      setEndMonth(value.start.getMonth());
      setEndYear(value.start.getFullYear());
      // Hide the date picker after selecting the end date
      setEndVisible(false);
    }
  };

  const handleCheckboxChange = (checked) => {
    setSetEndDateEnabled(checked);
    if (!checked) {
      setEndDate(null); // Clear the end date if checkbox is unchecked
    } else {
      if (!endDate) {
        setEndDate(new Date()); // Or any other default value
      }
    }
  };


  // useEffect hook to update the setEndDateEnabled state when the endDate prop changes
  useEffect(() => {
    setSetEndDateEnabled(!!endDate);
  }, [endDate]);

  return (
      <Card>
        <Form onSubmit={() => { }}>   {/* Add onSubmit handler here */}
          <FormLayout>
            <Text variant="headingLg" as="h5">
              Active Dates
            </Text>
            <InlineStack blockAlign="start" gap="400">
              <Box minWidth="300px">
                <BlockStack gap="400">
                  <Popover  // Popover component for displaying the date picker
                    active={startVisible}   // Check if the date picker is visible
                    activator={             // Display the date picker activator
                      <TextField
                        label="Start Date"
                        value={formattedStartValue}
                        onFocus={() => setStartVisible(true)}
                        onChange={() => { }}
                      />
                    }
                    onClose={() => setStartVisible(false)}  // Close the date picker
                  >
                    <DatePicker   // Display the date picker
                      month={startMonth}
                      year={startYear}
                      onChange={handleStartDateSelection}
                      selected={startDate}
                      onMonthChange={(month, year) => {
                        setStartMonth(month);
                        setStartYear(year);
                      }}
                      disableDatesBefore={minDate} // Disable previous dates
                    />
                  </Popover>
                  {/* Checkbox component for setting the end date */}
                  <Checkbox
                    label="Set End Date"
                    checked={setEndDateEnabled}
                    onChange={handleCheckboxChange}
                  />
                </BlockStack>
              </Box>
              {/* Display the end date picker if setEndDateEnabled is true */}
              {setEndDateEnabled && (
                <Box minWidth="300px">
                  <Popover
                    active={endVisible}
                    activator={
                      <TextField
                        label="End Date"
                        value={formattedEndValue}
                        onFocus={() => setEndVisible(true)}
                        onChange={() => { }}

                      />
                    }
                    onClose={() => setEndVisible(false)}
                  >
                    {/* Display the End Date Date-picker */}
                    <DatePicker
                      month={endMonth}
                      year={endYear}
                      onMonthChange={(month, year) => {
                        setEndMonth(month);
                        setEndYear(year);
                      }}
                      onChange={handleEndDateSelection}
                      selected={endDate}
                      disableDatesBefore={minDate} // Disable previous dates
                    />
                  </Popover>
                </Box>
              )}
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
  );
}