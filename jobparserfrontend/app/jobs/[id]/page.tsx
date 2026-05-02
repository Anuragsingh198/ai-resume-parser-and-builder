import { redirect } from 'next/navigation';

interface LegacyJobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LegacyJobDetailPage({ params }: LegacyJobDetailPageProps) {
  const { id } = await params;
  redirect(`/job/${id}`);
}
