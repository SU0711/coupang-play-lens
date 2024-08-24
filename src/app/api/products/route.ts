import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import fakeUa from 'fake-useragent';
import * as cheerio from 'cheerio';

export interface Product {
  productId: string;
  itemId: string;
  vendorItemId: string;
  link: string;
  title: string;
  price: string;
  image: string;
  deliveryDate: string;
  freeShipping: boolean;
}

async function fetchCoupangHTML(searchQuery: string): Promise<string> {
  try {
    // 쿠팡 검색 URL
    const url = `${process.env.COUPANG_URL}${encodeURIComponent(searchQuery)}`;

    // axios를 사용하여 GET 요청 보내기
    const response = await axios.get(url, {
      headers: {
        'User-Agent': fakeUa(),
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    // 응답에서 HTML 내용 추출
    return response.data;
  } catch (error) {
    console.error('Error occurred while fetching HTML:', error);
    throw error;
  }
}

async function scrapeCoupang(searchQuery: string): Promise<Product[]> {
  try {
    const htmlContent = await fetchCoupangHTML(searchQuery);

    // cheerio를 사용하여 HTML 파싱
    const $ = cheerio.load(htmlContent);

    const products: Product[] = [];

    // 각 제품 정보 추출
    $('#productList .plp-default__item').each((index, element) => {
      const item = $(element);
      const linkElement = item.find('a');
      const titleElement = item.find('.info .title');
      const priceElement = item.find('.discount-price strong');
      const imageElement = item.find('.thumbnail img');
      const deliveryDateElement = item.find('.promise-delivery-date');
      const freeShippingElement = item.find('.badge-shipping');

      const product: Product = {
        productId: item.attr('data-product-id') || '',
        itemId: item.attr('data-item-id') || '',
        vendorItemId: item.attr('data-vendor-item-id') || '',
        link: linkElement.attr('href') || '',
        title: titleElement.text().trim(),
        price: priceElement.text().trim(),
        image: imageElement.attr('src') || '',
        deliveryDate: deliveryDateElement.text().trim(),
        freeShipping: !!freeShippingElement.length,
      };

      products.push(product);
    });

    if (products.length > 3) {
      return products.slice(0, 3);
    }

    return products;
  } catch (error) {
    console.error('Error occurred while scraping:', error);
    throw error;
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchQuery = new URL(req.url).searchParams.get('q');

  if (!searchQuery) {
    return NextResponse.json(
      { error: 'No search query provided.' },
      { status: 400 }
    );
  }

  try {
    const products = await scrapeCoupang(searchQuery);
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scrape Coupang.' },
      { status: 500 }
    );
  }
}
