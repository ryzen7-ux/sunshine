"use client"

import { useState } from "react"
import { FileDown, Plus, Trash2 } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { saveInvoice } from "@/lib/invoice-storage"

const formSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email address"),
  clientAddress: z.string().min(1, "Client address is required"),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        price: z.coerce.number().min(0, "Price must be a positive number"),
      }),
    )
    .min(1, "At least one item is required"),
  taxRate: z.coerce.number().min(0, "Tax rate must be a positive number"),
})

type FormValues = z.infer<typeof formSchema>

interface InvoiceModalProps {
  onInvoiceCreated?: () => void
}

export default function InvoiceModal({ onInvoiceCreated }: InvoiceModalProps) {
  const [open, setOpen] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      paymentTerms: "30days",
      notes: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      taxRate: 0,
    },
  })

  const items = form.watch("items")
  const taxRate = form.watch("taxRate")

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  function onSubmit(data: FormValues) {
    // Save the invoice to localStorage
    const newInvoice = saveInvoice(data)

    toast({
      title: "Invoice created",
      description: `Invoice #${data.invoiceNumber} has been created successfully.`,
    })

    // Reset the form
    form.reset({
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      clientName: "",
      clientEmail: "",
      clientAddress: "",
      paymentTerms: "30days",
      notes: "",
      items: [{ description: "", quantity: 1, price: 0 }],
      taxRate: 0,
    })

    setOpen(false)

    // Call the callback if provided
    if (onInvoiceCreated) {
      onInvoiceCreated()
    }
  }

  function addItem() {
    const currentItems = form.getValues("items")
    form.setValue("items", [...currentItems, { description: "", quantity: 1, price: 0 }])
  }

  function removeItem(index: number) {
    const currentItems = form.getValues("items")
    if (currentItems.length > 1) {
      form.setValue(
        "items",
        currentItems.filter((_, i) => i !== index),
      )
    }
  }

  async function generatePdf() {
    try {
      setIsGeneratingPdf(true)

      const formData = form.getValues()

      // Create a new PDF document
      const pdf = new jsPDF()

      // Add company info
      pdf.setFontSize(20)
      pdf.text("INVOICE", 14, 22)

      pdf.setFontSize(10)
      pdf.text(`#${formData.invoiceNumber}`, 14, 30)

      // Company info
      pdf.setFontSize(10)
      pdf.text("Your Company Name", 150, 22, { align: "right" })
      pdf.text("123 Business Street", 150, 28, { align: "right" })
      pdf.text("City, State ZIP", 150, 34, { align: "right" })
      pdf.text("contact@yourcompany.com", 150, 40, { align: "right" })

      // Client info
      pdf.setFontSize(12)
      pdf.text("Bill To:", 14, 50)
      pdf.setFontSize(10)
      pdf.text(formData.clientName, 14, 58)
      pdf.text(formData.clientEmail, 14, 64)

      // Handle multi-line address
      const addressLines = formData.clientAddress.split("\n")
      let yPos = 70
      addressLines.forEach((line) => {
        pdf.text(line, 14, yPos)
        yPos += 6
      })

      // Invoice details
      pdf.text(`Invoice Date: ${new Date(formData.date).toLocaleDateString()}`, 150, 50, { align: "right" })
      pdf.text(`Due Date: ${new Date(formData.dueDate).toLocaleDateString()}`, 150, 56, { align: "right" })

      const paymentTermsMap: Record<string, string> = {
        "due-on-receipt": "Due on Receipt",
        "15days": "Net 15 Days",
        "30days": "Net 30 Days",
        "60days": "Net 60 Days",
      }
      pdf.text(`Payment Terms: ${paymentTermsMap[formData.paymentTerms] || formData.paymentTerms}`, 150, 62, {
        align: "right",
      })

      // Line items table
      const tableColumn = ["Description", "Quantity", "Price", "Amount"]
      const tableRows = formData.items.map((item) => [
        item.description,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`,
      ])

      autoTable(pdf, {
        startY: Math.max(yPos + 10, 85),
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [66, 66, 66] },
      })

      // Calculate totals
      const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      const taxAmount = subtotal * (formData.taxRate / 100)
      const total = subtotal + taxAmount

      // Add totals
      const finalY = (pdf as any).lastAutoTable.finalY + 10

      pdf.text("Subtotal:", 120, finalY)
      pdf.text(`$${subtotal.toFixed(2)}`, 150, finalY, { align: "right" })

      pdf.text(`Tax (${formData.taxRate}%):`, 120, finalY + 6)
      pdf.text(`$${taxAmount.toFixed(2)}`, 150, finalY + 6, { align: "right" })

      pdf.setFontSize(12)
      pdf.text("Total:", 120, finalY + 14)
      pdf.text(`$${total.toFixed(2)}`, 150, finalY + 14, { align: "right" })

      // Add notes if present
      if (formData.notes) {
        pdf.setFontSize(12)
        pdf.text("Notes:", 14, finalY + 30)
        pdf.setFontSize(10)

        const noteLines = formData.notes.split("\n")
        let noteYPos = finalY + 38
        noteLines.forEach((line) => {
          pdf.text(line, 14, noteYPos)
          noteYPos += 6
        })
      }

      // Add footer
      pdf.setFontSize(10)
      pdf.text(
        "Thank you for your business!",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        {
          align: "center",
        },
      )

      // Save the PDF
      pdf.save(`Invoice-${formData.invoiceNumber}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Your invoice has been exported as a PDF.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Fill out the form below to create a new invoice.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <h3 className="text-lg font-medium">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Line Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {items.map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Qty</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Price</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} step={0.01} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="col-span-1"
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove item</span>
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem className="w-32">
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-1 text-right">
                  <div className="text-sm">Subtotal: ${subtotal.toFixed(2)}</div>
                  <div className="text-sm">Tax: ${taxAmount.toFixed(2)}</div>
                  <div className="text-lg font-bold">Total: ${total.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                        <SelectItem value="15days">Net 15 Days</SelectItem>
                        <SelectItem value="30days">Net 30 Days</SelectItem>
                        <SelectItem value="60days">Net 60 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={generatePdf}
                disabled={isGeneratingPdf || !form.formState.isValid}
                className="mr-auto"
              >
                {isGeneratingPdf ? (
                  <>Generating PDF...</>
                ) : (
                  <>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Invoice</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
