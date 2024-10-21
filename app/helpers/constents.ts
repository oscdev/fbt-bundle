export const constents = {
   subscription_plans: [{
    name: "Basic",
    price: 0,
    description: "Free starter",
    action: "/app/subscriptions?plan=free-starter",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5"]
   },{
    name: "Monthly subscription",
    price: 4.99,
    description: "Monthly subscription",
    action: "/app/subscriptions?plan=monthly",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5"]
   },{
    name: "Annual subscription",
    price: 49.99,
    description: "Annual subscription",
    action: "/app/subscriptions?plan=annual",
    features: ["Features 1", "Features 2", "Features 3", "Features 4", "Features 5"]
   }] 
}