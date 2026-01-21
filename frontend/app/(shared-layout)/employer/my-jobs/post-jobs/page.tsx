import { PostJobs } from "@/components/myJobs/employer/post-jobs";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";

type Skill = {
  id: number;
  name: string;
};

type SkillData = {
  data: Skill[];
};

export default async function EmployerMyJobs() {
  const skills = await fetcher<SkillData>(URLS.JS_SKILLS);

  return <PostJobs skills={skills.data} />;
}
