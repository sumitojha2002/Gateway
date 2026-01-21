import RegisterPage from "@/components/auth/register-jobseeker-page";
import Image from "next/image";
import Vector from "@/public/Vector 1.png";
import { BackButton } from "@/components/profile/button/back-button";
function page() {
  return (
    <div className="flex justify-center md:justify-end md:items-baseline-last h-screen bg-[#EFECE3]">
      <div className="md:mr-30 md:mb-30 mt-40 ">
        <div className="md:absolute top-0 left-170 z-0 hidden md:flex">
          <Image src={Vector} alt={"alt"} className="h-screen fixed" />
        </div>
        <h1 className="text-9xl md:absolute md:top-96.75 md:left-27 font-bold text-[#4A70A9] hidden md:flex z-0">
          Gateway
        </h1>
        <div className="absolute top-20 md:left-10 left-5 cursor-pointer">
          <BackButton />
        </div>
        <div className="md:w-143 w-screen z-20 relative ">
          <RegisterPage />
        </div>
      </div>
    </div>
  );
}

export default page;
