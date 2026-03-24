import {
  ExecArgs,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IShippingModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger")

  // ── Region ────────────────────────────────────────────────
  logger.info("Creating US region...")
  const regionService: IRegionModuleService = container.resolve(Modules.REGION)
  const [usRegion] = await regionService.createRegions([
    {
      name: "United States",
      currency_code: "usd",
      countries: ["us"],
    },
  ])
  logger.info(`Region created: ${usRegion.id}`)

  // ── Sales Channel ─────────────────────────────────────────
  logger.info("Creating sales channel...")
  const salesChannelService: ISalesChannelModuleService = container.resolve(
    Modules.SALES_CHANNEL
  )
  const [webChannel] = await salesChannelService.createSalesChannels([
    {
      name: "Winepopper Web Store",
      description: "Main online store for Winepopper USA",
    },
  ])
  logger.info(`Sales channel created: ${webChannel.id}`)

  // ── Products ──────────────────────────────────────────────
  logger.info("Creating products...")
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT)

  const products = await productService.createProducts([
    {
      title: "Winepopper Aluminum | Automatic Gas Corkscrew",
      handle: "winepopper-aluminum",
      description: `<div>
        <h3>Open Wine Like Magic</h3>
        <p>Experience effortless wine opening with the Winepopper Aluminum. Using advanced pneumatic pressure technology, this premium corkscrew extracts any cork in under 3 seconds — without pulling, twisting, or breaking.</p>
        <h4>How It Works</h4>
        <p>Simply place the Winepopper over the bottle, press the button, and watch the cork glide out smoothly. The inert gas technology preserves the wine's natural properties, aroma, and flavor.</p>
        <h4>What's Included</h4>
        <ul>
          <li>1x Winepopper Aluminum Corkscrew</li>
          <li>2x Gas Cartridges (~30 openings each)</li>
          <li>1x Foil Cutter</li>
          <li>1x Instruction Manual</li>
        </ul>
        <h4>Specifications</h4>
        <ul>
          <li>Material: Stainless Steel & Aluminum</li>
          <li>Dimensions: 15 x 5 x 5 cm</li>
          <li>Weight: 400g</li>
          <li>Color: Black</li>
        </ul>
      </div>`,
      status: "published",
      is_giftcard: false,
      weight: 400,
      options: [{ title: "Default", values: ["Default"] }],
      variants: [
        {
          title: "Default",
          sku: "FWPPE001",
          manage_inventory: true,
          prices: [{ amount: 3490, currency_code: "usd" }],
          options: { Default: "Default" },
          metadata: { compare_at_price: 4990 },
        },
      ],
      images: [
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/winepopper-fotos-ok-03.jpg" },
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/winepopper-fotos-ok-01.jpg" },
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/winepopper-fotos-ok-02.jpg" },
      ],
      metadata: {
        shopify_id: "7830029926597",
        compare_at_price: 4990,
      },
    },
    {
      title: "Winepopper Lite | Automatic Gas Corkscrew",
      handle: "winepopper-lite",
      description: `<div>
        <h3>Open Wine Like Magic</h3>
        <p>The Winepopper Lite brings the same revolutionary pneumatic technology in a lightweight, compact design. Perfect for everyday use and travel.</p>
        <h4>How It Works</h4>
        <p>Place over the bottle, press, and the cork glides out in seconds. The inert gas preserves the wine's natural properties and flavor.</p>
        <h4>What's Included</h4>
        <ul>
          <li>1x Winepopper Lite Corkscrew</li>
          <li>1x Gas Cartridge (~30 openings)</li>
          <li>1x Foil Cutter</li>
          <li>1x Instruction Manual</li>
        </ul>
        <h4>Specifications</h4>
        <ul>
          <li>Weight: 150g</li>
          <li>Color: Black</li>
        </ul>
      </div>`,
      status: "published",
      is_giftcard: false,
      weight: 150,
      options: [{ title: "Default", values: ["Default"] }],
      variants: [
        {
          title: "Default",
          sku: "FWPPE002",
          manage_inventory: true,
          prices: [{ amount: 2490, currency_code: "usd" }],
          options: { Default: "Default" },
          metadata: { compare_at_price: 3490 },
        },
      ],
      images: [
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/winepopper-fotos-ok-03_49b65655-dbba-4da4-90b5-2911de42749d.jpg" },
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/winepopper-fotos-ok-01_debe80df-fca4-4227-8865-0fd30da60225.jpg" },
      ],
      metadata: {
        shopify_id: "8474686357701",
        compare_at_price: 3490,
      },
    },
    {
      title: "Refill Gas Capsule for Winepopper Corkscrew",
      handle: "refill-gas-capsule",
      description: `<div>
        <h3>Keep Your Winepopper Ready</h3>
        <p>Compatible replacement gas capsules for all Winepopper models. Each capsule provides approximately 30 bottle openings with clean, safe, and consistent pressure.</p>
        <h4>Features</h4>
        <ul>
          <li>~30 openings per capsule</li>
          <li>Ozone-friendly inert gas</li>
          <li>Compatible with Winepopper Aluminum and Lite</li>
          <li>Easy twist-on installation</li>
        </ul>
      </div>`,
      status: "published",
      is_giftcard: false,
      weight: 50,
      options: [{ title: "Quantity", values: ["1 Capsule", "2 Capsules", "4 Capsules", "10 Capsules"] }],
      variants: [
        {
          title: "1 Capsule",
          sku: "FWPPE-REFILL-1",
          manage_inventory: true,
          prices: [{ amount: 990, currency_code: "usd" }],
          options: { Quantity: "1 Capsule" },
        },
        {
          title: "2 Capsules",
          sku: "FWPPE-REFILL-2",
          manage_inventory: true,
          prices: [{ amount: 1580, currency_code: "usd" }],
          options: { Quantity: "2 Capsules" },
        },
        {
          title: "4 Capsules",
          sku: "FWPPE-REFILL-4",
          manage_inventory: true,
          prices: [{ amount: 2760, currency_code: "usd" }],
          options: { Quantity: "4 Capsules" },
        },
        {
          title: "10 Capsules",
          sku: "FWPPE-REFILL-10",
          manage_inventory: true,
          prices: [{ amount: 5980, currency_code: "usd" }],
          options: { Quantity: "10 Capsules" },
        },
      ],
      images: [
        { url: "https://cdn.shopify.com/s/files/1/0656/6248/4677/files/refill-capsule-01.jpg" },
      ],
      metadata: {
        shopify_id: "8377671123141",
      },
    },
  ])

  logger.info(`Created ${products.length} products`)
  logger.info("Seed completed successfully!")
}
