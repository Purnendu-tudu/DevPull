import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import {FileRouter, createUploadthing} from "uploadthing/next";
import { UTApi, UploadThingError } from "uploadthing/server";

const f = createUploadthing();


export const fileRouter = {
    avatar: f({
        image: { maxFileSize: "512KB"}
    })
    .middleware(async () => {
        const { user } = await validateRequest();
        if(!user){
            throw new UploadThingError("Unauthorized");
        }

        return {user};
    }).onUploadComplete(async ({metadata, file}) => {

        //here is the logic to delete the old avatr image from the upload thing

        const oldAvatarUrl = metadata.user.avatarUrl;
        // console.error(metadata);
        if(oldAvatarUrl){
            const key = oldAvatarUrl.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1]
            console.log("helooo")
            console.log(key)

            await new UTApi().deleteFiles(key); //upload thing api to delete old avatar
        }

        //here is the logic to optimize and only for our images
        const  newAvatarUrl = file.url.replace("/f/",`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)

        await prisma.user.update({
            where: {id: metadata.user.id},
            data:{
                avatrUrl: newAvatarUrl,
            }
        });

        return {avatarUrl: newAvatarUrl}
    }),

    attachment : f({
        image : {maxFileSize: "4MB", maxFileCount: 5},
        video : {maxFileSize: "64MB", maxFileCount: 5}
    })
    .middleware(async () => {
        const {user} = await validateRequest();
        if(!user){
            throw new UploadThingError("Unauthorized");
        }

        return { }

    })
    .onUploadComplete(async ({file}) => {
        const media = await prisma.media.create({
            data : {
                url : file.url.replace("/f/",`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`),
                type: file.type.startsWith("image") ? "IMAGE" : "VIDEO"
            }
        })

        return {mediaId: media.id}
    })

} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;