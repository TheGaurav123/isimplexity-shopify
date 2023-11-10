import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "./shopify.js";

const CREATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
      }
    }
  }
`;

export default async function productCreator(
  session,
  payload
) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    payload.map(async (val) => {
      await client.query({
        data: {
          query: CREATE_PRODUCTS_MUTATION,
          variables: val
        },
      });
    })
  }
  catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
