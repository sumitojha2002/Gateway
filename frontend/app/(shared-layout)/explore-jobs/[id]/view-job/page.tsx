import { JobDetail } from "@/components/jobs/JobDetail/job-detail";

interface JobPageProps {
  params: {
    id: number | string;
  };
  jobId: string;
}

export default async function page({ params }: JobPageProps) {
  const { id } = await params;

  return (
    <div >
      <JobDetail jobId={id} />
    </div>
  );
}
