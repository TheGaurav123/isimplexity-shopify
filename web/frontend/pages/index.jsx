import React, { useEffect, useState } from 'react'
import ProductsCard from '../components/ProductsCard'
import { Frame, Loading, Page, Pagination, Text, Button, Modal, Layout, VerticalStack } from '@shopify/polaris'
import { ArrowRightMinor, ExitMajor } from '@shopify/polaris-icons'
import { getProducts } from '../apis/product.api'
import { useAuthenticatedFetch } from '../hooks'

const index = () => {
  const [loading, setLoading] = useState({
    page: true,
    confirmBtn: false
  })
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0)
  const [cartProducts, setCartProducts] = useState([])
  const [products, setProducts] = useState([])
  const fetch = useAuthenticatedFetch()

  const handleAddProducts = (product) => {
    setCartProducts([...cartProducts, product])
  }

  const handleRemoveProducts = (productId) => {
    const updatedItems = cartProducts.filter((val) => val._id !== productId)
    setCartProducts(updatedItems)
  }

  const calculateCartPrice = () => {
    const price = cartProducts.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
    return parseFloat(price).toFixed(2)
  }

  const handleFinalizeCheckout = async () => {
    setLoading({ ...loading, confirmBtn: true })
    const payload = cartProducts.map(val => {
      const { _id, productName, price, productId } = val
      return {
        input: {
          // id: _id,
          title: productName,
          variants: [
            {
              price
              // productId
            }
          ]
        }
      }
    })

    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    })

    setLoading({ ...loading, confirmBtn: false })
    setIsModalVisible(false)
    setCurrentPage(0)
  }

  useEffect(() => {
    const getProduct = async () => {
      setLoading({ ...loading, page: true })
      const { result } = await getProducts(currentPage)
      setProducts(result)
      setLoading({ ...loading, page: false })
    }
    getProduct()
  }, [currentPage])

  return (
    <Page
      title='Products'
      primaryAction={
        cartProducts.length > 0 &&
        <Button
          primary
          onClick={() => setIsModalVisible(true)}
          icon={ArrowRightMinor}>Proceed</Button>
      }>
      {loading.page && <Loading />}
      {
        products.map((val) => {
          const { productName, productId, speed, zone, Operator, usageDataConverted, validityDays, network, price, currency, _id } = val
          return (
            <ProductsCard
              cartProducts={cartProducts}
              key={_id}
              props={{
                _id,
                productName,
                productId,
                speed,
                zone,
                Operator,
                usageDataConverted,
                network,
                validityDays,
                price,
                currency
              }}
              onClick={handleAddProducts}
              onRemove={handleRemoveProducts}
            />
          )
        })
      }
      <Pagination
        hasPrevious
        onPrevious={() => {
          setCurrentPage(currentPage === 0 ? 0 : currentPage - 1)
        }}
        hasNext
        onNext={() => {
          setCurrentPage(currentPage + 1)
        }}
        label={currentPage + 1}
      />
      <Modal
        open={isModalVisible}
        title="Add To Products"
        onClose={() => setIsModalVisible(false)}
        primaryAction={{
          content: 'Confirm',
          loading: loading.confirmBtn,
          onAction: handleFinalizeCheckout,
        }}
        secondaryActions={{
          content: 'Cancel',
          onAction: () => setIsModalVisible(false)
        }}
      >
        <Modal.Section>
          <Layout>
            <Layout.Section>
              <VerticalStack>
                <Text variant='headingMd'>Total Items: {cartProducts.length}</Text>
              </VerticalStack>
              <VerticalStack>
                <Text variant='headingMd'>Total Price: $ {calculateCartPrice()}</Text>
              </VerticalStack>
            </Layout.Section>
          </Layout>
        </Modal.Section>
      </Modal>
    </Page>
  )
}

export default index