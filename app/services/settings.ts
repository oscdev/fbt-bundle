import { modelShopSettings } from "../models/api/settings";

export const settings = {

    getAppStatus: async function (request) {
        const appStatus = await modelShopSettings.getAppStatus(request);
        return (appStatus == 'true') ? true : false
    },

    setAppStatus: async function (admin, status) {
        const appStatus = await modelShopSettings.setAppStatus(admin, status);
        return (appStatus == 'true') ? true : false
    },

    getThemeStatus: async function (request) {
        const theme = await modelShopSettings.getThemeStatus(request);
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
    }
}