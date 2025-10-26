"use client";
import { useState, useEffect } from "react";
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
  DatePicker,
} from "@heroui/react";
import { Button } from "@heroui/react";
import {
  EyeIcon,
  EyeSlashIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { createIndividualLoan } from "@/app/lib/sun-actions";
import { number, string } from "zod";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import { Cuboid } from "lucide-react";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { fetchIndividualsMaxCycle } from "@/app/lib/sun-data";

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

export default function AddLoan({
  individual,
  individuals,
  regions,
  maxCycle,
}: {
  individual: any;
  individuals: any;
  regions: any;
  maxCycle: any;
}) {
  const [formData, setFormData] = useState({
    idNumber: "",
  });
  const [isLoading, setIsloading] = useState(false);
  const [selectIndividual, setSelectIndividual] = useState("");
  const [select, setSelect] = useState("");
  const [cycle, setCycle] = useState(maxCycle[0].max ? maxCycle[0].max : 0);
  const [error, setError] = useState({ isError: false, type: "" });
  const [startDate, setStartDate] = useState<any>(now(getLocalTimeZone()));

  const [selectRegion, setSelectRegion] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [term, setTerm] = useState<number>(0);
  const [fee, setFee] = useState<number>(0);
  const [endDate, setEndDate] = useState<any>(
    startDate.add({ weeks: Number(term) })
  );
  const [maxCycleControl, setMaxCycleControl] = useState(
    maxCycle[0].max ? maxCycle[0].max : 0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Loan computations
  const principal = amount!;
  const rate = interest! / 100 / 4;

  const wpay = Math.ceil(principal / term! + principal * rate);
  const payment = Math.ceil(wpay * term! + Number(fee));

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
    if (term < 1) {
      setIsloading(false);
      setError({ type: "term", isError: true });
      return;
    }
    if (cycle > maxCycleControl + 1) {
      setIsloading(false);
      setError({ type: "cycle", isError: true });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const results = await createIndividualLoan(formData);

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
      <div className="flex justify-between w-full py-2">
        <p className="text-md font-bold flex gap-4">Individual Loans </p>
        <Button
          color="success"
          className=" md:w-1/4"
          onPress={() => setIsModalOpen(true)}
        >
          Add Individual Loan
        </Button>
      </div>
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
                  <div className="flex flex-col rounded-md  w-full">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="w-full">
                        <Select
                          isRequired
                          name="region"
                          className=""
                          label="Region"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectRegion]}
                          onChange={(e) => {
                            setSelectRegion(e.target.value);
                            handleSearch(e.target.value);
                            setSelectIndividual("");
                          }}
                        >
                          {regions.map((region: any, index: any) => (
                            <SelectItem key={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className="w-full">
                        <Select
                          isRequired
                          name="loanee"
                          className=""
                          label="Loanee"
                          variant="faded"
                          size="md"
                          color="success"
                          labelPlacement="outside"
                          selectedKeys={[selectIndividual]}
                          onChange={(e) => {
                            setSelectIndividual(e.target.value);
                          }}
                        >
                          {individual.map((item: any, index: any) => (
                            <SelectItem key={item.id}>{item.name}</SelectItem>
                          ))}
                        </Select>
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
                          minValue={1}
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
                          onValueChange={(e) => {
                            setTerm(e);
                            setError({ isError: false, type: "" });
                          }}
                          errorMessage="Enter value greater than 0"
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
                        errorMessage={`Enter a number greater than 0 or less than ${
                          maxCycleControl + 2
                        }`}
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
                      inert={false}
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
                      inert={false}
                    />
                    <fieldset>
                      <legend className="mb-2 block text-sm font-medium pt-4">
                        Set the loan status
                      </legend>
                      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="flex gap-4">
                          <div className="flex items-center">
                            <input
                              id="pending"
                              name="status"
                              type="radio"
                              defaultValue="pending"
                              className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                              readOnly
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
                              defaultValue="approved"
                              className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2"
                              readOnly
                            />
                            <label
                              htmlFor="paid"
                              className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                            >
                              Approved <CheckIcon className="h-4 w-4" />
                            </label>
                          </div>
                        </div>
                        <input
                          className="hidden"
                          name="group_id"
                          defaultValue={select}
                        />
                      </div>
                      <div
                        id="status-error"
                        aria-live="polite"
                        aria-atomic="true"
                      ></div>
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
                          "Create Loan"
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
