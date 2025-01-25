'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabaseClient';
import TeamMemberModal from '@/components/modals/TeamMemberModal';
import AudienceProfileDetails from '@/components/marketing-architecture/AudienceProfileDetails';
import { PostgrestError } from '@supabase/supabase-js';

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

interface BrandData {
  user_id: string;
  brand_name: string;
  tagline: string;
  values: string;
  voice_tone: string;
  visual_identity: string;
  color_palette: string;
  typography: string;
  logo_usage: string;
}

interface CompanyData {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  mission: string;
  vision: string;
  website: string;
  founded: string;
  strengths: string;
  weaknesses: string;
  differentiators: string;
  created_at?: Date;
  updated_at?: Date;
}

interface VoiceOfCustomer {
  id?: string;
  audience_profile_id: string;
  title: string;
  quote: string;
  customer_name: string;
  customer_title: string;
  attachment_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AudienceNote {
  id?: string;
  audience_profile_id: string;
  title: string;
  content: string;
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface AudienceProfile {
  id?: string;
  user_id: string;
  name: string;
  description: string;
  problems: string[];
  product_solutions: string[];
  attraction_channels: string[];
  engagement_channels: string[];
  valuable_segments: string;
  common_objections: string[];
  common_channels: string[];
  trusted_platforms: string[];
  complementary_problems: string[];
  voc_data?: VoiceOfCustomer[];
  notes?: AudienceNote[];
  created_at?: Date;
  updated_at?: Date;
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

function FormField({ label, id, type = 'text', placeholder, rows = 3, value = '', onChange }: FormFieldProps) {
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
  const [companyData, setCompanyData] = useState<CompanyData>({
    user_id: '',
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
  const [brandData, setBrandData] = useState<BrandData>({
    user_id: '',
    brand_name: '',
    tagline: '',
    values: '',
    voice_tone: '',
    visual_identity: '',
    color_palette: '',
    typography: '',
    logo_usage: '',
  });
  const [audienceProfiles, setAudienceProfiles] = useState<AudienceProfile[]>([]);
  const [selectedAudienceId, setSelectedAudienceId] = useState<string | null>(null);
  const [isVocModalOpen, setIsVocModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const { user } = useUser();

  const fetchCompanyData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('Fetching company data for user:', user.id);
      
      // First try to fetch existing company data
      const { data: existingCompany, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw fetchError;
        }
      }

      if (existingCompany) {
        // Convert null date to empty string for the form
        setCompanyData({
          ...existingCompany,
          founded: existingCompany.founded || ''
        });
        return;
      }

      console.log('No existing company found, creating new one');

      // If no company exists, create a new one
      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert([
          {
            user_id: user.id,
            name: '',
            description: '',
            mission: '',
            vision: '',
            website: '',
            founded: null,
            strengths: '',
            weaknesses: '',
            differentiators: '',
          }
        ])
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '42P01') { // Table doesn't exist
          console.error('Companies table does not exist. Please run the database migrations.');
          return;
        }
        throw insertError;
      }
      
      if (newCompany) {
        // Convert null date to empty string for the form
        setCompanyData({
          ...newCompany,
          founded: newCompany.founded || ''
        });
      }
    } catch (error: unknown) {
      console.error('Error handling company data:', error instanceof Error ? error.message : String(error));
    }
  }, [user?.id]);

  const fetchTeamMembers = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', user.id);

      if (error) {
        console.log('Raw error:', error);
        console.log('Error object details:', {
          error: JSON.stringify(error, null, 2),
          type: typeof error,
          isObject: error instanceof Object,
          isError: error instanceof Error,
          isPostgrestError: error instanceof PostgrestError,
          keys: error instanceof Object ? Object.keys(error) : [],
          prototype: error instanceof Object ? Object.getPrototypeOf(error) : null,
          constructor: error instanceof Object ? error.constructor.name : null
        });

        if (error instanceof PostgrestError) {
          console.error('Postgrest error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        } else if (error instanceof Error) {
          console.error('Standard error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        } else {
          console.error('Unknown error type:', String(error));
        }
        if (error.code === '42P01') { // Table doesn't exist
          console.error('Team members table does not exist. Please run the database migrations.');
          return;
        }
        throw error;
      }

      if (data) {
        setTeamMembers(data);
      }
    } catch (error: unknown) {
      console.log('Raw error:', error);
      console.log('Error object details:', {
        error: JSON.stringify(error, null, 2),
        type: typeof error,
        isObject: error instanceof Object,
        isError: error instanceof Error,
        isPostgrestError: error instanceof PostgrestError,
        keys: error instanceof Object ? Object.keys(error) : [],
        prototype: error instanceof Object ? Object.getPrototypeOf(error) : null,
        constructor: error instanceof Object ? error.constructor.name : null
      });

      if (error instanceof PostgrestError) {
        console.error('Postgrest error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (error instanceof Error) {
        console.error('Standard error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('Unknown error type:', String(error));
      }
    }
  }, [user?.id]);

  const fetchBrandData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data: existingBrand, error: fetchError } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.log('Raw fetch error:', fetchError);
        console.log('Fetch error details:', { 
          error: JSON.stringify(fetchError, null, 2),
          type: typeof fetchError,
          keys: Object.keys(fetchError),
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        });
        
        if (fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw fetchError;
        }
      }

      if (existingBrand) {
        console.log('Found existing brand:', existingBrand);
        setBrandData(existingBrand);
        return;
      }

      console.log('No existing brand found, creating new one');

      // If no brand exists, create a new one
      const { data: newBrand, error: insertError } = await supabase
        .from('brands')
        .insert([{
          user_id: user.id,
          brand_name: '',
          tagline: '',
          values: '',
          voice_tone: '',
          visual_identity: '',
          color_palette: '',
          typography: '',
          logo_usage: '',
        }])
        .select()
        .single();

      if (insertError) {
        console.log('Raw insert error:', insertError);
        console.log('Insert error details:', { 
          error: JSON.stringify(insertError, null, 2),
          type: typeof insertError,
          keys: Object.keys(insertError),
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });

        if (insertError.code === '42P01') { // Table doesn't exist
          console.error('Brands table does not exist. Please run the database migrations.');
          return;
        }
        throw insertError;
      }

      if (newBrand) {
        console.log('Created new brand:', newBrand);
        setBrandData(newBrand);
      }
    } catch (error: unknown) {
      console.log('Raw error:', error);
      console.log('Error object details:', {
        error: JSON.stringify(error, null, 2),
        type: typeof error,
        isObject: error instanceof Object,
        isError: error instanceof Error,
        isPostgrestError: error instanceof PostgrestError,
        keys: error instanceof Object ? Object.keys(error) : [],
        prototype: error instanceof Object ? Object.getPrototypeOf(error) : null,
        constructor: error instanceof Object ? error.constructor.name : null
      });

      if (error instanceof PostgrestError) {
        console.error('Postgrest error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (error instanceof Error) {
        console.error('Standard error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('Unknown error type:', String(error));
      }
    }
  }, [user?.id]);

  const fetchAudienceProfiles = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data: profiles, error } = await supabase
        .from('audience_profiles')
        .select(`
          *,
          voice_of_customer (*),
          audience_notes (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // If no profiles exist, create a default one
      if (!profiles || profiles.length === 0) {
        const { data: newProfile, error: createError } = await supabase
          .from('audience_profiles')
          .insert([{
            user_id: user.id,
            name: 'Primary Target Audience',
            description: 'Our main customer segment that we focus our marketing efforts on.',
            problems: [
              'Need to understand their target market better',
              'Struggle with marketing message consistency',
              'Want to improve customer engagement'
            ],
            product_solutions: [
              'Comprehensive audience analysis tools',
              'Marketing message templates',
              'Engagement tracking and analytics'
            ],
            attraction_channels: [
              'Social media marketing',
              'Content marketing',
              'Email campaigns'
            ],
            engagement_channels: [
              'Customer support',
              'Product updates',
              'Educational content'
            ],
            valuable_segments: 'Marketing teams in B2B SaaS companies, focusing on companies with 50-500 employees who need to improve their marketing effectiveness.',
            common_objections: [
              'Current solutions are working fine',
              'Too expensive',
              'Takes too much time to implement'
            ],
            common_channels: [
              'LinkedIn',
              'Industry conferences',
              'Professional networks'
            ],
            trusted_platforms: [
              'LinkedIn',
              'Twitter',
              'Industry blogs'
            ],
            complementary_problems: [
              'Need better sales and marketing alignment',
              'Want to improve lead quality',
              'Need to reduce customer acquisition costs'
            ]
          }])
          .select(`
            *,
            voice_of_customer (*),
            audience_notes (*)
          `)
          .single();

        if (createError) throw createError;
        
        if (newProfile) {
          setAudienceProfiles([newProfile]);
          setSelectedAudienceId(newProfile.id);
        }
      } else {
        setAudienceProfiles(profiles.map(profile => ({
          ...profile,
          problems: profile.problems || [],
          product_solutions: profile.product_solutions || [],
          attraction_channels: profile.attraction_channels || [],
          engagement_channels: profile.engagement_channels || [],
          common_objections: profile.common_objections || [],
          common_channels: profile.common_channels || [],
          trusted_platforms: profile.trusted_platforms || [],
          complementary_problems: profile.complementary_problems || [],
        })));
        
        // Select the first profile by default if none is selected
        if (!selectedAudienceId && profiles.length > 0) {
          setSelectedAudienceId(profiles[0].id);
        }
      }
    } catch (error: unknown) {
      console.error('Error fetching audience profiles:', error instanceof Error ? error.message : String(error));
    }
  }, [user?.id, selectedAudienceId]);

  const handleCompanyDataChange = async (field: keyof CompanyData, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value || ''
    }));

    try {
      const { error } = await supabase
        .from('companies')
        .update({ [field]: value || '' })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error updating company data:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleBrandDataChange = async (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({
      ...prev,
      [field]: value || ''
    }));
    
    try {
      const { error } = await supabase
        .from('brands')
        .update({ [field]: value || '' })
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error updating brand data:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleAudienceProfileChange = async (profileId: string, field: string, value: any) => {
    const profile = audienceProfiles.find(p => p.id === profileId);
    if (!profile) return;

    try {
      const updatedProfile = { ...profile, [field]: value };
      setAudienceProfiles(prev => prev.map(p => p.id === profileId ? updatedProfile : p));

      const { error } = await supabase
        .from('audience_profiles')
        .update({ [field]: value })
        .eq('id', profileId);

      if (error) throw error;
    } catch (error: unknown) {
      console.error('Error updating audience profile:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleAddVoiceOfCustomer = async (profileId: string, vocData: Omit<VoiceOfCustomer, 'id' | 'audience_profile_id'>) => {
    try {
      const { data, error } = await supabase
        .from('voice_of_customer')
        .insert([
          {
            audience_profile_id: profileId,
            ...vocData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAudienceProfiles(prev => prev.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              voc_data: [...(profile.voc_data || []), data]
            };
          }
          return profile;
        }));
      }
    } catch (error: unknown) {
      console.error('Error adding voice of customer:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleAddNote = async (profileId: string, noteData: Omit<AudienceNote, 'id' | 'audience_profile_id' | 'created_by'>) => {
    try {
      const { data, error } = await supabase
        .from('audience_notes')
        .insert([
          {
            audience_profile_id: profileId,
            created_by: user?.id,
            ...noteData
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAudienceProfiles(prev => prev.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              notes: [...(profile.notes || []), data]
            };
          }
          return profile;
        }));
      }
    } catch (error: unknown) {
      console.error('Error adding note:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleCreateAudienceProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('audience_profiles')
        .insert([{
          user_id: user.id,
          name: 'New Audience Profile',
          description: '',
          problems: [],
          product_solutions: [],
          attraction_channels: [],
          engagement_channels: [],
          valuable_segments: '',
          common_objections: [],
          common_channels: [],
          trusted_platforms: [],
          complementary_problems: [],
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setAudienceProfiles(prev => [...prev, data]);
        setSelectedAudienceId(data.id);
      }
    } catch (error: unknown) {
      console.error('Error creating audience profile:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleSaveTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{ ...member, company_id: user?.id }])
        .select()
        .single();

      if (error) {
        console.log('Raw error:', error);
        console.log('Error object details:', {
          error: JSON.stringify(error, null, 2),
          type: typeof error,
          isObject: error instanceof Object,
          isError: error instanceof Error,
          isPostgrestError: error instanceof PostgrestError,
          keys: error instanceof Object ? Object.keys(error) : [],
          prototype: error instanceof Object ? Object.getPrototypeOf(error) : null,
          constructor: error instanceof Object ? error.constructor.name : null
        });

        if (error instanceof PostgrestError) {
          console.error('Postgrest error:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
        } else if (error instanceof Error) {
          console.error('Standard error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          });
        } else {
          console.error('Unknown error type:', String(error));
        }
        throw error;
      }

      if (data) {
        setTeamMembers([...teamMembers, data]);
      }
    } catch (error: unknown) {
      console.log('Raw error:', error);
      console.log('Error object details:', {
        error: JSON.stringify(error, null, 2),
        type: typeof error,
        isObject: error instanceof Object,
        isError: error instanceof Error,
        isPostgrestError: error instanceof PostgrestError,
        keys: error instanceof Object ? Object.keys(error) : [],
        prototype: error instanceof Object ? Object.getPrototypeOf(error) : null,
        constructor: error instanceof Object ? error.constructor.name : null
      });

      if (error instanceof PostgrestError) {
        console.error('Postgrest error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else if (error instanceof Error) {
        console.error('Standard error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('Unknown error type:', String(error));
      }
    }
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchCompanyData();
    fetchTeamMembers();
    fetchBrandData();
    fetchAudienceProfiles();
  }, [fetchCompanyData, fetchTeamMembers, fetchBrandData, fetchAudienceProfiles]);

  // Initialize state with empty arrays and strings
  const defaultAudienceProfile = {
    id: '',
    user_id: '',
    name: '',
    description: '',
    problems: [],
    product_solutions: [],
    attraction_channels: [],
    engagement_channels: [],
    valuable_segments: '',
    common_objections: [],
    common_channels: [],
    trusted_platforms: [],
    complementary_problems: [],
    voc_data: [],
    notes: [],
  };

  // Get the selected profile or use default values
  const selectedProfile = selectedAudienceId 
    ? audienceProfiles.find(p => p.id === selectedAudienceId) ?? defaultAudienceProfile
    : defaultAudienceProfile;

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

            {/* Brand Panel */}
            <Tab.Panel className="space-y-6">
              <FormField
                label="Brand Name"
                id="brandName"
                placeholder="Enter your brand name"
                value={brandData.brand_name}
                onChange={(value) => handleBrandDataChange('brand_name', value)}
              />
              <FormField
                label="Tagline"
                id="tagline"
                placeholder="Your brand's tagline or slogan"
                value={brandData.tagline}
                onChange={(value) => handleBrandDataChange('tagline', value)}
              />
              <FormField
                label="Brand Values"
                id="values"
                type="textarea"
                placeholder="List your brand's core values"
                value={brandData.values}
                onChange={(value) => handleBrandDataChange('values', value)}
              />
              <FormField
                label="Voice and Tone"
                id="voiceTone"
                type="textarea"
                placeholder="Describe your brand's voice and tone"
                value={brandData.voice_tone}
                onChange={(value) => handleBrandDataChange('voice_tone', value)}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Visual Identity"
                  id="visualIdentity"
                  type="textarea"
                  placeholder="Describe your visual identity guidelines"
                  value={brandData.visual_identity}
                  onChange={(value) => handleBrandDataChange('visual_identity', value)}
                />
                <FormField
                  label="Color Palette"
                  id="colorPalette"
                  type="textarea"
                  placeholder="List your brand colors and their usage"
                  value={brandData.color_palette}
                  onChange={(value) => handleBrandDataChange('color_palette', value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Typography"
                  id="typography"
                  type="textarea"
                  placeholder="Describe your brand's typography"
                  value={brandData.typography}
                  onChange={(value) => handleBrandDataChange('typography', value)}
                />
                <FormField
                  label="Logo Usage"
                  id="logoUsage"
                  type="textarea"
                  placeholder="Guidelines for logo usage"
                  value={brandData.logo_usage}
                  onChange={(value) => handleBrandDataChange('logo_usage', value)}
                />
              </div>
            </Tab.Panel>

            {/* Channels Panel */}
            <Tab.Panel>
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No channels configured</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new channel.</p>
              </div>
            </Tab.Panel>

            {/* Audience Panel */}
            <Tab.Panel className="space-y-6">
              <div className="sm:flex sm:items-center sm:justify-between">
                <h2 className="text-lg font-medium text-gray-900">Audience Profiles</h2>
                <div className="mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={handleCreateAudienceProfile}
                    className="inline-flex items-center rounded-md border border-transparent bg-coral-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-coral-700 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Profile
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {audienceProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={classNames(
                      'relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-coral-500 focus-within:ring-offset-2 hover:border-gray-400',
                      selectedAudienceId === profile.id ? 'border-coral-500 bg-coral-50' : 'border-gray-300 bg-white'
                    )}
                    onClick={() => setSelectedAudienceId(profile.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex-shrink-0">
                      <div className={classNames(
                        'h-10 w-10 rounded-full flex items-center justify-center',
                        selectedAudienceId === profile.id ? 'bg-coral-600' : 'bg-coral-500'
                      )}>
                        <span className="text-white font-medium text-sm">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                      <p className="truncate text-sm text-gray-500">{profile.description || 'No description'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {selectedAudienceId && (
                <div className="mt-6">
                  <AudienceProfileDetails
                    profile={selectedProfile}
                    onProfileChange={(field, value) => handleAudienceProfileChange(selectedAudienceId, field, value)}
                    onAddVoiceOfCustomer={(data) => handleAddVoiceOfCustomer(selectedAudienceId, data)}
                    onAddNote={(data) => handleAddNote(selectedAudienceId, data)}
                  />
                </div>
              )}
            </Tab.Panel>

            {/* Product Panel */}
            <Tab.Panel>
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No products configured</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
              </div>
            </Tab.Panel>

            {/* Other panels */}
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
    <div className="py-6">
      <MarketingArchitectureContent />
    </div>
  );
}
