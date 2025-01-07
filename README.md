# OSCP Bundle & Upsell App

## Description

The OSCP Bundle & Upsell App offers a user-friendly interface that allows users to add the related products on the Product page.

## Requirements

The Node app template comes with the following out-of-the-box functionality:

- You must have installed Node.js 18.20.4 or higher.
- You must have npm version 10.7.0 or higher.
- You must have installed Shopify CLI version 3.61.2 or higher
- You must have ngrok installed to run the App on the local system
- Shopify-specific tooling:
  - AppBridge
  - Polaris
  - Webhooks
  - Rest API
  - GraphQL API
  - Theme App Extensions

## Documentation Links

*App Document*:-

https://docs.google.com/document/d/1dH9DVPhIhu1g-B5aSzfkcuAhRGvwLqQ6u5CD5nqwj9Y/edit

*Json Schema*:-

https://docs.google.com/document/d/1VzmCTKVq-ZE_wR-Ge-bzhBjIuf7mbMwXxOgx8RNKyVg/edit

*Minify JS And CSS Doc*:-

https://docs.google.com/document/d/1vZzoHf1700nV2RAWv0sF9aFmDwTT2MYIoLZ_zFQZWOw/edit

## Installation

*Installation on Development*: 

    Clone the Project from git Repository
    Run command:-git clone (add copy of SSH path)

    Inside the project root directory install npm modules.
    Run command:- npm install

    To run the App in project root directory.
    run command:- npm run dev
    It will ask to select the organization on which Shopify Partner Account is associated.
    Select a store to do development.
    Select an App or Create a new App to test the code display dashboard page. 

    To Deploy the extension.
    run command:- npm run deploy

## Deployment

*Deployment for Production on E2E Server*

    Set environment variables on server.
    export SHOPIFY_API_KEY=*******
    export SCOPES=******
    export HOST=*********
    export SHOPIFY_API_SECRET=************
    export PORT=****

# scopes
scopes = "read_customers,read_draft_orders,read_markets,read_products,read_script_tags,read_themes,write_cart_transforms,write_customers,write_draft_orders,write_markets,write_products,write_script_tags,write_themes"

# Server build
    To build the Shopify app using Remix
    Run Command:- npm run build 

    To starts the server to serve the Shopify app
    Run Command:- pm2 start npm --name "****" -- run start                  

    To kill pm2 service
    Run Command:- pm2 kill -p 0

    To Check pm2 status
    Run Command:- pm2 status

    To check pm2 logs
    Run Commands:- pm2 logs

# Connect to database

This template uses Prisma to store session data, by default using an SQLite database. The database is defined as a Prisma schema in prisma/schema.prisma.

## Tech Stack

This template uses [Remix](https://remix.run). The following Shopify tools are also included to ease app development:

- [Shopify App Remix](https://shopify.dev/docs/api/shopify-app-remix) provides authentication and methods for interacting with Shopify APIs.
- [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge) allows your app to seamlessly integrate your app within Shopify's Admin.
- [Polaris React](https://polaris.shopify.com/) is a powerful design system and component library that helps developers build high quality, consistent experiences for Shopify merchants.
- [Webhooks](https://github.com/Shopify/shopify-app-js/tree/main/packages/shopify-app-remix#authenticating-webhook-requests): Callbacks sent by Shopify when certain events occur
- [Polaris](https://polaris.shopify.com/): Design system that enables apps to create Shopify-like experiences
- [Shopify API library](https://github.com/Shopify/shopify-node-api) adds OAuth to the Express backend. This lets users install the app and grant scope permissions.

This template combines a number of third party open-source tools:

- [Express](https://expressjs.com/) builds the backend.
- [React Router](https://reactrouter.com/) is used for routing. We wrap this with file-based routing.
- [React Query](https://react-query.tanstack.com/) queries the Admin API.