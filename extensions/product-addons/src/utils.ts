export async function getProducts(key, productIDs) {
    return await getProductQuery(
      `{
        products(first: 5, query: "${key} ${productIDs}") {
          edges {
            node {
              id
              title
              handle
              featuredImage {
                url
              }
              variants(first: 3) {
                edges {
                  node {
                    id
                    title
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }`,
    );
  }
  
  
  async function getProductQuery(query) {
    const graphQLQuery = {
      query,
    };
  
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error("Network error");
    }
  
    return await res.json();
  }
  
  export async function getProductsMetafields(productId) {
    return await getProductMetafieldsQuery(
      `query Product($id: ID!) {
          product(id: $id) {
            metafield(namespace: "oscp", key:"cross") {
              value
              id
            }
          }
        }
      `,
      { id: productId }
    );
  }
  
  export async function getMedia(products) {
    let productIds = products.map(product => product.id); 
    // Adding 'id:' prefix to each product ID and joining with " OR "
    productIds = productIds.map(id => `id:${id}`).join(" OR ");
    return await getProductMetafieldsQuery(
      `{
        products(first: 10, query: "${productIds}") {
          edges {
            node {
              id
              featuredImage {
                  url
                }
              variants(first: 100) {
                edges {
                  node {
                    image {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }`
    );
  }
  
  
  export async function updateProductsMetafields(id, updateValues) {
    return await getProductMetafieldsQuery(
      `mutation SetMetafield($namespace: String!, $ownerId: ID!, $key: String!, $type: String!, $value: String!) {
            metafieldsSet(metafields: [{ownerId:$ownerId, namespace:$namespace, key:$key, type:$type, value:$value}]) {
            metafields {
                  id
                }
            userErrors {
              field
              message
              code
            }
        }
      }
      `,
      {
        ownerId: id,
        namespace: "oscp",
        key: "cross",
        type: "json",
        value: JSON.stringify(updateValues),
      }
    );
  }
  
  async function getProductMetafieldsQuery(query, variables) {
    const graphQLQuery = {
      query,
      variables,
    };
  
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error("Network error");
    }
  
    return await res.json();
  }
  