import { NextRequest, NextResponse } from 'next/server';
import { generateCaseId } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const caseId = generateCaseId();

    await new Promise(resolve => setTimeout(resolve, 300));

    const response = {
      caseId,
      status: 'RECEIVED' as const,
      destination: body.authorityId
        ? 'Public Works & Urban Infrastructure Directorate'
        : 'Office of the Chief Engineer & Commissioner',
      simulated: true,
      submittedAt: new Date().toISOString(),
      message: 'Government submission is simulated in this prototype.',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Mock submission error:', error);
    return NextResponse.json(
      {
        caseId: generateCaseId(),
        status: 'RECEIVED',
        destination: 'Public Works & Urban Infrastructure Directorate',
        simulated: true,
        submittedAt: new Date().toISOString(),
        message: 'Government submission is simulated in this prototype.',
      }
    );
  }
}
