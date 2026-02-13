import EmployerProfile from "@/components/profile/employer-profile";
import { URLS } from "@/constants";
import fetcher from "@/helper/fetcher";

interface User {
  data: object;
}

async function page() {
  const user: User = await fetcher(URLS.EMP_PROFILE);
  //console.log(user);
  const userData = user.data;
  return (
    <div>
      <EmployerProfile user={userData} />
    </div>
  );
}

export default page;
