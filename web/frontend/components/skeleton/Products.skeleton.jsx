import React from 'react'
import {
  SkeletonPage,
  Layout,
  LegacyCard,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
} from '@shopify/polaris';

const ProductsSkeleton = () => {
  return (
    <Layout>
      <Layout.Section>
        <LegacyCard sectioned>
          <TextContainer>
            <SkeletonDisplayText size="medium" />
            <SkeletonBodyText />
          </TextContainer>
        </LegacyCard>
      </Layout.Section>
    </Layout>
  )
}

export default ProductsSkeleton