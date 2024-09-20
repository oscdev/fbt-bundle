import { modelProduct } from '../models/api/product';
import { authenticate } from '../shopify.server';
import fs, { readFile, writeFile, promises, createReadStream } from "fs";
import { parseString } from 'xml2js';
import { execFile } from 'child_process';

export const bulkProduct = {
    //Get json data from model call
    requestID: async function (ids, request) {
        const bulkProductIds = await modelProduct.requestID(ids, request);
        // console.log("bulkProductIds",JSON.stringify(bulkProductIds))
        const jsonData = bulkProductIds.map(item => {
            const node = item.node;
            const relatedProducts = {
                id: node.id,
                title: node.title,
                handle: node.handle,
                crossProducts: null
            };
            // console.log("relatedProducts --===",relatedProducts)
            if (node.metafield && node.metafield.value) {
                const crossProducts = JSON.parse(node.metafield.value).crossProducts;
                // console.log("crossProducts --===",crossProducts)
                if (crossProducts && crossProducts.length > 0) {
                    relatedProducts.crossProducts = crossProducts.map(cp => {
                        return {
                            id: cp.id,
                            title: cp.title,
                            handle: cp.handle
                        };
                    });
                }
            }
            return relatedProducts;
        });
        return jsonData;
    },

    bulkFormOperation: async function (formRules, request) {
        const { session } = await authenticate.admin(request);
        const { shop } = session;
        const jsonData = [];

        // Parse the JSON string in productsJson
        const productsData = JSON.parse(formRules.productsJson);
        for (let i = 0; i < productsData.length; i++) {
            const { id, crossProducts } = productsData[i]; // Changed from productId to id as per the provided JSON structure

            if (!id || !crossProducts || !Array.isArray(crossProducts)) {
                continue; // Skip to the next iteration if the data is invalid
            }

            // Fetch existing metafield data using your requestID function
            const existingMetafield = await this.requestID([id], request);

            // Initialize mergedCrossProducts differently if existingMetafield is null
            let mergedCrossProducts;
            if (existingMetafield && existingMetafield[0] && existingMetafield[0].node.metafield) {
                const existingValue = JSON.parse(existingMetafield[0].node.metafield.value);
                mergedCrossProducts = {
                    'crossProducts': [
                        ...(existingValue.crossProducts || []),
                        ...crossProducts,
                    ],
                };
            } else {
                mergedCrossProducts = {
                    'crossProducts': crossProducts,
                };
            }

            // Create an array to store the cross products metafields
            const crossProductsMetafield = {
                "key": `cross`,
                "namespace": "oscp",
                "ownerId": `${id}`,
                "type": "json",
                "value": JSON.stringify(mergedCrossProducts)
            };

            // Add the product data to the jsonData array
            jsonData.push({
                "metafields": [crossProductsMetafield]
            });
        }

        const formRulesJSONL = jsonData.map((obj) => JSON.stringify(obj)).join('\n');

        writeFile(`${process.cwd()}/storage/upload/bulkform/${shop}.jsonl`, formRulesJSONL, async (err) => {
            if (err) {
                console.error('Error saving Data:', err);
                return { status: "failed", msg: "Data could not be saved" };
            }

            const stageInfo = await this.stagedUploadCreate(request);

            await this.sendAttachmentToStage(stageInfo, `${process.cwd()}/storage/upload/bulkform/${shop}.jsonl`, request);

            return { status: "ok", msg: "data saved" };
        });
    },


    /**
     * Purpose: This function is used to get the stage of storage googleapis
     * 
     * @returns object (EX: https://shopify-staged-uploads.storage.googleapis.com)
     */

    stagedUploadCreate: async function (request) {
        return await modelProduct.stagedUploadCreate(request)
    },


    bulkImportMutation: async function (stagePath, request) {
        return await modelProduct.bulkImportMutation(stagePath, request)
    },


    /**
      * Purpose: Add the file to be sent as an attachment to curl arguments and execute the curl command with the constructed arguments
      * Call the bulkImportMutation function with the parsed data
      * 
      * @returns Void
      */


    sendAttachmentToStage: async function (stageInfo, outputFilePath, request) {
        const $this = this;
        const curlCommand = 'curl';
        let curlArgs = []
        // Add verbose flag to curl arguments for debugging
        curlArgs.push('-v')

        // Add location and POST request options to curl arguments
        curlArgs.push('--location')
        curlArgs.push('--request')
        curlArgs.push('POST')
        curlArgs.push(stageInfo[0].url)

        // Add parameters to curl arguments
        for (var field of stageInfo[0].parameters) {
            curlArgs.push('-F')
            curlArgs.push(`${field.name}=${field.value}`)
        }

        // Add the file to be sent as an attachment to curl arguments
        curlArgs.push('-F')
        curlArgs.push(`file=@${outputFilePath}`)

        // Execute the curl command with the constructed arguments

        execFile(curlCommand, curlArgs, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing shell script: ${error}`);
                return;
            }

            // Process the XML output received from the curl command
            const xmlOutput = stdout;

            parseString(xmlOutput, async (error, result) => {
                if (error) {
                    console.error(`Error parsing XML: ${error.message}`);
                    return;
                }

                // console.log('xmlOutput result' , JSON.stringify(result));

                // Access the parsed XML data in the JavaScript object format
                const parsedData = result;

                // Call the bulkImportMutation function with the parsed data
                const bulkImportMutationData = await $this.bulkImportMutation(parsedData.PostResponse.Key, request);

                return bulkImportMutationData;
            });
        });
    },

}
