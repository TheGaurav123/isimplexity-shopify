import axios from 'axios'

export const activatePlan = async (payload) => {
    const url = `https://api-stage.isimplexity.com/api/v1/shopify/purchase-plan-by-iccid`

    const response = await axios.post(url, payload)

    return response
}