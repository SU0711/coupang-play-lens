import { NextRequest, NextResponse } from 'next/server';

// Google Cloud Vision API 요청을 위한 Fetch 함수 정의
async function fetchVisionAPI(
  imageBase64: string,
  apiKey: string
): Promise<any> {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageBase64,
            },
            features: [
              {
                type: 'WEB_DETECTION',
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch from Google Vision API');
  }

  return response.json();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 파일을 읽어서 base64 인코딩
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');

    // API 키를 환경 변수에서 가져옴
    const apiKey = process.env.GOOGLE_VISION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is not set.' },
        { status: 500 }
      );
    }

    // Google Vision API 호출
    const result = await fetchVisionAPI(base64String, apiKey);

    const responses = result.responses;
    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No response from Google Vision API' },
        { status: 500 }
      );
    }

    const webDetection = responses[0].webDetection;

    if (
      !webDetection ||
      !webDetection.pagesWithMatchingImages ||
      webDetection.pagesWithMatchingImages.length === 0
    ) {
      if (webDetection && webDetection.bestGuessLabels) {
        // 가장 가능성이 높은 라벨 반환
        const label = webDetection.bestGuessLabels[0].label;

        // JSON 응답 반환
        return NextResponse.json(
          { label, isSimilar: true },
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      return NextResponse.json(
        { error: 'No matching images found' },
        { status: 404 }
      );
    }

    // 이름 반환할거임
    const label = webDetection.pagesWithMatchingImages[0].pageTitle;

    // JSON 응답 반환
    return NextResponse.json(
      { label },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('Error during web detection:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
