import { NextResponse } from 'next/server';

// Mock data with false values for when API response is invalid
const MOCK_ERROR_DATA = {
  "victoriametrics": "error",
  "vmagent": "error",
  "katpool-app": {
    "status": "error",
    "startTime": 0,
    "activePorts": [],
    "allPorts": {
      "1111": "inactive",
      "2222": "inactive",
      "3333": "inactive",
      "4444": "inactive",
      "5555": "inactive",
      "6666": "inactive",
      "7777": "inactive",
      "8888": "inactive"
    }
  },
  "go-app": {
    "status": "error",
    "services": {
      "kaspa_rpc": "error",
      "redis": "error"
    }
  }
};

export async function GET() {
  try {
    const baseUrl = process.env.API_BASE_URL || 'http://kas.katpool.xyz:8080';
    const res = await fetch(`${baseUrl}/health`);
    if (!res.ok) {
      return NextResponse.json(MOCK_ERROR_DATA);
    }
    const data = await res.json();
    
    // Check if the response is a valid object with expected structure
    if (!data || typeof data !== 'object' || 
        !data.victoriametrics || 
        !data.vmagent || 
        !data['katpool-app'] || 
        !data['go-app'] ||
        typeof data['katpool-app'] !== 'object' ||
        typeof data['go-app'] !== 'object' ||
        !data['katpool-app'].status ||
        !data['katpool-app'].startTime ||
        !data['katpool-app'].activePorts ||
        !data['katpool-app'].allPorts ||
        !data['go-app'].status ||
        !data['go-app'].services) {
      // Return mock data with false values when response is not valid
      return NextResponse.json(MOCK_ERROR_DATA);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    // Return mock data with false values on any error
    return NextResponse.json(MOCK_ERROR_DATA);
  }
} 