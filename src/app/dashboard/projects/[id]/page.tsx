import { Metadata } from 'next';
import ProjectDetailClient from './ProjectDetailClient';

export const metadata: Metadata = {
  title: 'Project Details',
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProjectDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  await searchParams; // Need to await searchParams to satisfy TypeScript
  return <ProjectDetailClient projectId={id} />;
}
