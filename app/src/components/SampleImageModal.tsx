'use client';

import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export interface SampleImageOption {
  id: string;
  category: string;
  title: string;
  location: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  imageUrl: string;
  description: string;
}

export const SAMPLE_IMAGES: SampleImageOption[] = [
  {
    id: 'sample-pothole',
    category: 'Pothole',
    title: 'Severe Asphalt Road Pothole',
    location: 'Shanthinagar Main Road, Ward 42, Bengaluru',
    severity: 'HIGH',
    imageUrl: '/sample-cases/pothole.jpg',
    description: 'Deep road crater causing immediate traffic slowdown and commuter hazard.',
  },
  {
    id: 'sample-road-damage',
    category: 'Road Damage',
    title: 'Cracked Surface & Trench Subsidence',
    location: 'Koramangala 4th Block, 80ft Road, Bengaluru',
    severity: 'CRITICAL',
    imageUrl: '/sample-cases/road-damage.jpg',
    description: 'Severe structural tarmac collapse following un-restored utility trenching.',
  },
  {
    id: 'sample-streetlight',
    category: 'Streetlight',
    title: 'Unlit Pole & Circuit Outage',
    location: 'HSR Layout Sector 2, 27th Main, Bengaluru',
    severity: 'MEDIUM',
    imageUrl: '/sample-cases/streetlight.jpg',
    description: 'Dark corridor section with non-functional LED luminaire assembly.',
  },
  {
    id: 'sample-garbage',
    category: 'Garbage',
    title: 'Uncollected Solid Waste Dump',
    location: 'Indiranagar 100ft Road Corridor, Bengaluru',
    severity: 'HIGH',
    imageUrl: '/sample-cases/garbage.jpg',
    description: 'Commercial waste accumulation blocking pedestrian access and stormwater drain.',
  },
  {
    id: 'sample-water',
    category: 'Water',
    title: 'Pressurized Pipe Main Leakage',
    location: 'BTM Layout Stage 1, 16th Main, Bengaluru',
    severity: 'HIGH',
    imageUrl: '/sample-cases/water-leak.jpg',
    description: 'Clean drinking water main rupture flooding public roadway.',
  },
  {
    id: 'sample-drainage',
    category: 'Drainage',
    title: 'Stormwater Drain Silt Blockage',
    location: 'Electronic City Phase 1, Hosur Road, Bengaluru',
    severity: 'CRITICAL',
    imageUrl: '/sample-cases/drainage.jpg',
    description: 'Overflowing storm drain causing waterlogging across carriageway.',
  },
  {
    id: 'sample-footpath',
    category: 'Footpath',
    title: 'Broken Paver Blocks & Exposed Slab',
    location: 'MG Road Pedestrian Boulevard, Bengaluru',
    severity: 'MEDIUM',
    imageUrl: '/sample-cases/footpath.jpg',
    description: 'Tripping hazard from displaced concrete walkway slabs.',
  },
  {
    id: 'sample-tree',
    category: 'Fallen Tree',
    title: 'Fallen Branch Blocking Lane',
    location: 'Jayanagar 4th Block, 11th Main, Bengaluru',
    severity: 'MEDIUM',
    imageUrl: '/sample-cases/fallen-tree.jpg',
    description: 'Overhanging tree limb obstruction touching low-voltage overhead cables.',
  },
];

interface SampleImageModalProps {
  onClose: () => void;
  onSelectSample: (sample: SampleImageOption) => void;
}

export default function SampleImageModal({ onClose, onSelectSample }: SampleImageModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[var(--color-outline-variant)] shadow-2xl max-w-4xl w-full p-6 md:p-8 space-y-6 animate-scaleIn max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-outline-variant)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">
                Select a Sample Civic Case Photo
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] font-bold">
                Demonstrate Gemini AI analysis with real Karnataka civic defect evidence.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sample Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-1 flex-1">
          {SAMPLE_IMAGES.map((sample) => (
            <div
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="group bg-slate-50 hover:bg-blue-50 border border-[var(--color-outline-variant)] hover:border-[var(--color-civic-blue)] rounded-2xl p-3 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative h-32 rounded-xl overflow-hidden bg-slate-200">
                  <img
                    src={sample.imageUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-black text-white ${
                      sample.severity === 'CRITICAL'
                        ? 'bg-red-600'
                        : sample.severity === 'HIGH'
                        ? 'bg-amber-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {sample.category.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-civic-blue)] line-clamp-1">
                    {sample.title}
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-tertiary)] font-semibold line-clamp-1 mt-0.5">
                    📍 {sample.location}
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] font-black text-[var(--color-civic-blue)] group-hover:translate-x-0.5 transition-transform">
                <span>Select for AI Scan</span>
                <CheckCircle2 size={15} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
