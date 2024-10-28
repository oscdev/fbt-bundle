export const constents = {
   theme_extension_blocks: [{
      blockName: "App Embeds",
      fileName: "config/settings_data.json",
      extesionHandle: "app-embed",
      description: "Enable/Disable OSCP Upsell and Cross Sell on App Embeds.",
      isMandatory: true,
      isEnabled: false,
      editorUri: "https://$shopUrl/admin/themes/$themeId/editor?context=apps&template=index&appEmbed=$uuid/app-embed",
      customizeSettings: {}
   }, {
      blockName: "Bundle Widget",
      fileName: "templates/product.json",
      extesionHandle: "fbt-bundle",
      description: "Enable/Disable layout design to display \"FBT Bundle\" section on the product detail page.",
      isMandatory: true,
      isEnabled: false,
      editorUri: "https://$shopUrl/admin/themes/$themeId/editor?template=product&addAppBlockId=$uuid/fbt-bundle&target=mainSection",
      customizeSettings: {}
   }, {
      blockName: "FBT Widget",
      fileName: "templates/product.json",
      extesionHandle: "frequently",
      description: "Enable/Disable layout design to display \"Frequently Bought Together\" section on the product detail page.",
      isMandatory: true,
      isEnabled: false,
      editorUri: "https://$shopUrl/admin/themes/$themeId/editor?template=product&addAppBlockId=$uuid/frequently&target=mainSection",
      customizeSettings: {}
   }],
   subscription_plans: [{
      name: "Basic",
      price: 0,
      description: "Free starter",
      action: "",
      features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5"]
   }, {
      name: "Monthly subscription",
      price: 4.99,
      description: "Subscribe to monthly subscription and get 24 x 7 support",
      action: "/app/subscriptions?plan=monthly",
      features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5", "24 x 7 support"]
   }, {
      name: "Annual subscription",
      price: 49.99,
      description: "Subscribe to annual subscription and save up to $9.98 per year",
      action: "/app/subscriptions?plan=annual",
      features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5", "24 x 7 support"]
   }]
}