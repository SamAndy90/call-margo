'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';
import TeamMemberModal from '@/components/modals/TeamMemberModal';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleDescription: string;
}

const tabs = [
  { name: 'Company', href: '#company' },
  { name: 'Brand', href: '#brand' },
  { name: 'Channels', href: '#channels' },
  { name: 'Audience', href: '#audience' },
  { name: 'Product', href: '#product' },
  { name: 'Competitors', href: '#competitors' },
  { name: 'Tech Stack', href: '#tech-stack' },
];

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'email' | 'url' | 'date';
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
}

function FormField({ label, id, type = 'text', placeholder, rows = 3, value, onChange }: FormFieldProps) {
  const isTextarea = type === 'textarea';
  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <Component
          id={id}
          name={id}
          type={type}
          rows={isTextarea ? rows : undefined}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-coral-500 focus:ring-coral-500 sm:text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

function MarketingArchitectureContent() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
    mission: '',
    vision: '',
    website: '',
    founded: '',
    strengths: '',
    weaknesses: '',
    differentiators: '',
  });
  const { user } = useUser();

  const fetchCompanyData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setCompanyData(data);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  }, [user?.id]);

  const fetchTeamMembers = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', user.id);

      if (error) throw error;
      if (data) {
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCompanyData();
    fetchTeamMembers();
  }, [fetchCompanyData, fetchTeamMembers]);

  const handleCompanyDataChange = async (field: string, value: string) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    
    try {
      const { error } = await supabase
        .from('companies')
        .upsert({ 
          user_id: user?.id,
          [field]: value,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating company data:', error);
    }
  };

  const handleSaveTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{ ...member, company_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTeamMembers([...teamMembers, data]);
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Architecture</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define and manage your marketing foundation, strategy, and infrastructure.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsTeamModalOpen(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
          >
            <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Team Member
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 border-b border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  classNames(
                    'py-3 px-4 text-sm font-medium border-b-2 -mb-px focus:outline-none',
                    selected
                      ? 'border-coral-500 text-coral-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-8">
            {/* Company Panel */}
            <Tab.Panel className="space-y-6">
              <FormField
                label="Company Name"
                id="companyName"
                placeholder="Enter your company name"
                value={companyData.name}
                onChange={(value) => handleCompanyDataChange('name', value)}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Founded"
                  id="founded"
                  type="date"
                  value={companyData.founded}
                  onChange={(value) => handleCompanyDataChange('founded', value)}
                />
                <FormField
                  label="Website"
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={companyData.website}
                  onChange={(value) => handleCompanyDataChange('website', value)}
                />
              </div>
              <FormField
                label="Description"
                id="description"
                type="textarea"
                placeholder="Brief description of your company"
                value={companyData.description}
                onChange={(value) => handleCompanyDataChange('description', value)}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Mission"
                  id="mission"
                  type="textarea"
                  placeholder="Your company's mission"
                  value={companyData.mission}
                  onChange={(value) => handleCompanyDataChange('mission', value)}
                />
                <FormField
                  label="Vision"
                  id="vision"
                  type="textarea"
                  placeholder="Your company's vision"
                  value={companyData.vision}
                  onChange={(value) => handleCompanyDataChange('vision', value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Strengths"
                  id="strengths"
                  type="textarea"
                  placeholder="List your company's strengths"
                  value={companyData.strengths}
                  onChange={(value) => handleCompanyDataChange('strengths', value)}
                />
                <FormField
                  label="Weaknesses"
                  id="weaknesses"
                  type="textarea"
                  placeholder="List areas for improvement"
                  value={companyData.weaknesses}
                  onChange={(value) => handleCompanyDataChange('weaknesses', value)}
                />
              </div>
              <FormField
                label="Key Differentiators"
                id="differentiators"
                type="textarea"
                placeholder="What makes your company unique?"
                value={companyData.differentiators}
                onChange={(value) => handleCompanyDataChange('differentiators', value)}
              />

              {/* Team Members Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-coral-500 focus-within:ring-offset-2 hover:border-gray-400"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-coral-500 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <a href="#" className="focus:outline-none">
                          <span className="absolute inset-0" aria-hidden="true" />
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <p className="truncate text-sm text-gray-500">{member.role}</p>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Other panels remain the same */}
            <Tab.Panel>Brand Content</Tab.Panel>
            <Tab.Panel>Channels Content</Tab.Panel>
            <Tab.Panel>Audience Content</Tab.Panel>
            <Tab.Panel>Product Content</Tab.Panel>
            <Tab.Panel>Competitors Content</Tab.Panel>
            <Tab.Panel>Tech Stack Content</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      <TeamMemberModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onSave={handleSaveTeamMember}
      />
    </div>
  );
}

export default function Page() {
  return (
    <DashboardLayout>
      <MarketingArchitectureContent />
    </DashboardLayout>
  );
}
