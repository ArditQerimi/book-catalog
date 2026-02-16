"use client";

import * as React from 'react';
import { Clock, Languages, Filter, Layers } from 'lucide-react';
import { Category, FilterState, ViewMode } from '@/types';
import { CATEGORIES } from '@/constants';
import FilterGroup from './FilterGroup';
import ViewToggle from './ViewToggle';
import IconWrapper from './IconWrapper';
import SidebarQuote from './SidebarQuote';

interface ArchiveSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filterOptions: {
    centuries: string[];
    languages: string[];
    themes: string[];
  };
}

const ArchiveSidebar: React.FC<ArchiveSidebarProps> = ({
  filters, setFilters, viewMode, setViewMode, filterOptions
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="sticky top-28 space-y-6">
        <div className="bg-white/40 p-6 rounded-[32px] border border-emerald-50/50 shadow-sm backdrop-blur-md">
          <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-900 mb-6 border-b border-emerald-100 pb-2">
            <IconWrapper icon={Filter} size={12} />
            Archive Explorer
          </h3>

          <div className="space-y-8">
            <ViewToggle mode={viewMode} onChange={setViewMode} />

            <FilterGroup
              label="Field of Study"
              options={CATEGORIES}
              currentValue={filters.category}
              onChange={(val: string) => setFilters(f => ({ ...f, category: val as Category }))}
            />

            <FilterGroup
              label="Predominant Themes"
              icon={<IconWrapper icon={Layers} size={12} />}
              options={['All', ...filterOptions.themes]}
              currentValue={filters.theme}
              onChange={(val: string) => setFilters(f => ({ ...f, theme: val }))}
            />

            <FilterGroup
              label="Temporal Era"
              icon={<IconWrapper icon={Clock} size={12} />}
              options={['All', ...filterOptions.centuries]}
              currentValue={filters.century}
              onChange={(val: string) => setFilters(f => ({ ...f, century: val }))}
            />

            <FilterGroup
              label="Language"
              icon={<IconWrapper icon={Languages} size={12} />}
              options={['All', ...filterOptions.languages]}
              currentValue={filters.language}
              onChange={(val: string) => setFilters(f => ({ ...f, language: val }))}
            />
          </div>
        </div>

        <SidebarQuote />
      </div>
    </aside>
  );
};

export default ArchiveSidebar;
