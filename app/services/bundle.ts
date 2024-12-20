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

    getProduct: async function (admin, id) {
        //const { admin } = await authenticate.admin(request);
        const GET_BUNDLE_MUTATION = QL.GET_BUNDLE_MUTATION.replace("$ID", "gid://shopify/Product/" + id);
        const product = await admin.graphql(GET_BUNDLE_MUTATION);
        //const productJson = await product.json();
        const productJson = await product.json();
        return productJson.data.product
    },
    createBundle: async function (request, data, cartItemsMedia) {
        //console.log('cartItemsMedia--------------------------------------------', JSON.stringify(cartItemsMedia))
        console.log('data--------------------------------------------', JSON.stringify(data))
        
        const expandedCartItems = data.expandedCartItems;
        const bundlePrice = data.bundlePrice;
        console.log("bundlePrice", bundlePrice)

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
                                    },
                                    "config": {
                                        "labelOnCard": data.labelOnCard,
                                        "calculatePrice": data.calculatePrice
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

                        "claimOwnership": {
                            "bundles": true
                        }
                    }
                },
            }
        );
        const productJson = await productData.json();
    
        const productId = productJson.data.productCreate.product.id;
        const variantId = productJson.data.productCreate.product.variants.edges[0].node.id;

        // Call the updateProductPrice function to update the price
        await this.updateProductPrice(admin, productId, variantId, bundlePrice);
        await this.publishBundle(admin, productId);
        return productJson.data.productCreate.product
    },
    publishBundle : async function (admin, productId) {
        const publicationsQL = await admin.graphql(QL.FETCH_PUBLICATIONS);
        const publications = await publicationsQL.json();        
        const onlineStorePublication = publications.data.publications.edges.filter(edge => edge.node.name === 'Online Store')[0].node;
        

        const productPublicationsQL = await admin.graphql(
            QL.PUBLICATIONS_MUTATION,
            {
                variables: {
                    "id": productId,
                    "input": {
                        "publicationId": onlineStorePublication.id,
                    }
                }
            }
        );
        const productPublications = await productPublicationsQL.json(); 
    },
    //Separate function to update product price
    updateProductPrice : async function (admin, productId, variantId, bundlePrice) {
        return await admin.graphql(
            QL.UPDATE_BUNDLE_PRODUCT_PRICE,
            {
            variables: {
                "productId": productId,
                "variants": [
                {
                    "id": variantId,
                    "price": bundlePrice
                }
                ]
            }    
            });
    },

    updateBundle: async function (request, data, cartItemsMedia) {
        try {
            //console.log('cartItemsMedia --------------------------------------------', JSON.stringify(cartItemsMedia))
            console.log('updateBundleData --------------------------------------------', JSON.stringify(data))
            const expandedCartItems = data.expandedCartItems;
            const bundlePrice = data.bundlePrice;
        
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
                                    },
                                    "config": {
                                        "labelOnCard": data.labelOnCard,
                                        "calculatePrice": data.calculatePrice
                                    }
                                },
                                "merge": null
                            })
                        }],
                    }
                }
            }
            );

            const productJson = await productData.json();
        
            const productId = productJson.data.productUpdate.product.id;
            const variantId = productJson.data.productUpdate.product.variants.edges[0].node.id;
            
            //Call the updateProductPrice function to update the price
            await this.updateProductPrice(admin, productId, variantId, bundlePrice);
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



