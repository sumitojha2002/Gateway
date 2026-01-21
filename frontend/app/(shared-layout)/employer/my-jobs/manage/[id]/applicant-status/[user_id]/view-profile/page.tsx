import { ViewProfilePage } from "@/components/applicant-status/view-profile/view-profile-page";

interface ParamProps {
  params: {
    user_id: number | string;
  };
}

async function page({ params }: ParamProps) {
  const { user_id } = await params;

  return (
    <div>
      <ViewProfilePage userId={user_id} />
    </div>
  );
}

export default page;
