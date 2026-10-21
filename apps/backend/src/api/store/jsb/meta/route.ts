import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "metadata", "variants.id", "variants.sku"],
    pagination: { take: 2000, skip: 0 },
  })

  res.json({
    products: products.map((product) => ({
      id: product.id,
      handle: product.handle,
      metadata: product.metadata,
      variants: product.variants,
    })),
  })
}
