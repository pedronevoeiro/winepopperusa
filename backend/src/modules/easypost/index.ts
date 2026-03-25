import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import EasyPostFulfillmentService from "./service"

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [EasyPostFulfillmentService],
})
