import { Printer, X } from "lucide-react";
import { Button } from "@heroui/react";

export default function Reciept() {
  const handlePrint = () => {
    window.print();
  };
  return (
    <div>
      <div className="p-4 text-sm">
        <div className="mb-4 text-center">
          <h3 className="text-lg font-bold">POS System</h3>
          <p className="text-muted-foreground">123 Main Street, City</p>
          <p className="text-muted-foreground">Tel: (123) 456-7890</p>
        </div>

        <div className="flex justify-between mb-4 text-xs text-muted-foreground">
          <div>Order #: 43234</div>
          <div>11/05/2025</div>
        </div>

        <div className="mb-4">
          <div className="pb-2 mb-2 font-medium border-b">Items</div>
          <div className="flex justify-between py-1">
            <div>jhhsjhdjsa</div>
            <div>dsad</div>
          </div>
        </div>

        <div className="pt-2 mt-4 border-t">
          <div className="flex justify-between">
            <div>Subtotal</div>
            <div>3434</div>
          </div>
          <div className="flex justify-between">
            <div>Tax (10%)</div>
            <div>43243</div>
          </div>
          <div className="flex justify-between pt-2 mt-2 text-lg font-bold border-t">
            <div>Total</div>
            <div>785</div>
          </div>
        </div>

        <div className="pt-4 mt-4 text-center border-t text-muted-foreground">
          <p>Payment Method: Mpesa</p>
          <p className="mt-4">Thank you for your purchase!</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button color="success" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button color="primary" size="sm">
          <X className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>
    </div>
  );
}
