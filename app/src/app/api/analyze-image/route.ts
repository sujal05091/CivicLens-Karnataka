import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/gemini';
import { FALLBACK_AI_ANALYSIS } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();

    if (!image || !mimeType) {
      return NextResponse.json(
        { error: 'Image data and mime type required' },
        { status: 400 }
      );
    }

    // Try Gemini AI analysis
    const result = await analyzeImage(image, mimeType);

    if (result) {
      return NextResponse.json(result);
    }

    // Fallback if AI fails
    return NextResponse.json(FALLBACK_AI_ANALYSIS);
  } catch (error) {
    console.error('Image analysis error:', error);
    // Always return a usable response
    return NextResponse.json(FALLBACK_AI_ANALYSIS);
  }
}
