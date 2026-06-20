import { applicationRepository } from "../repositories/application.repository";
import { ApplicationStatus } from "../shared/enum";

export const applicationService = {
    findAllApplicationByUserId:async(userId:number) =>{
        console.log("[application.findAllApplicationByUserId] start", { userId });

        const applications = await applicationRepository.findAllApplicationByUserId(userId);

        console.log("[application.findAllApplicationByUserId ✅] success application count",  applications.length );

        return applications;

    },
    updateApplicationStatus: async (
        applicationId: number,
        status: ApplicationStatus,
        userId: number
      ) => {
        console.log("[application.updateApplicationStatus] start", {
          applicationId,
          status,
          userId,
        });
    
       
        const application =
          await applicationRepository.findApplicationById(applicationId);

          console.log("APPLICATION",application)

    
        // const target = applications.find((a) => a.id === applicationId);

    
        // if (!target) {
        //   throw new Error("APPLICATION_NOT_FOUND or NOT_AUTHORIZED");
        // }
    
       
        const updatedApplication = await applicationRepository.updateStatus(
          applicationId,
          status
        );
    
        console.log("[application.updateApplicationStatus ✅] success", {
          applicationId,
          status,
        });
    
        return updatedApplication;
      },
}