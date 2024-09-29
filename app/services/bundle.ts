import { RestResources } from "@shopify/shopify-api/rest/admin/2024-07";
import { create } from "domain";
import { AdminApiContext } from "node_modules/@shopify/shopify-app-remix/dist/ts/server/clients";
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
    createBundle: async function (request, data, cartItemsMedia) {
        console.log('createBundle--------------------------------------------', JSON.stringify(cartItemsMedia))
        const { admin } = await authenticate.admin(request);
        const defaultVariants = [];
        for (let i = 0; i < data.expandedCartItems.length; i++) {
            for (let j = 0; j < cartItemsMedia.length; j++) {
                if (data.expandedCartItems[i].merchandiseId == cartItemsMedia[j].node.id.split('/').pop()) {
                    defaultVariants.push(cartItemsMedia[j].node.variants.edges[0].node.id)
                }
            }
            
        }
        console.log('defaultVariants--------------------------------------------', defaultVariants)

        const productData = await admin.graphql(
            QL.CREATE_BUNDLE_MUTATION,
            {
                variables: {
                    "input": {
                        "title": data.bundleName,
                        "bodyHtml": data.description,
                        "metafields": [{
                            "namespace": "oscp",
                            "key": "fbtBundleComponentReference",
                            "type": "list.variant_reference",
                            "value": JSON.stringify(defaultVariants)
                        },{
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
        const productJson = await productData.json();
        console.log("productJson",JSON.stringify(productJson));


        return productJson.data.productCreate.product
    },
    updateBundle: async function (request, data, cartItemsMedia) {
        try {
            console.log('cartItemsMedia --------------------------------------------', JSON.stringify(cartItemsMedia))
            console.log('updateBundleData --------------------------------------------', JSON.stringify(data))
            const defaultVariantsUpdate = [];
            for (let i = 0; i < data.expandedCartItems.length; i++) {
                for (let j = 0; j < cartItemsMedia.length; j++) {
                    if (data.expandedCartItems[i].merchandiseId == cartItemsMedia[j].node.id.split('/').pop()) {
                        defaultVariantsUpdate.push(cartItemsMedia[j].node.variants.edges[0].node.id)
                    }
                }
            
            }
            console.log('defaultVariantsUpdate--------------------------------------------', defaultVariantsUpdate)

            const { admin } = await authenticate.admin(request);
            const productData = await admin.graphql(
                QL.UPDATE_BUNDLE_MUTATION, {
                "variables": {
                    "input": {
                        "id": data.bundleId,
                        "title": data.bundleName,
                        "bodyHtml": data.description,
                        "metafields": [
                            {
                                "namespace": "oscp",
                                "key": "fbtBundleComponentReference",
                                "id": data.componentMetaId,
                                "type": "list.variant_reference",
                                "value": JSON.stringify(defaultVariantsUpdate)
                            },{
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

            const productJson = await productData.json();

            console.log('productJson --------------------------------------------', JSON.stringify(productJson))
            return productJson.data.productUpdate.product
        } catch (error) {
            console.log('updateBundle --------------------------------------------', error)
        }

    },
    setProduct: async function (request, data, cartItemsMedia) {
        if (data.bundleId == '') {
            return this.createBundle(request, data, cartItemsMedia)
        } else {
            return this.updateBundle(request, data, cartItemsMedia)
        }
    },
    unsetBundleAssociated: async function (request, removableItems) {
        const { admin } = await authenticate.admin(request);
        const unsetableObjects = [];
        for (let i = 0; i < removableItems.length; i++) {
            unsetableObjects.push({
                "key": "fbtBundleAssociated",
                "namespace": "oscp",
                "ownerId": removableItems[i]
            });
        }

        console.log('unsetableObjects =========', unsetableObjects)

        const unsetProductData = await admin.graphql(
            QL.UNSET_BUNDLE_ASSOCIATED_MUTATION, {
            "variables": {
                "metafields": unsetableObjects
            }
        }
        );
        console.log('unsetableObjects =========', unsetProductData)
        return unsetProductData
    },
    setBundleAssociated : async function (request, bundleData, savedResult) {
        //console.log("testing111",savedResult)
        const { admin } = await authenticate.admin(request);
        const setableObjects = [];
        for (let i = 0; i < bundleData.expandedCartItems.length; i++) {
            setableObjects.push({
                "key": "fbtBundleAssociated",
                "namespace": "oscp",
                "value": savedResult.handle,
                "type": "single_line_text_field",
                "ownerId": 'gid://shopify/Product/'+bundleData.expandedCartItems[i].merchandiseId
            });
        }

        const setProductData = await admin.graphql(
            QL.SET_BUNDLE_ASSOCIATED_MUTATION, {
            "variables": {
                "metafields": setableObjects
            }
        }
        );
       
        const setProductDataJson = await setProductData.json();
        console.log('setBundleAssociated ================', JSON.stringify(setProductDataJson))
        //return setProductData;
    }
}



