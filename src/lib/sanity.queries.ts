// GROQ Queries for Sanity CMS

// Fetch all hero slides in order (from homePage singleton)
export const heroSlidesQuery = `
  *[_type == "homePage"][0].heroSlides {
    _key,
    title,
    subtitle,
    "image": {
      "url": image.asset->url,
      "alt": title
    },
    "mobileImage": {
      "url": mobileImage.asset->url,
      "alt": title
    },
    "ctaText": ctaText,
    "ctaLink": ctaLink
  }
`;

// Fetch all products with optional filtering
export const allProductsQuery = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    "title": name,
    "slug": slug.current,
    description,
    benefitHeadline,
    price,
    "comparePrice": compareAtPrice,
    category->{
      name,
      "slug": slug.current
    },
    tags,
    "images": images[]{
      _key,
      "url": asset->url,
      "alt": alt
    },
    isNew,
    "isSale": isOnSale,
    "stock": inventory,
    rating,
    reviewCount,
    ritualType,
    sku,
    variants,
    weight,
    dimensions
  }
`;

// Fetch single product by slug
export const productBySlugQuery = (slug: string) => `
  *[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    "title": name,
    "slug": slug.current,
    description,
    benefitHeadline,
    price,
    "comparePrice": compareAtPrice,
    category->{
      name,
      "slug": slug.current
    },
    tags,
    "images": images[]{
      _key,
      "url": asset->url,
      "alt": alt
    },
    isNew,
    "isSale": isOnSale,
    "stock": inventory,
    rating,
    reviewCount,
    ritualType,
    sku,
    variants,
    weight,
    dimensions,
    metaTitle,
    metaDescription
  }
`;

// Fetch featured products
export const featuredProductsQuery = `
  *[_type == "product" && (isNew == true || isOnSale == true || isBestSeller == true)] | order(_createdAt desc) [0...4] {
    _id,
    "title": name,
    "slug": slug.current,
    description,
    benefitHeadline,
    price,
    "comparePrice": compareAtPrice,
    category->{
      name,
      "slug": slug.current
    },
    tags,
    "images": images[]{
      _key,
      "url": asset->url,
      "alt": alt
    },
    isNew,
    "isSale": isOnSale,
    "stock": inventory,
    ritualType
  }
`;

// Fetch all retreats
export const retreatsQuery = `
  *[_type == "retreat"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    duration,
    location,
    price,
    "images": images[]{
      _key,
      "url": asset->url,
      "alt": alt
    },
    features
  }
`;

// Fetch Blog Posts
export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    author->{
      name,
      "image": image.asset->url
    },
    "mainImage": mainImage.asset->url,
    excerpt,
    publishedAt
  }
`;

// Fetch all categories with subcategories (only published, not in releases)
export const allCategoriesQuery = `
  *[_type == "category" && !(_id match "drafts.*") && !(_id match "versions.*")] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    subCategories,
    categorySegments,
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`;

// Fetch single category by slug
export const categoryBySlugQuery = (slug: string) => `
  *[_type == "category" && slug.current == "${slug}"][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image.asset->url,
    subCategories,
    categorySegments,
    metaTitle,
    metaDescription
  }
`;

// Fetch full product detail by slug (for product detail page)
export const productDetailQuery = (slug: string) => `
  *[_type == "product" && slug.current == "${slug}"][0] {
    _id,
    "title": name,
    "slug": slug.current,
    sku,
    description,
    price,
    "comparePrice": compareAtPrice,
    "stock": inventory,
    "images": images[]{
      _key,
      "url": asset->url,
      "alt": alt
    },
    "category": category->{
      name,
      "slug": slug.current
    },
    subCategory,
    segments,
    ritualType,
    isNew,
    "isSale": isOnSale,
    isBestSeller,
    tags,
    metaTitle,
    metaDescription,
    benefitHeadline,
    sections[] {
      title,
      layout,
      content,
      listItems,
      ingredients[] {
        name,
        scientificName,
        sanskritName,
        benefits,
        description
      }
    }
  }
`;

// Fetch related products by category (excluding current product)
export const relatedProductsQuery = (categorySlug: string, excludeId: string) => `
  *[_type == "product" && category->slug.current == "${categorySlug}" && _id != "${excludeId}"][0...8] {
    _id,
    "title": name,
    "slug": slug.current,
    price,
    "comparePrice": compareAtPrice,
    "image": images[0].asset->url
  }
`;
// Fetch all rituals
export const ritualsQuery = `
  *[_type == "ritual"] | order(order asc) {
    _id,
    name,
    sanskritName,
    "slug": slug.current,
    subtitle,
    description,
    "image": image.asset->url,
    benefits,
    steps,
    frequency,
    temperature,
    "products": products[]->{
      _id,
      "title": name,
      "slug": slug.current,
      price,
      "image": images[0].asset->url
    }
  }
`;
