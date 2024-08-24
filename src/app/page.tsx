import React from 'react';
import { Play, Search, User } from 'lucide-react';

const CoupangPlayClone = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="bg-[#141414] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Play className="text-red-600" size={32} />
            <h1 className="text-2xl font-bold">쿠팡플레이</h1>
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
          <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
            <p className="text-2xl">메인 비디오 플레이어</p>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">카테고리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['영화', 'TV 프로그램', '스포츠', '키즈', '오리지널'].map((category) => (
              <div key={category} className="bg-gray-700 p-4 rounded-lg text-center">
                {category}
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Content */}
        <section>
          <h2 className="text-xl font-semibold mb-4">추천 콘텐츠</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-gray-800 h-40 rounded-lg flex items-center justify-center">
                <p>콘텐츠 {item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#141414] p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>&copy; 2024 쿠팡플레이 클론. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
};

export default CoupangPlayClone;