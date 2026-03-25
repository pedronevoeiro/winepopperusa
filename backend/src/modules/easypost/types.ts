export type EasyPostOptions = {
  apiKey: string
}

export type EasyPostAddress = {
  name?: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  email?: string
}

export type EasyPostParcel = {
  length: number
  width: number
  height: number
  weight: number // in oz
}

export type EasyPostRate = {
  id: string
  carrier: string
  service: string
  rate: string
  currency: string
  delivery_days: number | null
  est_delivery_days: number | null
}

export type EasyPostShipment = {
  id: string
  rates: EasyPostRate[]
  postage_label?: {
    label_url: string
  }
  tracking_code?: string
  tracker?: {
    public_url: string
  }
  selected_rate?: EasyPostRate
  lowestRate: (carriers?: string[], services?: string[]) => EasyPostRate
}
