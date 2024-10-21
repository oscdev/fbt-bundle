import { modelShopSettings } from "../models/api/settings";

export const settings = {

    getAppStatus: async function (admin) {
        const appStatus = await modelShopSettings.getAppStatus(admin);
        return (appStatus == 'true') ? true : false
    },

    setAppStatus: async function (admin, status) {
        const appStatus = await modelShopSettings.setAppStatus(admin, status);
        return (appStatus == 'true') ? true : false
    },

    shopDetail : async function (admin) {
       const shopdata = await modelShopSettings.shopDetail(admin);
       return shopdata;
   },

    getThemeStatus: async function (admin, session) {
        const theme = await modelShopSettings.getThemeStatus(admin, session);
        return theme;
    },

    getThemes: async function (ids, request) {
        const theme = await modelShopSettings.requestOperation(ids, request);
        return theme;
    },

    checkTheme: async function (ids, request) {
        const theme = await modelShopSettings.requestOperation(ids, request);
        return theme;
    },

    setBundleSearchableDefination: async function (admin) {
        const def = await modelShopSettings.setBundleSearchableDefination(admin);
        return def;
    },
    cartTransformCreate: async function (admin) {
        const trans = await modelShopSettings.cartTransformCreate(admin);
        return trans;
    }
}