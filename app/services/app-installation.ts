import { PrismaClient } from "@prisma/client";
import { modelAppInstallation } from "../models/resource/shop/app-installation";
import  events  from "../helpers/event-notifications";
const prisma = new PrismaClient();


export const appInstallation = {
  // Function to get shop details based on the admin context
  storeAndSentEmail: async function (admin) {
    try {
      // Retrieve shop information using the admin context
      const shop = await modelAppInstallation.getshop(admin);
      const { id, myshopifyDomain, email } = shop;
      // Check if a store already exists in the database with the provided myshopifyDomain, email, and shopId
      const existingStore = await prisma.store.findFirst({
      where: {
      myshopifyDomain: myshopifyDomain, 
      email: email, 
      shopId: id    
      },
      });
       // If no existing store is found, create a new store record
      if (!existingStore) {
        const newStore = await prisma.store.create({
          data: {
            myshopifyDomain: myshopifyDomain, 
            email: email, 
            shopId: id  
          },
        });
        console.log("Inserted store:", newStore);
        events.emit('oscp:send:owner:appInstalled',newStore);
        }else{
        events.emit('oscp:send:owner:appInstalled',existingStore);
        }
        return shop;
    } catch (error) {
      console.error("Error inserting shop into store: ", error);
      throw error;
    }
  }
}