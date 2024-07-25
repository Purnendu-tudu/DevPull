"use server"


import { lucia } from "@/auth";
import prisma from "@/lib/prisma";
import { LoginValues, loginSchema } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
    credentails : LoginValues
):Promise<{error: string}> {
    try {

        const {username, password} = loginSchema.parse(credentails);

        const exisitingUser = await prisma.user.findFirst({
            where : {
                username : {
                    equals : username,
                    mode: 'insensitive'
                }
            }
        })

        if(!exisitingUser || !exisitingUser.passwordHash){
            return {
                error : "Incorrect Username and Password"
            }
        }

        const validPassword = await verify(exisitingUser.passwordHash, password, {
            memoryCost: 19456,
            timeCost: 32,
            parallelism : 1
        })

        if(!validPassword) {
            return {
                error : "Incorrect username or password"
            }
        }

        const session = await lucia.createSession(exisitingUser.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        cookies().set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        )

        return redirect("/");
         
    } catch (error) {
        if(isRedirectError(error)) throw error;
        console.log(error);
        return {
            error : "Somethign went wrong. Please Try again "
        }
    }
}
