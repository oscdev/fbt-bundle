import { json } from "stream/consumers";
import { QL } from "~/helpers/graph-ql";
import { authenticate } from "~/shopify.server";

export const bundle = {

    getProducts: async function (request) {
        const { admin } = await authenticate.admin(request);
        const products = await admin.graphql(
            QL.GET_BUNDLES_MUTATION            
        );
        const productsJson = await products.json(); 

        return productsJson.data.products.edges
    },

    getProduct: async function (request, id) {
        const { admin } = await authenticate.admin(request);
        const GET_BUNDLE_MUTATION = QL.GET_BUNDLE_MUTATION.replace("$ID", "gid://shopify/Product/"+id);
        const product = await admin.graphql(GET_BUNDLE_MUTATION);
        const productJson = await product.json();      
        return productJson.data.product
    },

    setProduct: async function (request, data) {
        const { admin } = await authenticate.admin(request);
        const shopData = await admin.graphql(
            QL.CREATE_BUNDLE_MUTATION,
            {
                variables: {
                    "input": {
                        "title": data.bundleName,
                        "bodyHtml": data.description,
                        "metafields": [{
                            "namespace": "oscp",
                            "key": "fbtBundle",
                            "type": "json",
                            "value": JSON.stringify({
                                "expand": {
                                    "expandedCartItems": data.expandedCartItems,
                                    "globalPriceRules": data.globalPriceRules,
                                    "conditions": {
                                        "customer": data.customer,
                                        "minPurchasableItem": null
                                    }
                                },
                                "merge": null
                            })
                        }, {
                            "namespace": "oscp",
                            "key": "fbtSearchable",
                            "type": "single_line_text_field",
                            "value": "searchable"
                        }],
                    }
                },
            }
        );
        return shopData
    }
}