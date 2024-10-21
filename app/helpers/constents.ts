export const constents = {
   subscription_plans: [{
    name: "Basic",
    price: 0,
    description: "Free starter",
    action: "",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5"]
   },{
    name: "Monthly subscription",
    price: 4.99,
    description: "Subscribe to monthly subscription and get 24 x 7 support",
    action: "/app/subscriptions?plan=monthly",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5", "24 x 7 support"]
   },{
    name: "Annual subscription",
    price: 49.99,
    description: "Subscribe to annual subscription and save up to $9.98 per year",
    action: "/app/subscriptions?plan=annual",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5", "24 x 7 support"]
   }] 
}