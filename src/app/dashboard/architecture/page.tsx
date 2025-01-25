'use client';

import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Tab } from '@headlessui/react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
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
  archived?: boolean;
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

  // Ensure value is never null or undefined
  const safeValue = value ?? '';

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
          value={safeValue}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}

function MarketingArchitectureContent() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | undefined>();
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

  useEffect(() => {
    if (user?.id) {
      setCompanyData(prev => ({ ...prev, user_id: user.id }));
      setBrandData(prev => ({ ...prev, user_id: user.id }));
    }
  }, [user?.id]);

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

  // Fetch team members and ensure current user is included
  const fetchTeamMembers = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
      return;
    }
    
    if (!companyData.id) {
      console.log('No company ID available');
      return;
    }

    console.log('Attempting to fetch team members with:', {
      userId: user.id,
      userEmail: user.email,
      companyId: companyData.id,
      companyName: companyData.name
    });

    try {
      // First check if the current user is already a team member
      const { data: existingMembers, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', companyData.id)
        .eq('email', user.email);

      if (fetchError) {
        console.error('Error checking existing team member:', {
          error: fetchError,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code
        });
        throw fetchError;
      }

      console.log('Existing member check result:', existingMembers);

      // If user is not a team member, add them
      if (!existingMembers || existingMembers.length === 0) {
        console.log('Current user not found as team member, adding...');
        
        const { data: insertedMember, error: insertError } = await supabase
          .from('team_members')
          .insert([{
            company_id: companyData.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email,
            role: 'Owner',
            roleDescription: 'Company owner and administrator'
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error inserting team member:', {
            error: insertError,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          });
          throw insertError;
        }

        console.log('Successfully added current user as team member:', insertedMember);
      }

      // Fetch all team members
      const { data: allMembers, error: allMembersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('company_id', companyData.id);

      if (allMembersError) {
        console.error('Error fetching all team members:', {
          error: allMembersError,
          message: allMembersError.message,
          details: allMembersError.details,
          hint: allMembersError.hint,
          code: allMembersError.code
        });
        throw allMembersError;
      }

      console.log('Successfully fetched all team members:', allMembers);
      setTeamMembers(allMembers || []);

    } catch (error: any) {
      console.error('Team members operation failed:', {
        error,
        message: error.message,
        name: error.name,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
      setTeamMembers([]); // Reset to empty array on error
    }
  }, [user, companyData]);

  useEffect(() => {
    if (companyData.id) {
      fetchTeamMembers();
    }
  }, [fetchTeamMembers, companyData.id]);

  const handleEditTeamMember = (member: TeamMember) => {
    setSelectedTeamMember(member);
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = async (memberData: Omit<TeamMember, 'id'>) => {
    if (!user?.id || !companyData.id) return;

    try {
      if (selectedTeamMember) {
        // Update existing team member
        const { data: updatedMember, error } = await supabase
          .from('team_members')
          .update({
            name: memberData.name,
            role: memberData.role,
            roleDescription: memberData.roleDescription,
            // Don't update email if it's the current user
            ...(selectedTeamMember.email !== user.email ? { email: memberData.email } : {})
          })
          .eq('id', selectedTeamMember.id)
          .select()
          .single();

        if (error) throw error;

        setTeamMembers(prev => prev.map(m => m.id === selectedTeamMember.id ? updatedMember : m));
      } else {
        // Add new team member
        const { data: newMember, error } = await supabase
          .from('team_members')
          .insert([{
            ...memberData,
            company_id: companyData.id
          }])
          .select()
          .single();

        if (error) throw error;

        setTeamMembers(prev => [...prev, newMember]);
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }

    setSelectedTeamMember(undefined);
    setIsTeamModalOpen(false);
  };

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
    if (!user?.id) return;

    try {
      const { data: newVoc, error } = await supabase
        .from('voice_of_customer')
        .insert([{
          ...vocData,
          audience_profile_id: profileId,
        }])
        .select()
        .single();

      if (error) throw error;

      if (newVoc) {
        setAudienceProfiles(profiles => profiles.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              voc_data: [...(profile.voc_data || []), newVoc],
            };
          }
          return profile;
        }));
      }
    } catch (error) {
      console.error('Error adding voice of customer:', error);
    }
  };

  const handleAddNote = async (profileId: string, noteData: Omit<AudienceNote, 'id' | 'audience_profile_id' | 'created_by'>) => {
    if (!user?.id) return;

    try {
      const { data: newNote, error } = await supabase
        .from('audience_notes')
        .insert([{
          ...noteData,
          audience_profile_id: profileId,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      if (newNote) {
        setAudienceProfiles(profiles => profiles.map(profile => {
          if (profile.id === profileId) {
            return {
              ...profile,
              notes: [...(profile.notes || []), newNote],
            };
          }
          return profile;
        }));
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleCreateAudienceProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: newProfile, error } = await supabase
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

      if (newProfile) {
        setAudienceProfiles([...audienceProfiles, newProfile]);
        setSelectedAudienceId(newProfile.id);
      }
    } catch (error: unknown) {
      console.error('Error creating audience profile:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleArchiveAudienceProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('audience_profiles')
        .update({ archived: true })
        .eq('id', profileId);

      if (error) throw error;

      setAudienceProfiles(audienceProfiles.filter(p => p.id !== profileId));
      if (selectedAudienceId === profileId) {
        setSelectedAudienceId(null);
      }
    } catch (error: unknown) {
      console.error('Error archiving audience profile:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleDeleteAudienceProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('audience_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      setAudienceProfiles(audienceProfiles.filter(p => p.id !== profileId));
      if (selectedAudienceId === profileId) {
        setSelectedAudienceId(null);
      }
    } catch (error: unknown) {
      console.error('Error deleting audience profile:', error instanceof Error ? error.message : String(error));
    }
  };

  const formatDateForInput = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  useEffect(() => {
    fetchCompanyData();
    fetchBrandData();
    fetchAudienceProfiles();
  }, [fetchCompanyData, fetchBrandData, fetchAudienceProfiles]);

  // Initialize state with empty arrays and strings
  const defaultAudienceProfile: AudienceProfile = {
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

  // Update defaultAudienceProfile when user is available
  const currentAudienceProfile = user?.id
    ? { ...defaultAudienceProfile, user_id: user.id }
    : defaultAudienceProfile;

  // Get the selected profile or use default values
  const selectedProfile = selectedAudienceId 
    ? audienceProfiles.find(p => p.id === selectedAudienceId) || currentAudienceProfile
    : currentAudienceProfile;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Marketing Architecture</h1>
          <p className="mt-2 text-sm text-gray-700">
            Define and manage your marketing foundation, strategy, and infrastructure.
          </p>
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
            <Tab.Panel>
              <div className="space-y-6">
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
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Team Members</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          Manage your team and their roles.
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => setIsTeamModalOpen(true)}
                          className="inline-flex items-center rounded-md bg-coral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
                        >
                          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                          Add Team Member
                        </button>
                      </div>
                    </div>
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
                            <button
                              onClick={() => handleEditTeamMember(member)}
                              className="focus:outline-none w-full text-left"
                            >
                              <p className="text-sm font-medium text-gray-900">{member.name}</p>
                              <p className="truncate text-sm text-gray-500">{member.role}</p>
                              <p className="truncate text-xs text-gray-400">{member.email}</p>
                            </button>
                          </div>
                          {member.email === user?.email && (
                            <div className="flex-shrink-0">
                              <span className="inline-block px-2 py-1 text-xs font-medium text-coral-700 bg-coral-50 rounded-full">
                                Owner
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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
              <div className="border-b border-gray-200 pb-5 mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Audience Profiles</h2>
                    <p className="mt-2 text-sm text-gray-500">
                      Create and manage detailed profiles of your target audience segments.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateAudienceProfile}
                    type="button"
                    className="inline-flex items-center rounded-md bg-coral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-600"
                  >
                    <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-white" aria-hidden="true" />
                    New Profile
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {audienceProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={classNames(
                      'relative flex items-center space-x-3 rounded-lg border px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-coral-500 focus-within:ring-offset-2 hover:border-gray-400',
                      selectedAudienceId === profile.id ? 'border-coral-500 bg-coral-50' : 'border-gray-300 bg-white'
                    )}
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
                    <div 
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => setSelectedAudienceId(profile.id)}
                    >
                      <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                      <p className="truncate text-sm text-gray-500">{profile.description || 'No description'}</p>
                    </div>
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button className="flex items-center rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2">
                          <span className="sr-only">Open options</span>
                          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => setSelectedAudienceId(profile.id)}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                >
                                  Edit
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleArchiveAudienceProfile(profile.id)}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                >
                                  Archive
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleDeleteAudienceProfile(profile.id)}
                                  className={classNames(
                                    active ? 'bg-gray-100 text-red-900' : 'text-red-700',
                                    'block w-full px-4 py-2 text-left text-sm'
                                  )}
                                >
                                  Delete
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ))}
              </div>

              {selectedAudienceId && (
                <div className="mt-6">
                  <AudienceProfileDetails
                    profile={selectedProfile}
                    onProfileChange={(field, value) => handleEditAudienceProfile(selectedAudienceId, field, value)}
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
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedTeamMember(undefined);
        }}
        onSave={handleSaveTeamMember}
        initialMember={selectedTeamMember}
        currentUserEmail={user?.email}
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
