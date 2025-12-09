// app/products/[slug]/metadata.js

export async function generateMetadata({ params }) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await fetch(
      `${baseUrl}/api/products/slug/${params.slug}`,
      { cache: 'no-store' }
    );

    const data = await response.json();

    if (!data.success || !data.data) {
      return { title: 'Không tìm thấy sản phẩm' };
    }

    const product = data.data;

    const canonicalUrl = `${baseUrl}/products/${product.slug}`;

    return {
      title: product.meta_title || product.name,
      description: product.meta_description || product.description,
      keywords: [
        product.name,
        product.category_name,
        'giải pháp CNTT',
        'phần mềm',
        'Tân Phong Technology',
        'Hải Phòng'
      ],
      alternates: {
        canonical: canonicalUrl
      },
      openGraph: {
        title: product.meta_title || product.name,
        description: product.meta_description || product.description,
        url: canonicalUrl,
        images: product.image_url
          ? [
              {
                url: product.image_url,
                width: 1200,
                height: 630,
                alt: product.name
              }
            ]
          : [],
        type: 'article',
        publishedTime: product.published_at,
        modifiedTime: product.updated_at
      },
      twitter: {
        card: 'summary_large_image',
        title: product.meta_title || product.name,
        description: product.meta_description || product.description,
        images: product.image_url ? [product.image_url] : []
      }
    };
  } catch (err) {
    console.error('Error generating metadata:', err);
    return { title: 'Sản phẩm' };
  }
}
