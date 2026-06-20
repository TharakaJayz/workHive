import { applicationRepository } from "../repositories/application.repository";

export const applicationService = {
    findAllApplicationByUserId:async(userId:number) =>{
        console.log("[application.findAllApplicationByUserId] start", { userId });

        const applications = await applicationRepository.findAllApplicationByUserId(userId);

        console.log("[application.findAllApplicationByUserId ✅] success application count",  applications.length );

        return applications;

    }
}