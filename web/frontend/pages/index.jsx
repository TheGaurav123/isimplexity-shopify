import React, { useCallback, useEffect, useState } from 'react'
import ProductsCard from '../components/ProductsCard'
import { ActionList, Frame, Loading, Page, Pagination, TopBar, Icon, Text, Tooltip, Button, Modal, Layout, VerticalStack } from '@shopify/polaris'
import { CartMajor, ArrowRightMinor } from '@shopify/polaris-icons'
import { getProducts } from '../apis/product.api'
import { Logo } from '../assets'
import axios from 'axios'

const index = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [cartProducts, setCartProducts] = useState([])
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleAddProducts = (product) => {
    setCartProducts([...cartProducts, product])
  }

  const handleRemoveProducts = (productId) => {
    const updatedItems = cartProducts.filter((val) => val._id !== productId)
    setCartProducts(updatedItems)
  }

  const handleSearchResultsDismiss = useCallback(() => {
    setIsSearchActive(false);
    setSearchValue('');
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    setIsSearchActive(value.length > 0);
  }, []);

  const logo = {
    topBarSource: Logo,
    width: 40,
    url: '/',
    accessibilityLabel: 'Spenza',
  };

  const searchResultsMarkup = (
    <ActionList
      items={[{ content: 'Shopify help center' }, { content: 'Community forums' }]}
    />
  );

  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchValue}
      placeholder="Search"
      showFocusBorder
    />
  );

  const secondaryMenuMarkup = (
    <Tooltip dismissOnMouseOut content={`Total Products: ${cartProducts.length}`}>
      <TopBar.Menu
        activatorContent={
          <span style={{ display: 'flex', gap: 10 }}>
            <Icon
              source={CartMajor}
              color='primary'
            />
            <Text>{cartProducts.length}</Text>
          </span>
        }
      />
    </Tooltip>
  );

  const topBarMarkup = (
    <TopBar
      searchResultsVisible={isSearchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      secondaryMenu={secondaryMenuMarkup}
    />
  );

  const handleCheckout = () => {
    setIsModalVisible(true)
    console.log('Handle Add product called', cartProducts)
  }

  const calculateCartPrice = () => {
    const price = cartProducts.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
    return parseFloat(price).toFixed(2)
  }

  const handleFinalizeCheckout = async () => {
    const response = await fetch("/api/products/create");
    console.log(response)
  }

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true)
      const { result } = await getProducts(currentPage)
      setProducts(result)
      setIsLoading(false)
    }
    getProduct()
  }, [currentPage])

  return (
    <>
      <Frame
      // logo={logo}
      // topBar={topBarMarkup}
      >
        {isLoading && <Loading />}
        <Page
          title='Products'
          primaryAction={
            cartProducts.length > 0 &&
            <Button
              primary
              onClick={handleCheckout}
              icon={ArrowRightMinor}>Proceed</Button>
          }>
          {
            products.map((val) => {
              const { productName, speed, zone, Operator, usageDataConverted, validityDays, network, price, currency, _id } = val
              return (
                <ProductsCard
                  cartProducts={cartProducts}
                  key={_id}
                  props={{
                    _id,
                    productName,
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
        </Page>
      </Frame>
      <Modal
        open={isModalVisible}
        title="Add To Products"
        onClose={() => setIsModalVisible(false)}
        primaryAction={{
          content: 'Confirm',
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
    </>
  )
}

export default index