import { formatPrice } from "@/lib/utils";

function Price({ price }: { price: number }) {

  return (
    <div className="flex gap-2 items-baseline">
      <div className="text-xs opacity-50">
        {formatPrice(price)}
      </div>
    </div>
  )
}

export default Price;