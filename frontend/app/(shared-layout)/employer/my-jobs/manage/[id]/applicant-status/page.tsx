import { ApplicantStatus } from "@/components/applicant-status/applicant-status";

interface Params {
  params: {
    id: number | string;
  };
}

export default async function page({ params }: Params) {
  const { id } = await params;
  return <ApplicantStatus id={id} />;
}
