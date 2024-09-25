import { create } from "domain";
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
        const GET_BUNDLE_MUTATION = QL.GET_BUNDLE_MUTATION.replace("$ID", "gid://shopify/Product/" + id);
        const product = await admin.graphql(GET_BUNDLE_MUTATION);
        //const productJson = await product.json();
        const productJson = await product.json();      
        return productJson.data.product
    },
    createBundle: async function (request, data) {
        console.log('createBundle--------------------------------------------')
        const { admin } = await authenticate.admin(request);
        const productData = await admin.graphql(
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
        return productData
    },

    updateBundle: async function (request, data) {
        try {
            console.log('updateBundle --------------------------------------------', data)
        const { admin } = await authenticate.admin(request);
        const productData = await admin.graphql(
            QL.UPDATE_BUNDLE_MUTATION, {
            "variables": {
                "input": {
                    "id": data.bundleId,
                    "title": data.bundleName,
                    "bodyHtml": data.description,
                    "metafields": [{
                            "namespace": "oscp",
                            "key": "fbtBundle",
                            "id": data.metaId,
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
                        }]
                }
            }
        }
        );
        console.log('updateBundle --------------------------------------------', JSON.stringify(productData))
        return productData   
        } catch (error) {
            console.log('updateBundle --------------------------------------------', error)
        }
        
    },
    setProduct: async function (request, data, cartItemsMedia) {
        if (data.bundleId == '') {
            return this.createBundle(request, data)
        } else {
            return this.updateBundle(request, data)
        }
    }
}