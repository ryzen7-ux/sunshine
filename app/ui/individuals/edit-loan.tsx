"use client";
import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Form,
  Input,
  Spinner,
  addToast,
  Select,
  SelectItem,
  NumberInput,
  Divider,
  Tooltip,
  DatePicker,
} from "@heroui/react";
import { Button } from "@heroui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CheckIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CalendarDaysIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { updateIndividualLoan } from "@/app/lib/sun-actions";
import { number, string } from "zod";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import { Edit } from "lucide-react";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { formatFormDateTime } from "@/app/lib/utils";

const roles = [
  { key: "admin", label: "Admin" },
  { key: "manager", label: "Manager" },
  { key: "staff", label: "Staff" },
];
const status = [
  { key: "active", label: "Active" },
  { key: "inactive", label: "Inactive" },
  { key: "on-leave", label: "On-Leave" },
];

export default function EditLoan({ individual }: { individual: any }) {
  const [formData, setFormData] = useState({
    idNumber: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [selectIndividual, setSelectIndividual] = useState("");
  const [select, setSelect] = useState("");
  const [fee, setFee] = useState(0);
  const [cycle, setCycle] = useState(individual.cycle);
  const [error, setError] = useState({ isError: false, type: "" });
  const [startDate, setStartDate] = useState<any>(
    formatFormDateTime(individual.start_date)
  );
  const [endDate, setEndDate] = useState<any>(
    startDate.add({ weeks: Number(individual.term) })
  );

  const [selectRegion, setSelectRegion] = useState("");
  const [amount, setAmount] = useState<number>(individual.amount);
  const [interest, setInterest] = useState<number>(individual.interest);
  const [term, setTerm] = useState<number>(individual.term);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Loan computations
  const principal = amount!;
  const rate = interest! / 100 / 4;

  const wpay = Math.ceil(principal / term! + principal * rate);
  const payment = Math.ceil(wpay * term!);

  // Search params
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("id", term);
    } else {
      params.delete("id");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsloading(true);
    const formData = new FormData(e.currentTarget);
    const results = await updateIndividualLoan(formData);

    if (results?.success === false) {
      setIsloading(false);
      addToast({
        title: "Error !",
        description: results?.message,
        color: "danger",
      });
    } else {
      setIsloading(false);
      addToast({
        title: "Success!",
        description: results?.message,
        color: "success",
      });
      setIsModalOpen(false);
    }
  };

  const handleDateChange = (date: any) => {
    console.log(term);
    if (term < 1) {
      setError({ isError: true, type: "startDate" });
      return;
    }
    setStartDate(date);
    const newDate = date;
    const loanEndDate = newDate.add({ weeks: Number(term) });
    setEndDate(loanEndDate);
  };

  return (
    <>
      <Tooltip color="success" content="Edit Details">
        <button
          className="pr-3"
          onClick={(event) => {
            setIsModalOpen(true);
          }}
        >
          <Edit className="h-4 w-4 text-green-500 hover:text-green-600" />
        </button>
      </Tooltip>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={onOpenChange}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Individual Loan
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="flex flex-col py-4  rounded-md  w-full">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full">
                        <Input
                          className="hidden"
                          name="id"
                          value={individual.id}
                          readOnly
                        />
                        <Input
                          isRequired
                          name="phone"
                          type="text"
                          className="outline-2 outline-blue-500 "
                          label="Region"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={individual.region}
                          readOnly
                          isDisabled
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          isRequired
                          name="name"
                          type="text"
                          className="outline-2 outline-blue-500 "
                          label="Name"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          value={individual.name}
                          variant="faded"
                          readOnly
                          isDisabled
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <NumberInput
                          isRequired
                          name="amount"
                          className="outline-2 outline-blue-500 "
                          label="Amount"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={amount}
                          onValueChange={setAmount}
                          placeholder="0.00"
                          formatOptions={{ useGrouping: false }}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                Ksh
                              </span>
                            </div>
                          }
                        />
                      </div>
                      <div className="w-full">
                        <NumberInput
                          isRequired
                          name="interest"
                          className="outline-2 outline-blue-500 "
                          label="Interest Rate %"
                          description="NB: This is interest per month"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={interest}
                          onValueChange={setInterest}
                          formatOptions={{ useGrouping: false }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 ">
                      <div className="w-full">
                        <NumberInput
                          isInvalid={
                            error.isError === true && error.type === "term"
                          }
                          isRequired
                          name="term"
                          className="outline-2 outline-blue-500 "
                          label="Loan Term"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={term}
                          onValueChange={setTerm}
                          endContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                Weeks
                              </span>
                            </div>
                          }
                        />
                      </div>
                      <div className="w-full">
                        <NumberInput
                          isRequired
                          name="fee"
                          className="outline-2 outline-blue-500 "
                          label="Processing Fee"
                          color="success"
                          labelPlacement="outside"
                          size="md"
                          variant="faded"
                          value={fee}
                          onValueChange={(e) => {
                            setFee(e);
                            setError({ isError: false, type: "" });
                          }}
                          errorMessage="Enter value greater than 0"
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">
                                Ksh
                              </span>
                            </div>
                          }
                        />
                      </div>
                    </div>
                    <div className="py-4">
                      {" "}
                      <NumberInput
                        isInvalid={error.isError && error.type === "cycle"}
                        errorMessage="Select a number greater than 0"
                        isRequired
                        name="cycle"
                        className="outline-2 outline-blue-500 "
                        label="Loan Cycle"
                        color="success"
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        value={cycle}
                        onValueChange={(e) => {
                          setCycle(e);
                          setError({ isError: false, type: "" });
                        }}
                        placeholder="0"
                        formatOptions={{ useGrouping: false }}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small"></span>
                          </div>
                        }
                      />
                    </div>
                    <DatePicker
                      isInvalid={error.isError && error.type === "startDate"}
                      errorMessage="Set loan term first with value greater than 0"
                      showMonthAndYearPickers
                      name="start_date"
                      className="pb-4"
                      variant="faded"
                      color="success"
                      label="Loan Start Date"
                      size="md"
                      labelPlacement="outside"
                      value={startDate}
                      onChange={(val) => {
                        handleDateChange(val);
                      }}
                      inert={true}
                    />
                    <DatePicker
                      isDisabled
                      showMonthAndYearPickers
                      name="end_date"
                      className="pb-4"
                      variant="faded"
                      color="success"
                      label="Loan End Date"
                      size="md"
                      labelPlacement="outside"
                      value={endDate}
                      isReadOnly
                      inert={true}
                    />
                    <fieldset>
                      <legend className="mb-2 block text-sm font-medium">
                        Set the loan status
                      </legend>
                      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4 flex-col md:flex-row flex-wrap">
                          <div className="flex flex-row gap-4">
                            <div className="flex items-center">
                              <input
                                id="pending"
                                name="status"
                                type="radio"
                                value="pending"
                                className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                defaultChecked={individual.status === "pending"}
                              />
                              <label
                                htmlFor="pending"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-yellow-200 px-3 py-1.5 text-xs font-medium text-gray-600"
                              >
                                Pending <ClockIcon className="h-4 w-4" />
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="approved"
                                name="status"
                                type="radio"
                                value="approved"
                                className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                                defaultChecked={
                                  individual.status === "approved"
                                }
                              />
                              <label
                                htmlFor="paid"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                              >
                                Approved <CheckIcon className="h-4 w-4" />
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="defered"
                                name="status"
                                type="radio"
                                value="defered"
                                className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                                defaultChecked={individual.status === "defered"}
                              />
                              <label
                                htmlFor="paid"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white"
                              >
                                Defered <CalendarDaysIcon className="h-4 w-4" />
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center">
                              <input
                                id="rejected"
                                name="status"
                                type="radio"
                                value="rejected"
                                className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                                defaultChecked={
                                  individual.status === "rejected"
                                }
                              />
                              <label
                                htmlFor="paid"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white"
                              >
                                Rejected <XCircleIcon className="h-4 w-4" />
                              </label>
                            </div>

                            <div className="flex items-center">
                              <input
                                id="approved"
                                name="status"
                                type="radio"
                                value="inactive"
                                className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                                defaultChecked={
                                  individual.status === "inactive"
                                }
                              />
                              <label
                                htmlFor="paid"
                                className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-pink-500 px-3 py-1.5 text-xs font-medium text-white"
                              >
                                Inactive{" "}
                                <ShieldExclamationIcon className="h-4 w-4" />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        id="status-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {/* {state?.errors?.status &&
            state.errors.status.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))} */}
                      </div>
                    </fieldset>
                    <div className="py-2">
                      <p className="text-xl py-2">Loan Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Loan Amount:
                          </span>
                          <span className="font-medium">
                            {formatCurrencyToLocal(principal || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Interest Rate (Per Month):
                          </span>
                          <span className="font-medium">
                            {interest || "0"}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Term:</span>
                          <span className="font-medium">
                            {term || "0"} Weeks
                          </span>
                        </div>
                        <Divider />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Weekly Payment:
                          </span>
                          <span className="font-bold text-lg">
                            {" "}
                            {formatCurrencyToLocal(wpay || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Total Payment:
                          </span>
                          <span className="font-bold text-lg">
                            {" "}
                            {formatCurrencyToLocal(payment || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="my-6 py-6 flex gap-4">
                      <Button color="danger" variant="light" onPress={onClose}>
                        Close
                      </Button>
                      <Button
                        type="submit"
                        color="success"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Spinner color="default" size="md" className="py-4" />
                        ) : (
                          "Update Loan"
                        )}
                      </Button>
                    </div>
                  </div>
                </Form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
