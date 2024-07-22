"use server";

import { nanoid } from 'nanoid'
import { liveblocks } from '@/lib/liveblocks'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getAccessType, parseStringify } from '@/lib/utils'

export const createDocument = async ({ email, userId } : CreateDocumentParams) => {
    const roomId = nanoid()

    try{
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        const usersAccesses: RoomAccesses = {
            [email]: ['room:write']
        }
    
        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses,
            defaultAccesses: []
        });
        
        revalidatePath('/');
        return parseStringify(room);
    }catch(error){
        console.log(`Error hapeend while creating a room : ${error}`)
    }
}

export const getDocument = async ({ roomId, userId }: { roomId: string; userId: string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
    
        const hasAccess = Object.keys(room.usersAccesses).includes(userId);
        if(!hasAccess) {
            throw new Error('You do not have access to this document');
        }
        
        return parseStringify(room);
    } catch (error) {
        console.log(`Error happened while getting a room: ${error}`);
    }
}

export const updateDocument = async ({ roomId, title }: { roomId : string, title : string }) => {
    try {
        const updatedRoom = await liveblocks.updateRoom(roomId, {
            metadata : {
                title : title
            }
        })

        revalidateTag(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
        console.log(`Error happend while updating a room : ${error}`)
    }
}

export const getAllDocuments = async (email:string) => {
    try{
        const rooms = await liveblocks.getRooms({ userId : email })

        return parseStringify(rooms)
    }catch(error){
        console.log(`Error while getting all the documents : ${error}`)
    }
}

export const deleteDocument = async (roomId: string) => {
    try{
        const deleteRoom = await liveblocks.deleteRoom(roomId)

        return parseStringify(deleteRoom)
    }catch(error){
        console.log(`Error while deleting a document : ${error}`)
    }
}

export const updateDocumentAccess = async ({ roomId , email, userType, updatedBy }: ShareDocumentParams) => {
    try{
        const usersAccesses: RoomAccesses = {
            [email] : getAccessType(userType) as AccessType
        }

        const room = await liveblocks.updateRoom(roomId, {
            usersAccesses
        })

        if(room) {
            const notificationId = nanoid()

            await liveblocks.triggerInboxNotification({
                userId: email,
                kind: '$documentAccess',
                subjectId: notificationId,
                activityData: {
                    userType,
                    title: `You have be granted ${userType} access to the document by ${updatedBy.name}.`,
                    updatedBy: updatedBy.avatar,
                    email : updatedBy.email
                },
                roomId
            })
        }

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room)
    }catch(error:any){
        console.log(`Error while updating a document access ${error}`)
    }
}

export const removeCollaborator = async ({ roomId, email } : { roomId: string, email: string}) => {
    try{
        const room = await liveblocks.getRoom(roomId);

        if(room.metadata.email === email){
            throw Error("You cannot remove your self from the document !!");
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses : {
                [email] : null
            }
        })
        
        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    }catch(error){
        console.log(`Error happend while we remove a collaborator ${error}`)
    }
}