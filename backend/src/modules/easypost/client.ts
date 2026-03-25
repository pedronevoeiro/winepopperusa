import EasyPostClient from "@easypost/api"
import type {
  EasyPostAddress,
  EasyPostParcel,
  EasyPostShipment,
} from "./types"

// Default parcel dimensions for Winepopper products (in inches / oz)
const DEFAULT_PARCEL: EasyPostParcel = {
  length: 12,
  width: 4,
  height: 4,
  weight: 16, // 1 lb
}

// Winepopper warehouse address (North Miami Beach, FL)
const FROM_ADDRESS: EasyPostAddress = {
  company: "Winepopper USA",
  street1: process.env.EASYPOST_FROM_STREET || "1720 NE Miami Gardens Drive",
  city: process.env.EASYPOST_FROM_CITY || "North Miami Beach",
  state: process.env.EASYPOST_FROM_STATE || "FL",
  zip: process.env.EASYPOST_FROM_ZIP || "33179",
  country: "US",
  phone: process.env.EASYPOST_FROM_PHONE || "",
}

export class EasyPostApiClient {
  private client: InstanceType<typeof EasyPostClient>

  constructor(apiKey: string) {
    this.client = new EasyPostClient(apiKey)
  }

  async getRates(
    toAddress: EasyPostAddress,
    parcel?: EasyPostParcel
  ): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.create({
      from_address: FROM_ADDRESS,
      to_address: toAddress,
      parcel: parcel || DEFAULT_PARCEL,
    })
    return shipment as unknown as EasyPostShipment
  }

  async buyLabel(
    shipmentId: string,
    rateId: string
  ): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.buy(shipmentId, { id: rateId })
    return shipment as unknown as EasyPostShipment
  }

  async refundShipment(shipmentId: string): Promise<void> {
    await this.client.Shipment.refund(shipmentId)
  }

  async getShipment(shipmentId: string): Promise<EasyPostShipment> {
    const shipment = await this.client.Shipment.retrieve(shipmentId)
    return shipment as unknown as EasyPostShipment
  }
}
