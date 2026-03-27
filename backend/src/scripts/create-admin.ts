import { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Creates the first admin user.
 *
 * Usage (inside the container):
 *   npx medusa exec ./src/scripts/create-admin.ts
 *
 * Or set env vars before running:
 *   ADMIN_EMAIL=admin@winepopperusa.com ADMIN_PASSWORD=SecurePass123! npx medusa exec ./src/scripts/create-admin.ts
 */
export default async function createAdmin({ container }: ExecArgs) {
  const logger = container.resolve("logger")

  const email = process.env.ADMIN_EMAIL || "admin@winepopperusa.com"
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    logger.error("ADMIN_PASSWORD env var is required. Usage:")
    logger.error(
      "  ADMIN_EMAIL=admin@winepopperusa.com ADMIN_PASSWORD=YourPass123 npx medusa exec ./src/scripts/create-admin.ts"
    )
    process.exit(1)
  }

  try {
    // Create the user in Medusa's user module
    const userService = container.resolve(Modules.USER) as any
    const user = await userService.createUsers({
      email,
      first_name: "Admin",
      last_name: "Winepopper",
    })

    logger.info(`User created: ${user.id} (${email})`)

    // Set the password via auth module
    const authService = container.resolve(Modules.AUTH) as any
    await authService.createAuthIdentities({
      provider_identities: [
        {
          provider: "emailpass",
          entity_id: email,
          provider_metadata: { password },
        },
      ],
      app_metadata: {
        user_id: user.id,
      },
    })

    logger.info(`Auth identity created for ${email}`)
    logger.info("Admin user created successfully! You can now log in at /app")
  } catch (error: any) {
    if (error.message?.includes("already exists") || error.code === "23505") {
      logger.warn(`User ${email} already exists — skipping.`)
    } else {
      logger.error(`Failed to create admin: ${error.message}`)
      throw error
    }
  }
}
