import { JobCard } from '@/components/shared/JobCard';
import { ScaffoldInput, Strike } from '@/components/ui';
import { Briefcase, Filter, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

// Mock Data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$140k - $180k',
    type: 'Full-time',
    postedAt: '2 days ago',
    description:
      'We are looking for an experienced Frontend Developer to lead our core product team...',
    logo: 'https://logo.clearbit.com/techcorp.com', // Placeholder
    tags: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    salary: '$120k - $160k',
    type: 'Contract',
    postedAt: '5 hours ago',
    description: 'Join our award-winning design team working on next-gen creative tools...',
    logo: 'https://logo.clearbit.com/designhub.com',
    tags: ['Figma', 'UI/UX', 'Prototyping'],
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'DataFlow',
    location: 'New York, NY',
    salary: '$150k - $190k',
    type: 'Full-time',
    postedAt: '1 day ago',
    description: 'Scale our data pipeline infrastructure handling millions of events per second...',
    logo: 'https://logo.clearbit.com/dataflow.io',
    tags: ['Python', 'PostgreSQL', 'AWS'],
  },
  {
    id: '4',
    title: 'Marketing Manager',
    company: 'GrowthCo',
    location: 'Austin, TX',
    salary: '$90k - $120k',
    type: 'Full-time',
    postedAt: '3 days ago',
    description:
      'Lead our growth marketing initiatives across paid and [DEPRECATED_STYLE] channels...',
    logo: 'https://logo.clearbit.com/growthco.com',
    tags: ['SEO', 'Content Strategy', 'Analytics'],
  },
];

export const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Simple filter logic
  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-background-base)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-display-large font-bold text-[var(--color-text-primary)] mb-4">
            Find Your Next{' '}
            <span className="font-serif italic text-[var(--color-leaf-base)]">Opportunity</span>
          </h1>
          <p className="text-body-large text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Discover roles that match your skills and career aspirations from thousands of top
            companies.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[var(--color-surface-container)] p-4 rounded-placard shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center border border-[var(--color-surface-container-high)]">
          <div className="flex-1 w-full relative">
            <ScaffoldInput
              placeholder="Search by job title, company, or keywords..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="w-full pl-12 h-14 text-body-large"
              // Note: Lens might not support icon prop directly depending on implementation,
              // so we might place the icon absolutely if Lens doesn't have a slot.
              // Assuming standard input behavior here.
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none"
              size={20}
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Strike
              variant="secondary"
              iconLeft={<MapPin size={16} />}
            >
              Location
            </Strike>
            <Strike
              variant="secondary"
              iconLeft={<Briefcase size={16} />}
            >
              Job Type
            </Strike>
            <Strike
              variant="ghost"
              iconLeft={<Filter size={16} />}
            >
              More Filters
            </Strike>
          </div>
        </div>

        {/* Job Listings Grid */}
        <div>
          <h2 className="text-title-medium font-bold text-[var(--color-text-secondary)] mb-6 uppercase tracking-wider">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                location={job.location}
                type={job.type}
                postedAt={job.postedAt}
                salary={job.salary}
                description={job.description}
                tags={job.tags}
                logo={job.logo}
                onApply={() => console.log(`Apply to ${job.id}`)}
                onSave={() => console.log(`Save ${job.id}`)}
              />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-[var(--color-surface-container-high)] rounded-placard">
              <Search
                size={48}
                className="mx-auto text-[var(--color-text-tertiary)] mb-4 opacity-50"
              />
              <h3 className="text-title-large font-bold text-[var(--color-text-primary)]">
                No jobs found
              </h3>
              <p className="text-body-medium text-[var(--color-text-secondary)] mt-2">
                Try adjusting your search terms or filters.
              </p>
              <Strike
                variant="ghost"
                className="mt-4 text-[var(--color-leaf-base)]"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Strike>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
