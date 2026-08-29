'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, MapPin, Sparkles, Filter, CheckCircle2, ArrowRight, AlertCircle, Clock
} from 'lucide-react';
import DisclosureBanner from '@/components/DisclosureBanner';
import OpenStreetMap from '@/components/OpenStreetMap';

interface NearbyIssueItem {
  id: string;
  type: string;
  title: string;
  location: string;
  distance: string;
  timeAgo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  aiVerified?: boolean;
  imageUrl?: string;
  latitude: number;
  longitude: number;
}

const NEARBY_ISSUES_LIST: NearbyIssueItem[] = [
  {
    id: 'CIV-KAR-10392',
    type: 'pothole',
    title: 'Severe Pothole',
    location: 'Koramangala 4th Block, Bengaluru',
    distance: '0.2 km away',
    timeAgo: 'Reported 2h ago',
    status: 'Open',
    aiVerified: true,
    imageUrl: '/demo-pothole.jpg',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: 'CIV-KAR-10345',
    type: 'garbage',
    title: 'Overflowing Garbage',
    location: 'Indiranagar 100ft Road, Bengaluru',
    distance: '1.5 km away',
    timeAgo: 'Reported 1d ago',
    status: 'In Progress',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=300&q=80',
    latitude: 12.9784,
    longitude: 77.6408,
  },
  {
    id: 'CIV-KAR-10301',
    type: 'streetlight',
    title: 'Broken Streetlight',
    location: 'HSR Layout Sector 2, Bengaluru',
    distance: '2.1 km away',
    timeAgo: 'Reported 3h ago',
    status: 'Open',
    latitude: 12.9116,
    longitude: 77.6476,
  },
  {
    id: 'CIV-KAR-10288',
    type: 'water',
    title: 'Pipe Leakage',
    location: 'BTM Layout Stage 1, Bengaluru',
    distance: '3.0 km away',
    timeAgo: 'Resolved 2d ago',
    status: 'Resolved',
    latitude: 12.9166,
    longitude: 77.6101,
  },
];

const FILTER_TAGS = [
  { id: 'all', label: 'All Issues' },
  { id: 'pothole', label: 'Potholes' },
  { id: 'garbage', label: 'Garbage' },
  { id: 'streetlight', label: 'Streetlights' },
  { id: 'water', label: 'Water' },
];

export default function NearbyPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedIssueId, setSelectedIssueId] = useState('CIV-KAR-10392');

  const filteredIssues = NEARBY_ISSUES_LIST.filter((issue) => {
    const matchesFilter = activeFilter === 'all' || issue.type === activeFilter;
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedIssue = NEARBY_ISSUES_LIST.find((i) => i.id === selectedIssueId) || NEARBY_ISSUES_LIST[0];

  return (
    <div className="px-4 md:px-8 pt-6 pb-16 max-w-7xl mx-auto space-y-6 animate-fadeIn text-[var(--color-text-primary)]">
      
      {/* 2-Column Split View Layout 1:1 Stitch (Left Cards Feed 5 cols, Right Map 7 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Title, Search, Filter Chips & Feed Cards */}
        <div className="md:col-span-5 space-y-5">
          
          {/* Header Title */}
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Nearby Issues
          </h1>

          {/* Search Input Bar 1:1 */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by street or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[var(--color-outline-variant)] text-xs text-[var(--color-text-primary)] font-bold placeholder-gray-400 focus:outline-none focus:border-red-400 shadow-sm"
            />
          </div>

          {/* Filter Chips Bar 1:1 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveFilter(tag.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeFilter === tag.id
                    ? 'bg-[var(--color-civic-blue)] text-white shadow-sm'
                    : 'bg-white border border-[var(--color-outline-variant)] text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {/* Issue Cards Feed List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {filteredIssues.map((issue) => {
              const isSelected = issue.id === selectedIssueId;

              return (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white shadow-sm hover:shadow-md ${
                    isSelected ? 'border-2 border-[var(--color-civic-blue)] ring-2 ring-blue-100' : 'border-[var(--color-outline-variant)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {issue.type === 'pothole' && '⚠️'}
                        {issue.type === 'garbage' && '🗑️'}
                        {issue.type === 'streetlight' && '💡'}
                        {issue.type === 'water' && '💧'}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-[var(--color-text-tertiary)] font-medium">
                          {issue.location}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill Badge 1:1 */}
                    <span
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                        issue.status === 'Open'
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : issue.status === 'In Progress'
                          ? 'bg-teal-100 text-teal-800 border border-teal-300'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  {/* Optional Image Thumbnail */}
                  {issue.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden h-28 border border-[var(--color-outline-variant)]">
                      <img src={issue.imageUrl} alt={issue.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Card Footer Info */}
                  <div className="mt-3 pt-3 border-t border-[var(--color-outline-variant)] flex items-center justify-between text-xs font-bold text-[var(--color-text-tertiary)]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[var(--color-text-primary)]">
                        <MapPin size={13} className="text-red-600" /> {issue.distance}
                      </span>
                      {issue.aiVerified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[10px] border border-teal-200">
                          <CheckCircle2 size={11} /> AI Verified
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-400 font-medium">
                      {issue.timeAgo}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: OpenStreetMap Interactive Map & Tooltip Card 1:1 Stitch */}
        <div className="md:col-span-7 sticky top-20 space-y-4">
          <div className="bg-white p-3 rounded-3xl border border-[var(--color-outline-variant)] shadow-md relative">
            
            {/* OpenStreetMap Component Centered at Selected Issue Coordinates */}
            <OpenStreetMap
              latitude={selectedIssue.latitude}
              longitude={selectedIssue.longitude}
              title={selectedIssue.title}
              address={selectedIssue.location}
              height="580px"
            />

            {/* Map Tooltip Card Overlay 1:1 Stitch */}
            <div className="absolute top-16 left-8 z-30 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-blue-200 shadow-xl max-w-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-extrabold text-sm text-[var(--color-text-primary)]">
                  {selectedIssue.title}
                </h4>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  {selectedIssue.status}
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-tertiary)] font-medium">
                {selectedIssue.location}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-[var(--color-civic-blue)]">
                <span>📍 {selectedIssue.distance}</span>
                <button
                  onClick={() => router.push(`/track/${selectedIssue.id}`)}
                  className="hover:underline flex items-center gap-1 text-xs"
                >
                  View Case Details <ArrowRight size={12} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      <DisclosureBanner />
    </div>
  );
}
