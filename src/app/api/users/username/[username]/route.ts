import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } },
) {
  try {
    const {user: loggedinUser} = await validateRequest();

    if(!loggedinUser){
        return Response.json({ erro: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where:{
            username:{
                equals: username,
                mode:"insensitive"
            }
        },
        select: getUserDataSelect(loggedinUser.id)
    })

    if(!user){
        return Response.json({error:"User Not found"},{status:404});
    }

    return Response.json(user);


  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server error" }, { status: 500 });
  }
}
