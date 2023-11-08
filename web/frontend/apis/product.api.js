import axios from 'axios'
import { AuthHeaderService } from '../services/auth-header.service'

const getProducts = async (pageNo = 0, pageSize = 10) => {
    const transactionUrl = `https://api-stage.isimplexity.com/api/v2/plans?pageSize=${pageSize}&pageNo=${pageNo}`
    const response = await axios
        .get(transactionUrl, { headers: AuthHeaderService })
        .then(res => res.data)
        .catch(err => console.error('Error while getting products', err))

    return response
}

const createShopifyProduct = async (payload) => {
    const transactionUrl = `https://isimplexity.myshopify.com/admin/api/2023-10/products.json`

    await axios.post(transactionUrl, payload, { headers: AuthHeaderService })
}

export {
    getProducts,
    createShopifyProduct
}