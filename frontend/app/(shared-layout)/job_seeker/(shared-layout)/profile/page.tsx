import JobSeekerProfile from "@/components/profile/jobseeker-profile";
import fetcher from "@/helper/fetcher";
import { URLS } from "@/constants";

interface UserProfile {
  user_name: string;
  email: string;
  contact: string;
  dob: string;
  years_of_experience: string;
  experience_level: string;
  location: string;
  bio: string;
  education: any[];
  skills: any[];
  experiences: any[];
  linkedin_url?: string;
  portfolio_url?: string;
  profile_pic?: string;
  cv?: string;
}

export default async function page() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // if (status === "unauthenticated") {
  //   router.push("/"); // Redirect to homepage
  //   return null; // Prevent rendering anything while redirecting
  // }

  type Skill = {
    id: number;
    name: string;
  };

  type SkillData = {
    data: Skill[];
  };

  const user = await fetcher<{ data: UserProfile }>(URLS.JS_PROFILE);
  const userData = user?.data;
  //console.log("User Data:", userData);
  // Authenticated
  const skillList = await fetcher<SkillData>(URLS.JS_SKILLS);
  const skillListData = skillList.data;
  //console.log("Skills Data:", skillList);
  return (
    <div>
      <JobSeekerProfile user={userData} skillList={skillListData} />
    </div>
  );
}
