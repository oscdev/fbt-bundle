import { Page, Layout, Frame, Button, LegacyCard, SkeletonThumbnail, SkeletonBodyText, Card, Text, InlineStack, BlockStack, Checkbox } from "@shopify/polaris";
import { BundleInfo, Preview, Resource, Discount, Customize, DatePickerSection } from "../components/Bundle/index";
import { Footer } from "../components/Footer.js";
import { cnf } from "../../cnf.js";

// Define the `bundle` component as a React functional component.
function bundle() {



  return (
    <Page
      title="Create bundle for Frequently Bought Together"
      primaryAction={{
        content: "Save",
        // disabled: !dirty,
        // onAction: () => {
        //   submit()
        // }
      }}
      backAction={{ content: "Settings", onAction: () => confirmExit() }}
    // secondaryActions={<Button
    //   disabled={(handle.value && Object.keys(resourcesInfo).length) ? false : true}
    //   onClick={() => showDeleteConfirm()}
    // >Delete</Button>}
    >
      <Frame>
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <BundleInfo />
              {/* <Resource 
                resources={resourcesData}
                resourcesInfo={resourcesInfo}
                onAddResources={onAddResources}
                addResources={addResources}
                editResources={editResources}
                removeResources={removeResources}
                onResourcesChange={onResourcesChange}
                 /> */}
              <Discount />
              <Customize />
              <DatePickerSection
            // startDate={startDateField.value}
            // setStartDate={startDateField.onChange}
            // endDate={endDateField.value}
            // setEndDate={endDateField.onChange}
          />
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Preview />
          </Layout.Section>

        </Layout>
        {/* <Confirmation
          isConfirm={isConfirmDelete}
          confirmMsg={confirmMsg}
          onConfirm={onConfirmDelete}
          onCancel={onConfirmCancel}
          returnData={null}
        />
        <Confirmation
          isConfirm={isConfirmExit}
          confirmMsg={confirmMsg}
          onConfirm={onConfirmExit}
          onCancel={onCancelExit}
          returnData={null}
        />*/}
        <Footer /> 
      </Frame>
    </Page>

  )
}

export default bundle
