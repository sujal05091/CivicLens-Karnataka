import { NextRequest, NextResponse } from 'next/server';
import { generateComplaint } from '@/lib/gemini';
import { FALLBACK_COMPLAINT } from '@/lib/demo-data';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const result = await generateComplaint({
      issueType: data.issueType || 'pothole',
      severity: data.severity || 'high',
      description: data.description || 'Civic issue reported',
      location: data.location || 'Shanthinagar Main Road, Bengaluru',
      projectReference: data.projectReference || 'N/A',
      maintenanceStatus: data.maintenanceStatus || 'N/A',
    });

    if (result) {
      return NextResponse.json(result);
    }

    return NextResponse.json(FALLBACK_COMPLAINT);
  } catch (error) {
    console.error('Complaint generation error:', error);
    return NextResponse.json(FALLBACK_COMPLAINT);
  }
}
