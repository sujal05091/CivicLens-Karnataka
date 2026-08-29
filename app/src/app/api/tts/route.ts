import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || '';
  const lang = searchParams.get('lang') || 'kn';

  if (!text.trim()) {
    return NextResponse.json({ error: 'Text parameter required' }, { status: 400 });
  }

  // Clean exclamation marks and special characters for speech
  const cleanText = text
    .replace(/!/g, '.')
    .replace(/\?/g, '.')
    .replace(/AI/g, 'ಏ ಐ')
    .replace(/[₹#/\\_-]/g, ' ')
    .trim();

  const targetLang = lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en';
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;

  try {
    const response = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'TTS provider returned error' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('TTS Proxy Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
