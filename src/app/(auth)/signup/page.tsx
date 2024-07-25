import { Metadata } from "next";
import signUpImage from "@/assets/signup-image.jpg"
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="shadow-2xl flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-clip rounded-2xl bg-card">
        <div className="md:w-1/2 w-full sapce-y-10 overflow-y-auto p-10">
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold">SignUp to DevPull</h1>
                <p className="text-muted-foreground">
                    A palce where <span className="italic" >you</span> can pull ideas with friend. 
                </p>
            </div>
            <div className="space-y-5">
                <SignUpForm/>
                <Link href="/login" className="block text-center hover:underline">
                    Alreay have an account? Log in
                </Link>

            </div>
        </div>
        <Image src={signUpImage} alt="" className="w-1/2 hidden md:block object-cover"/>
      </div>
    </main>
  );
}
