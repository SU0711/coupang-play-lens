'use client';
import React from 'react';
import { Product } from '@/app/api/products/route';
import { Callout } from '@/shared/components/callout';

interface Props {
  products: Product[];
  isSimilar: boolean;
}

const Products = ({ products, isSimilar }: Props) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      {isSimilar && <Callout>이 정보가 맞나요?</Callout>}
      <div className="flex flex-wrap justify-center gap-2">
        {products.map((product) => (
          <Item key={product.vendorItemId} product={product} />
        ))}
      </div>
    </div>
  );
};

const Item = ({ product }: { product: Product }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center border-b border-gray-200">
      <div className="w-full flex gap-2 p-2">
        <img src={product.image} alt={product.title} className="w-20 h-20" />
        <div className="flex flex-col gap-2 flex-1 grow">
          <div>{product.title}</div>
          <div className="text-red-500">{product.price}원</div>
          <div className="flex justify-end">
            <button className="rounded-md bg-[#346aff] py-1 px-2 text-white">
              구매하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
