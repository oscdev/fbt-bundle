import { json } from "stream/consumers";
import { QL } from "~/helpers/graph-ql";
import { authenticate } from "~/shopify.server";

export const bundle = {

    getProducts: async function (request) {
        const { admin } = await authenticate.admin(request);
        const products = await admin.graphql(
            QL.GET_BUNDLE_MUTATION            
        );
        const productsJson = await products.json(); 

        return productsJson.data.products.edges
    },

    getProduct: async function (request) {
        return (true) ? true : false
    },

    setProduct: async function (request, data) {
        const { admin } = await authenticate.admin(request);
        const shopData = await admin.graphql(
            QL.CREATE_BUNDLE_MUTATION,
            {
                variables: {
                    "input": {
                        "title": data.bundleName,
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