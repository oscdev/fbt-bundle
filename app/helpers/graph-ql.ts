
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
			metafield(namespace: "app_settings", key: "app_enabled") {
				value
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
			handle
			title
			variants(first: 100) {
                edges {
                    node {
                        id 
                        price
                    }
                }
            }
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
	SET_BUNDLE_SEARCHABLE_MUTATION: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
  metafieldDefinitionCreate(definition: $definition) {
    createdDefinition {
      id
      name
	  namespace
	  key
    }
    userErrors {
      field
      message
      code
    }
  }
}`,
	GET_BUNDLES_MUTATION: `query {
  products(first: 25, query: "metafields.oscp.fbtSearchable:searchable") {
    edges {
      node {
        id
        title
        handle
		metafield(namespace: "oscp", key: "fbtBundle") {
			value
			id
		}
      }
    }
  	
  }
}`,
	GET_BUNDLE_MUTATION: `query {
  product(id: "$ID") {
	id
    title
	handle
	status
	bodyHtml
	variants(first: 100) {
		edges {
			node{
				id 
				price
			}
		}
	}
    metafield(namespace: "oscp", key: "fbtBundle") {
	  value
	  id
	}
	components: metafield(namespace: "oscp", key: "fbtBundleComponentReference") {
		id
		value
	}
  }
}`,
	UPDATE_BUNDLE_MUTATION: `mutation UpdateProductWithNewMedia($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
		id
		handle
		title	
		bodyHtml
		variants(first: 100) {
            edges {
                node{
                	id 
                	price
                }
            }
        }
		metafield(namespace: "oscp", key: "fbtBundle") {
		value
		}
    }
    userErrors {
      field
      message
    }
  }
}`,
SET_BUNDLE_ASSOCIATED_MUTATION: `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      key
      namespace
      value
    }
    userErrors {
      field
      message
      code
    }
  }
}`,
UNSET_BUNDLE_ASSOCIATED_MUTATION: `mutation metafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {
  metafieldsDelete(metafields: $metafields) {
    deletedMetafields {
      ownerId
    }
    userErrors {
      field
      message
    }
  }
}`,
APP_CARTTRANSFORM_SET_MUTATION: `mutation {
  cartTransformCreate(
    functionId: "$FUNCTION_ID",
    blockOnFailure: false 
  ) {
    cartTransform {
      id
      functionId
    }
    userErrors {
      field
      message
    }
  }
}`,
UPDATE_BUNDLE_PRODUCT_PRICE:`mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
	productVariantsBulkUpdate(productId: $productId, variants: $variants) {
	  product {
		id
	  }
	  productVariants {
		id
		price
	  }
	  userErrors {
		field
		message
	  }
	}
  }`,
  SHOP_CURRENCY: `query {
	shop {
		name
		currencyCode
		currencyFormats {
			moneyInEmailsFormat
			moneyWithCurrencyInEmailsFormat
		}
	}
}`,
FETCH_PUBLICATIONS: `{
  publications(first: 10) {
    edges {
      node {
        id
        name
      }
    }
  }
}`,
PUBLICATIONS_MUTATION: `mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    publishable {
      resourcePublications(first:10){
        edges{
          node{
           publication{
            autoPublish
          }
          }
        }
      }      
    }
    userErrors {
      field
      message
    }
  }
}`,
GET_SUBSCRIPTIONS: `query {
  app(id: "gid://shopify/App/170736975873"){
    installation {
      launchUrl
      activeSubscriptions {
        id
        name
        createdAt
        returnUrl
        status
        currentPeriodEnd
        trialDays
        test
      }
    }
  }	
}`,
SHOP: `query shopInfo {
	shop {
	  id
	  name
	  url
	  myshopifyDomain
	  email
	  plan {
		displayName
		partnerDevelopment
		shopifyPlus
	  }
}
}`
};