import {
  defineMiddlewares,
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

/**
 * Block public user registration.
 *
 * Medusa v2 exposes POST /auth/user/emailpass/register by default,
 * allowing anyone to create admin accounts. This middleware returns
 * 403 on that route so the only way to create users is via the CLI
 * inside the container: `npx medusa user -e <email> -p <password>`
 */
const blockUserRegistration = (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  res.status(403).json({
    message: "Public registration is disabled.",
  })
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/auth/user/emailpass/register",
      method: "POST",
      middlewares: [blockUserRegistration],
    },
  ],
})
