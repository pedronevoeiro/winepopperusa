import Medusa from "@medusajs/js-sdk"
import { medusaConfig } from "./config"

export const medusa = new Medusa({
  baseUrl: medusaConfig.backendUrl,
  publishableKey: medusaConfig.publishableKey,
})
