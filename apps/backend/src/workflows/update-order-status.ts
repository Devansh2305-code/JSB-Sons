import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type UpdateOrderStatusInput = {
  order_id: string
  status: string
}

const updateOrderStatusStep = createStep(
  "update-jsb-order-status",
  async (input: UpdateOrderStatusInput, { container }) => {
    const orderService = container.resolve(Modules.ORDER)
    const order = await orderService.retrieveOrder(input.order_id)
    const previousMetadata = order.metadata ?? {}

    await orderService.updateOrders(input.order_id, {
      metadata: {
        ...previousMetadata,
        jsb_status: input.status,
      },
    })

    return new StepResponse(
      { order_id: input.order_id, status: input.status },
      { order_id: input.order_id, metadata: previousMetadata }
    )
  },
  async (compensation, { container }) => {
    if (!compensation) {
      return
    }

    const orderService = container.resolve(Modules.ORDER)
    await orderService.updateOrders(compensation.order_id, {
      metadata: compensation.metadata,
    })
  }
)

export const updateOrderStatusWorkflow = createWorkflow(
  "update-jsb-order-status",
  (input: UpdateOrderStatusInput) => {
    return new WorkflowResponse(updateOrderStatusStep(input))
  }
)
