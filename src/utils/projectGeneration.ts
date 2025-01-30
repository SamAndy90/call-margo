import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { addWeeks, addMonths, eachWeekOfInterval, eachMonthOfInterval, format } from 'date-fns';

type Supabase = SupabaseClient<Database>;

export async function generateProjectsForCampaign(
  supabase: Supabase,
  campaignId: string,
  startDate: Date,
  endDate: Date,
  frequency: 'weekly' | 'monthly' | 'quarterly',
  distributionChannels: string[],
  userId: string
) {
  try {
    // Get the campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*, tactics(*)')
      .eq('id', campaignId)
      .single();

    if (campaignError) throw campaignError;
    if (!campaign) throw new Error('Campaign not found');

    // Generate dates based on frequency
    const dates = frequency === 'weekly'
      ? eachWeekOfInterval({ start: startDate, end: endDate })
      : frequency === 'monthly'
        ? eachMonthOfInterval({ start: startDate, end: endDate })
        : Array.from({ length: Math.ceil(endDate.getMonth() - startDate.getMonth() + 12 * (endDate.getFullYear() - startDate.getFullYear()) / 3) })
            .map((_, i) => addMonths(startDate, i * 3));

    // Create a project for each date
    const projects = dates.map((date) => ({
      name: `${campaign.name} - ${format(date, 'MMM d, yyyy')}`,
      description: `Auto-generated project for campaign: ${campaign.name}`,
      campaign_id: campaignId,
      start_date: format(date, 'yyyy-MM-dd'),
      end_date: format(
        frequency === 'weekly' ? addWeeks(date, 1)
          : frequency === 'monthly' ? addMonths(date, 1)
          : addMonths(date, 3),
        'yyyy-MM-dd'
      ),
      status: 'draft',
      created_by: userId,
    }));

    // Insert projects
    const { data: createdProjects, error: projectError } = await supabase
      .from('projects')
      .insert(projects)
      .select();

    if (projectError) throw projectError;
    if (!createdProjects) throw new Error('Failed to create projects');

    // Create tasks for each distribution channel for each project
    const tasks = createdProjects.flatMap((project) =>
      distributionChannels.map((channel) => ({
        name: `${channel} - ${campaign.tactics?.name || 'Content'}`,
        description: `Create and distribute content for ${channel}`,
        project_id: project.id,
        status: 'todo',
        created_by: userId,
      }))
    );

    const { error: taskError } = await supabase
      .from('tasks')
      .insert(tasks);

    if (taskError) throw taskError;

    return createdProjects;
  } catch (error) {
    console.error('Error generating projects:', error);
    throw error;
  }
}

export async function handleCampaignDeletion(
  supabase: Supabase,
  campaignId: string,
  deleteProjects: boolean
) {
  try {
    if (deleteProjects) {
      // Get all projects for this campaign
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('campaign_id', campaignId);

      if (projectError) throw projectError;

      if (projects && projects.length > 0) {
        // Delete all tasks for these projects
        const { error: taskError } = await supabase
          .from('tasks')
          .delete()
          .in('project_id', projects.map(p => p.id));

        if (taskError) throw taskError;

        // Delete the projects
        const { error: projectDeleteError } = await supabase
          .from('projects')
          .delete()
          .eq('campaign_id', campaignId);

        if (projectDeleteError) throw projectDeleteError;
      }
    } else {
      // Update projects to have no campaign
      const { error: updateError } = await supabase
        .from('projects')
        .update({ campaign_id: null })
        .eq('campaign_id', campaignId);

      if (updateError) throw updateError;
    }

    // Delete the campaign
    const { error: campaignError } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (campaignError) throw campaignError;

  } catch (error) {
    console.error('Error handling campaign deletion:', error);
    throw error;
  }
}
