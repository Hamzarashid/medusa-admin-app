import { defineConfig , Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'
const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}


console.log(`Database URL: ${process.env.DB_URL}`)


export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DB_URL,
    databaseDriverOptions:{
      connection:{
        ssl:{
          rejectUnauthorized: false,
        }
      }
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  


  plugins: [
    {
      resolve: "@rsc-labs/medusa-store-analytics-v2",
      options: {}
    }, 

    {
      resolve: "@rsc-labs/medusa-wishlist",
      options: {}
    },
    {
      resolve: `@rsc-labs/medusa-documents-v2`,
      options: {
        document_language: 'en'
      }
    },
    {
      resolve: "@rsc-labs/medusa-products-bought-together-v2",
      options: {}
    }
],

  modules: [
    //Email/pass auth
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          // other providers...
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // options...
            },
          },
        ],
      },
    },


    // Stripe Payment
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/payment-stripe',
            id: 'stripe',
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },

    // Mollie Payment
    {
      resolve: "@medusajs/payment",
      options: {
        providers: [
          // ... other providers
          {
            resolve: "@variablevic/mollie-payments-medusa/providers/mollie",
            id: "mollie",
            options: {
              apiKey: process.env.MOLLIE_API_KEY,
              redirectUrl: process.env.MOLLIE_REDIRECT_URL,
              medusaUrl: process.env.MEDUSA_URL,
            },
          },
        ],
      },
    },
    //  Store Analytics
    {
      resolve: "./modules/store-analytics"
    },
  //  Wishlist
    {
      resolve: "./modules/wishlist",
      options: {
        jwtSecret: 'supersecret'
      }
    },
  // PDF Documents
    {
      resolve: `./modules/documents`,
      options: {
        document_language: 'en'
      }
    },

     // Products Bought Together
    {
      resolve: './modules/products-bought-together',
      options: {},
    },


    // Resend for Email Notifications
     {
      resolve: "@medusajs/notification",
      options: {
        providers: [
          // ...
          {
            resolve: "./src/modules/email-notifications",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM,
            },
          },
        ],
      },
    },

    

    // // ✅ Webhooks
    // {
    //   resolve: '@lambdacurry/medusa-webhooks',
    //   options: {
    //     // add your destinations
    //   },
    // },

    // Algolia Search
    {
      resolve: "./src/modules/algolia",
      options: {
        appId: process.env.ALGOLIA_APP_ID!,
        apiKey: process.env.ALGOLIA_API_KEY!,
        productIndexName: process.env.ALGOLIA_PRODUCT_INDEX_NAME!,
      },
    },

  ],
})
