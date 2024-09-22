
export const QL = {
	// Define the specific mutation for creating products IDs and Store data in product metafields
	PRODUCT_IDS: `query {
      products(query: "$ids", first: 100) {
        edges {
          node {
            id
            title,
			handle
            metafield(namespace: "oscp", key: "cross") {
              value
            }
          }
        }
      }
    }`,
	// Define the specific mutation for creating products
	CREATE_PRODUCT_MUTATION: `mutation call($metafields: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafields) {
			metafields {
			  id
			}
			userErrors {
			  field
			  message
			}
		  }
	}`,
	// Define the bulk operation mutation query
	BULK_OPERATION_RUN_MUTATION: `mutation bulkOperationRunMutation($mutation: String!, $stagedUploadPath: String!) {
		bulkOperationRunMutation(mutation: $mutation, stagedUploadPath: $stagedUploadPath) {
		  userErrors {
			field
			message
		  }
		}
	}`,
	// GraphQL mutation to run a bulk operation query
	BULK_UPLOAD_STAGE_MUTATION: `mutation stagedUploadCreate($input:[StagedUploadInput!]!) {
		stagedUploadsCreate(input: $input){
		  stagedTargets{
			url
			resourceUrl
			parameters{
			  name
			  value
			}
		  }
		}
	}`,
	// GraphQL query to get app settings
	APP_SETTING_GET_MUTATION: `query {
		currentAppInstallation{
			id
			metafields(first: 100) {
				nodes{
					namespace
					key
					type
					value
				}
			}
		}
	}`,
	// GraphQL mutation to set app settings
	APP_SETTING_SET_MUTATION: `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
		metafieldsSet(metafields: $metafieldsSetInput) {
		  metafields {
			id
			namespace
			key,
			value
		  }
		  userErrors {
			field
			message
		  }
		}
	  }`,
	CREATE_BUNDLE_MUTATION: `mutation createProductMetafields($input: ProductInput!) {
		productCreate(input: $input) {
			product {
			id
			metafields(first: 3) {
				edges {
				node {
					id
					namespace
					key
					value
				}
				}
			}
			}
			userErrors {
			message
			field
			}
		}
	}`,
};