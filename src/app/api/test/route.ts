import { NextRequest, NextResponse } from 'next/server';


// Google Cloud Vision API 요청을 위한 Fetch 함수 정의
async function fetchVisionAPI(imageBase64: string, apiKey: string): Promise<any> {
  const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
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
  });

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
      return NextResponse.json({ error: 'API key is not set.' }, { status: 500 });
    }

    // Google Vision API 호출
    const result = await fetchVisionAPI(base64String, apiKey);

    const isExist = !!result.responses?.length

    if (!isExist) {
      return NextResponse.json({ error: 'No response from Google Vision API' }, { status: 500 });
    }

    // 이름 반환할거임
    const webDetection = result.responses[0].webDetection;
    const label = webDetection.pagesWithMatchingImages[0].pageTitle;

    // JSON 응답 반환
    return NextResponse.json(label, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
