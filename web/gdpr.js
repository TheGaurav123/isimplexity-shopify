import { DeliveryMethod } from "@shopify/shopify-api";
import { VENDOR_NAME } from "./constants/index.js";
import { activatePlan } from "./api/plan.api.js";
import shopify from './shopify.js'


/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  ORDERS_PAID: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shopifyDomain, body) => {
      const payload = JSON.parse(body)
      const vendor = payload.line_items[0].vendor
      console.log('-------------- Order Generated -------------')

      try {
        if (vendor === VENDOR_NAME) {
          const apiPayload = {
            ICCID: payload.line_items[0].properties[0].value,
            productName: payload.line_items[0].title,
            shopifyDomain,
            endUser: {
              name: payload.billing_address.name,
              email: payload.customer.email,
              phoneNumber: payload.billing_address.phone,
              address: payload.billing_address.address1,
              city: payload.billing_address.city,
              state: payload.billing_address.province,
              zipcode: payload.billing_address.zip
            }
          }
          await activatePlan(apiPayload)
          console.log('------- Plan Purchased Successfully ---------')
        }
      }
      catch (error) {
        console.log('************* Error while activating plan ***********')
        console.error(error.response.data.message)
      }
    },
  },
};
