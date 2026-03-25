import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import { EasyPostApiClient } from "./client"
import type { EasyPostOptions, EasyPostAddress } from "./types"

type InjectedDependencies = {
  logger: Logger
}

class EasyPostFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "easypost"

  private client: EasyPostApiClient
  private logger: Logger

  constructor({ logger }: InjectedDependencies, options: EasyPostOptions) {
    super()
    this.logger = logger
    this.client = new EasyPostApiClient(options.apiKey)
    this.logger.info("EasyPost fulfillment provider initialized")
  }

  /**
   * Returns available shipping options (services).
   */
  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "easypost-standard",
        name: "Standard Shipping",
        carrier: "USPS",
        service: "Priority",
      },
      {
        id: "easypost-express",
        name: "Express Shipping",
        carrier: "USPS",
        service: "Express",
      },
      {
        id: "easypost-economy",
        name: "Economy Shipping",
        carrier: "USPS",
        service: "GroundAdvantage",
      },
    ]
  }

  /**
   * Validates the shipping option data.
   */
  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    const validIds = ["easypost-standard", "easypost-express", "easypost-economy"]
    return validIds.includes(data.id as string)
  }

  /**
   * Validates fulfillment data when a shipping method is selected by the customer.
   * Returns the data that will be stored on the fulfillment.
   */
  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any> {
    return {
      ...data,
      ...optionData,
    }
  }

  /**
   * Whether this provider supports dynamic price calculation.
   */
  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    return true
  }

  /**
   * Calculates the shipping price by calling EasyPost rates API.
   */
  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<{ calculated_amount: number; is_calculated_price_tax_inclusive: boolean }> {
    try {
      const shippingAddress = (context as any)?.shipping_address
      if (!shippingAddress) {
        return this.getFallbackPrice(optionData)
      }

      const toAddress: EasyPostAddress = {
        street1: shippingAddress.address_1 || shippingAddress.street1 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.province || shippingAddress.state || "",
        zip: shippingAddress.postal_code || shippingAddress.zip || "",
        country: shippingAddress.country_code || "US",
      }

      const shipment = await this.client.getRates(toAddress)
      const serviceType = (optionData.service as string) || "Priority"

      // Find the rate matching the requested service
      const matchingRate = shipment.rates.find(
        (r) => r.service === serviceType
      )

      if (matchingRate) {
        // EasyPost returns rates as strings in dollars, convert to cents
        const amountInCents = Math.round(parseFloat(matchingRate.rate) * 100)
        return {
          calculated_amount: amountInCents,
          is_calculated_price_tax_inclusive: false,
        }
      }

      return this.getFallbackPrice(optionData)
    } catch (error) {
      this.logger.warn(
        `EasyPost rate calculation failed, using fallback: ${(error as Error).message}`
      )
      return this.getFallbackPrice(optionData)
    }
  }

  /**
   * Creates a fulfillment (buys a shipping label via EasyPost).
   */
  async createFulfillment(
    data: Record<string, unknown>,
    items: Record<string, unknown>[],
    order: Record<string, unknown> | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; labels: any[] }> {
    try {
      const shippingAddress = (order as any)?.shipping_address
      if (!shippingAddress) {
        throw new Error("No shipping address provided for fulfillment")
      }

      const toAddress: EasyPostAddress = {
        name: `${shippingAddress.first_name || ""} ${shippingAddress.last_name || ""}`.trim(),
        street1: shippingAddress.address_1 || "",
        street2: shippingAddress.address_2 || "",
        city: shippingAddress.city || "",
        state: shippingAddress.province || "",
        zip: shippingAddress.postal_code || "",
        country: shippingAddress.country_code || "US",
        phone: shippingAddress.phone || "",
      }

      const shipment = await this.client.getRates(toAddress)
      const serviceType = (data.service as string) || "Priority"

      // Find best matching rate
      const rate = shipment.rates.find((r) => r.service === serviceType)
        || shipment.rates[0]

      if (!rate) {
        throw new Error("No shipping rates available")
      }

      // Buy the label
      const purchased = await this.client.buyLabel(shipment.id, rate.id)

      this.logger.info(
        `EasyPost label purchased: ${purchased.tracking_code} via ${rate.carrier} ${rate.service}`
      )

      return {
        data: {
          shipment_id: purchased.id,
          tracking_code: purchased.tracking_code,
          carrier: rate.carrier,
          service: rate.service,
          rate: rate.rate,
        },
        labels: [
          {
            tracking_number: purchased.tracking_code || "",
            tracking_url: purchased.tracker?.public_url || "",
            label_url: purchased.postage_label?.label_url || "",
          },
        ],
      }
    } catch (error) {
      this.logger.error(`EasyPost fulfillment creation failed: ${(error as Error).message}`)
      throw error
    }
  }

  /**
   * Cancels a fulfillment (refunds the label).
   */
  async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
    const shipmentId = data.shipment_id as string
    if (shipmentId) {
      await this.client.refundShipment(shipmentId)
      this.logger.info(`EasyPost shipment refunded: ${shipmentId}`)
    }
    return {}
  }

  /**
   * Creates a return fulfillment.
   */
  async createReturnFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; labels: any[] }> {
    // For returns, we create a new shipment with swapped addresses
    return {
      data: { ...fulfillment, is_return: true },
      labels: [],
    }
  }

  /**
   * Retrieves fulfillment documents (labels, customs forms, etc).
   */
  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: string
  ): Promise<void> {
    // Not implemented - labels are returned in createFulfillment
  }

  /**
   * Fallback prices when EasyPost API is unavailable.
   */
  private getFallbackPrice(
    optionData: Record<string, unknown>
  ): { calculated_amount: number; is_calculated_price_tax_inclusive: boolean } {
    const fallbackPrices: Record<string, number> = {
      Express: 1299,
      Priority: 599,
      GroundAdvantage: 499,
    }
    const service = (optionData.service as string) || "Priority"
    return {
      calculated_amount: fallbackPrices[service] || 599,
      is_calculated_price_tax_inclusive: false,
    }
  }
}

export default EasyPostFulfillmentService
