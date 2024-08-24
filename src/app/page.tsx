'use client';

import React from 'react';
import { Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const images = [
  { id: 1, src: '/images/24.png', alt: '24' },
  { id: 2, src: '/images/리얼웨폰.png', alt: '리얼웨폰' },
  { id: 3, src: '/images/코다.png', alt: '코다' },
  { id: 4, src: '/images/FBI.png', alt: 'FBI' },
  { id: 5, src: '/images/멘탈리스트.png', alt: '멘탈리스트' },
];

const CoupangPlayClone = () => {
  const { push } = useRouter();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="bg-black p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="/images/coupangplay.png"
              alt="Coupang Play Logo"
              className="w-40"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Search className="text-gray-400" />
            <User className="text-gray-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        {/* Featured Content */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">주요 콘텐츠</h2>
          <div className="bg-gray-800 rounded-lg flex items-center justify-center">
            <img
              src="/images/굿월헌팅.png"
              alt="굿월헌팅"
              className="max-w-full max-h-full"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">카테고리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['영화', 'TV 프로그램', '스포츠', '키즈', '오리지널'].map(
              (category) => (
                <div
                  key={category}
                  className="bg-gray-700 p-4 rounded-lg text-center"
                >
                  {category}
                </div>
              )
            )}
          </div>
        </section>

        {/* Recommended Content */}
        <section>
          <h2 className="text-xl font-semibold mb-4">추천 콘텐츠</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                role="button"
                className="bg-gray-80 rounded-lg flex items-center justify-center"
                onClick={() => push(`/detail/${image.id}`)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black p-4 mt-20 mb-8">
        <div className="container mx-auto text-center text-gray-400">
          <div className="flex justify-center items-center space-x-4">
            <img
              src="/images/coupangplay.png"
              alt="Coupang Play Logo"
              className="w-40"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CoupangPlayClone;
