import { Product } from '@/types/products';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/all?language=he`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    const xml = generateGoogleMerchantFeed(products);
    
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400',
      }
    });
  } catch (error) {
    console.error('Feed error:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
function generateGoogleMerchantFeed(products: any[]): string {
  const items = products
    .filter(p => p.isAvailable)
    .map(p => generateFeedItem(p))
    .join('');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Effect Parquet</title>
    <link>${SITE_URL}</link>
    <description>Premium Flooring Products</description>
${items}
  </channel>
</rss>`;
}

function generateFeedItem(product: Product): string {
  const price = product.discount 
    ? (Number(product.price) * ((100 - product.discount) / 100)).toFixed(2)
    : Number(product.price).toFixed(2);
  
  const link = `${SITE_URL}/he/products/${encodeURIComponent(product.type)}/${product._id}`;
  const availability = product.isAvailable && product.stock > 0 ? 'in_stock' : 'out_of_stock';
  
  const additionalImages = product.images
    .slice(1, 10)
    .map((img: string) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
    .join('\n');

  return `    <item>
      <g:id>${escapeXml(product._id)}</g:id>
      <g:title><![CDATA[${cleanTitle(product.name)}]]></g:title>
      <g:description><![CDATA[${cleanDescription(product.detailedDescription || product.description)}]]></g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(product.images[0])}</g:image_link>
${additionalImages}
      <g:availability>${availability}</g:availability>
      <g:price>${price} ILS</g:price>
      <g:brand>Effect Parquet</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
      ${product.model ? `<g:mpn>${escapeXml(product.model)}</g:mpn>` : ''}
      <g:google_product_category>115</g:google_product_category>
      <g:product_type>${escapeXml(product.category)} &gt; ${escapeXml(product.type)}</g:product_type>
      ${product.color ? `<g:color>${escapeXml(product.color)}</g:color>` : ''}
      ${getSize(product) ? `<g:size>${escapeXml(getSize(product))}</g:size>` : ''}
      ${product.boxCoverage ? `<g:unit_pricing_measure>${product.boxCoverage} sqm</g:unit_pricing_measure>` : ''}
    </item>
`;
}

function escapeXml(unsafe: string | number): string {
  if (unsafe === null || unsafe === undefined) return '';
  
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanTitle(title: string): string {
  if (!title) return 'Product';
  
  let cleaned = title
    .replace(/[🔥💎✨🎉👑]/g, '')
    .replace(/!{2,}/g, '!')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length > 150) {
    cleaned = cleaned.substring(0, 147) + '...';
  }
  
  return cleaned;
}

function cleanDescription(desc: string): string {
  if (!desc) {
    return 'High-quality flooring product with excellent durability and modern design.';
  }
  
  let cleaned = desc
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length > 5000) {
    cleaned = cleaned.substring(0, 4997) + '...';
  }
  
  return cleaned;
}

function getSize(product: Product): string {
  if (product.length && product.width) {
    const size = `${product.length}x${product.width}`;
    if (product.thickness) {
      return `${size}x${product.thickness} mm`;
    }
    return `${size} mm`;
  }
  return '';
}