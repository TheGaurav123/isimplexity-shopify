import React, { useEffect, useState } from 'react'
import { Button, Layout, LegacyCard, Text, Tooltip } from '@shopify/polaris'
import { CartMajor, DeleteMinor } from '@shopify/polaris-icons'

const ProductsCard = ({ onClick, onRemove, props, cartProducts }) => {
  const { AnnotatedSection, Section } = Layout
  const [isButtonChecked, setIsButtonChecked] = useState(false)
  const {
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
  } = props

  const handleOnClick = () => {
    setIsButtonChecked(e => !e)
    if (isButtonChecked) {
      onRemove(_id)
    }
    else {
      onClick(props)
    }
  }

  useEffect(() => {
    const handleCardSelection = () => {
      const getItem = cartProducts.filter((val) => val._id === _id)
      if (getItem.length > 0) {
        setIsButtonChecked(true)
      }
      else {
        setIsButtonChecked(false)
      }
    }
    handleCardSelection()
  }, [])

  const validityText = validityDays === 1 ? 'Day' : (validityDays === 30 ? 'Month' : 'Year')

  return (
    <LegacyCard
      title={`${productName}-${zone} (${speed || '4G'})`}
      sectioned
    >
      <Layout>
        <Section>
          <Text variant='bodyLg' color='subdued'>Operator: {Operator}</Text>
        </Section>
        <Section>
          <Text variant='bodyLg' color='subdued'>Network: {network}</Text>
        </Section>
        <Section>
          <Text variant='bodyLg' color='subdued'>Data: {usageDataConverted.value} {usageDataConverted.format}</Text>
        </Section>
      </Layout>
      <Layout>
        <AnnotatedSection >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip content={`$${price} for ${validityDays} Days`} dismissOnMouseOut>
              {
                isButtonChecked ?
                  <Button
                    onClick={handleOnClick}
                    pressed
                    size='large'
                    icon={DeleteMinor}
                  >${price}/{validityText}</Button>
                  :
                  <Button
                    onClick={handleOnClick}
                    primary
                    size='large'
                    icon={CartMajor}
                  >${price}/{validityText}</Button>
              }
            </Tooltip>
          </div>
        </AnnotatedSection>
      </Layout>
    </LegacyCard>
  )
}

export default ProductsCard