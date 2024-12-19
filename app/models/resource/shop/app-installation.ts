import { QL } from "../../../helpers/graph-ql.js";
const USE_ONLINE_TOKENS = false;

// Create transporter only onc
export const modelAppInstallation = {
    
    getshop: async function (admin) {
		try {
			const segment = await admin.graphql(QL.SHOP);
			const segmentJson = await segment.json();
			const shopDetails = segmentJson.data.shop;			
			return segmentJson.data.shop;
		} catch (error) {
			console.warn("setAppStatus Error", JSON.stringify(error));
		}
	}
}