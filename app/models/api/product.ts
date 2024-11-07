import { QL } from "../../helpers/graph-ql";
import { authenticate } from "~/shopify.server";


export const modelProduct = {
	//Get json data from graphql query call
	requestID: async function (ids, request) {
		try {
			const { admin } = await authenticate.admin(request);
			let productIds = ids.map(id => `id:${id}`);
			const SELECTED_FBT_PRODUCTS = QL.FBT_PRODUCTS.replace("$ids", productIds.join(" OR "));
			const responseData = await admin.graphql(SELECTED_FBT_PRODUCTS);
			const response = await responseData.json();
			return response.data.products.edges;
		} catch (error) {
			console.log("error 3", error);
		}
	},


	bulkImportMutation: async function (stagePath, request) {
		try {
			const { admin } = await authenticate.admin(request);
			return await admin.graphql(
				QL.BULK_OPERATION_RUN_MUTATION,
				{
					variables: {
						mutation: QL.CREATE_PRODUCT_MUTATION,
						stagedUploadPath: stagePath[0],
					}
				}
			);
		} catch (error) {
			console.error(error)
		}

	},


	stagedUploadCreate: async function (request) {
		try {
			const { admin } = await authenticate.admin(request);
			const runnerData = await admin.graphql(
				QL.BULK_UPLOAD_STAGE_MUTATION,
				{
					variables: {
						"input": [
							{
								"filename": "bulk_op_vars",
								"httpMethod": "POST",
								"mimeType": "text/jsonl",
								"resource": "BULK_MUTATION_VARIABLES"
							}
						]
					}
				}
			);
			const responseJson = await runnerData.json();
			return responseJson.data.stagedUploadsCreate.stagedTargets;
		} catch (error) {
			throw new Error('Error : ' + error)
		}
	},

}