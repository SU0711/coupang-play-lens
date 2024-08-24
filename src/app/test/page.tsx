"use client";

import Image from "next/image";
import React from "react";

export default function Home() {

  const [productUrl, setProductUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/test", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      e.target.value = "";

      setProductUrl(getCoupangUrl(data));
      console.log(data);
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  };

  const getCoupangUrl = (productName: string) => {
    return `https://m.coupang.com/nm/search?q=${productName}`
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="file" onChange={onUpload} accept="image/jpg,image/png,image/jpeg" />

      {
        loading && (
          <div className="text-2xl font-bold">Loading...</div>
        )
      }
      {
        !loading && productUrl && (
          <iframe src={productUrl} width={320} height={600}></iframe>
        )
      }

    </main>
  );
}
