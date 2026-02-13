import { EditJob, UserData } from "@/components/myJobs/employer/edit-job";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";

interface PageProps {
  params: {
    id: string;
  };
}

interface User {
  data: UserData;
  message: string;
  status: number;
}

interface Skill {
  id: number;
  name: string;
}

interface Skills {
  data: Skill[];
  message: string;
  status: number;
}

async function page({ params }: PageProps) {
  const { id } = await params;
  const userById = await fetcher<User>(URLS.GET_JOB_BY_ID(id));
  const user = userById.data;
  //console.log("user:", user);
  const message = userById.message;
  const status = userById.status;
  const skills = await fetcher<Skills>(URLS.JS_SKILLS);
  const skillsData = skills.data;
  return (
    <div>
      <EditJob skills={skillsData} data={user} />
    </div>
  );
}

export default page;
