import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Input,
  Spinner,
  addToast,
  useDisclosure,
  DatePicker,
  NumberInput,
} from "@heroui/react";
import { MemberForm } from "@/app/lib/sun-defination";
import { ClockIcon, CheckIcon } from "@heroicons/react/20/solid";
import { createLoan, LoanState } from "@/app/lib/sun-actions";
import { useActionState } from "react";
import { formatCurrencyToLocal, formatDateToLocal } from "@/app/lib/utils";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";

export default function LoanModal({
  isOpen,
  onOpenChange,
  memberData,
  onClose,
}: {
  isOpen: boolean;
  onOpenChange: any;
  memberData: any;
  onClose: any;
}) {
  const [amount, setAmount] = React.useState("");
  const [interest, setInterest] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [loanId, setLoanId] = React.useState("NILL");
  const [isLoading, setIsLoading] = React.useState(false);
  const [weeklyPayment, setWeeklyPayment] = React.useState(0);
  const [startDate, setStartDate] = React.useState<any>(
    now(getLocalTimeZone())
  );
  const [endDate, setEndDate] = React.useState<any>(
    startDate.add({ weeks: Number(term) })
  );
  const [error, setError] = React.useState({ isError: false, type: "" });
  const [cycle, setCycle] = React.useState<any>(0);
  const [fee, setFee] = React.useState(0);

  const principal = Number.parseFloat(amount);
  const rate = Number.parseFloat(interest) / 100 / 4;
  const Loanterm = Number.parseInt(term);

  const wpay = Math.ceil(principal / Loanterm + principal * rate);
  const payment = Math.ceil(wpay * Loanterm);

  const calculateWeeklyPayment = () => {
    const principal = Number.parseFloat(amount);
    const rate = Number.parseFloat(interest) / 100 / 12;
    const Loanterm = Number.parseInt(term);

    if (principal && rate && term) {
      const payment =
        (principal * rate * Math.pow(1 + rate, Loanterm)) /
        (Math.pow(1 + rate, Loanterm) - 1);
      setWeeklyPayment(Math.round(payment * 100) / 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (cycle < 1) {
      setIsLoading(false);
      addToast({
        title: "Error !",
        description: "Please select loan cycle",
        color: "danger",
      });
      setError({ isError: true, type: "cycle" });
      return;
    }
    const formData = new FormData(e.currentTarget);
    const res = await createLoan(formData);

    if (res?.success === false) {
      setIsLoading(false);
      if (res?.errors?.status) {
        addToast({
          title: "Error !",
          description: res?.errors.status,
          color: "danger",
        });
      } else {
        setIsLoading(false);
        addToast({
          title: "Error !",
          description: res?.message,
          color: "danger",
        });
      }
    }

    if (res?.success === true) {
      addToast({
        title: "Success !",
        description: res?.message,
        color: "success",
      });
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleDateChange = (date: any) => {
    if (Number(term) < 1) {
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
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center">
                Loan Application
              </ModalHeader>
              <Divider />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <div className="flex gap-4  items-center ">
                    <p>
                      <strong>Borrower:</strong>{" "}
                      <span className="text-sm">
                        {memberData.firstname} {memberData.surname}
                      </span>
                    </p>
                    <p className="">
                      <strong>ID number:</strong>{" "}
                      <span className="text-sm">{memberData.idnumber}</span>
                    </p>
                  </div>
                  <input
                    type="hidden"
                    name="group_id"
                    value={memberData.groupid}
                  />
                  <input type="hidden" name="member_id" value={memberData.id} />
                  <div className="flex flex-row gap-2 ">
                    <div className="w-full ">
                      <Input
                        color="primary"
                        isRequired
                        name="amount"
                        type="number"
                        className="outline-2 outline-blue-500  "
                        label="Loan Amount"
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        defaultValue={amount}
                        onChange={(e: any) => setAmount(e.target.value)}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              Ksh
                            </span>
                          </div>
                        }
                      />
                      <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                      ></div>
                    </div>
                    <div className="w-full">
                      <Input
                        color="primary"
                        name="loan_id"
                        type="text"
                        className="outline-2 outline-blue-500  "
                        label="Loan ID"
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-2 py-2">
                    <div className="w-full">
                      <Input
                        color="primary"
                        isRequired
                        name="interest"
                        type="number"
                        className="outline-2 outline-blue-500  "
                        label="Interest Rate "
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        defaultValue={interest}
                        onChange={(e: any) => setInterest(e.target.value)}
                        endContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              %
                            </span>
                          </div>
                        }
                      />
                      <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                      ></div>
                    </div>
                    <div className="w-full">
                      <Input
                        color="primary"
                        isRequired
                        name="term"
                        type="number"
                        className="outline-2 outline-blue-500  "
                        label="Loan Term "
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        defaultValue={term}
                        onChange={(e: any) => setTerm(e.target.value)}
                        endContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              Weeks
                            </span>
                          </div>
                        }
                      />
                      <div
                        id="term-error"
                        aria-live="polite"
                        aria-atomic="true"
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 py-2">
                    <div className="w-full">
                      {" "}
                      <NumberInput
                        isInvalid={error.isError && error.type === "cycle"}
                        errorMessage="Select a number greater than 0"
                        isRequired
                        name="cycle"
                        className="outline-2 outline-blue-500 "
                        label="Loan Cycle"
                        color="primary"
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
                    <div className="w-full">
                      <NumberInput
                        isRequired
                        name="fee"
                        className="outline-2 outline-blue-500 "
                        label="Processing Fee and Charges"
                        color="primary"
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
                  <DatePicker
                    isInvalid={error.isError && error.type === "startDate"}
                    errorMessage="Select loan term first"
                    showMonthAndYearPickers
                    name="start_date"
                    className="pb-4"
                    variant="faded"
                    color="primary"
                    label="Loan Start Date"
                    size="md"
                    labelPlacement="outside"
                    value={startDate}
                    onChange={(val) => {
                      handleDateChange(val);
                      setError({ isError: false, type: "" });
                    }}
                    inert={false}
                  />
                  <DatePicker
                    isDisabled
                    showMonthAndYearPickers
                    name="end_date"
                    className="pb-4"
                    variant="faded"
                    color="primary"
                    label="Loan End Date"
                    size="md"
                    labelPlacement="outside"
                    value={endDate}
                    isReadOnly
                    inert={false}
                  />
                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                      Set the loan status
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            id="pending"
                            name="status"
                            type="radio"
                            value="pending"
                            className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                          />
                          <label
                            htmlFor="pending"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
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
                          />
                          <label
                            htmlFor="paid"
                            className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                          >
                            Approved <CheckIcon className="h-4 w-4" />
                          </label>
                        </div>
                      </div>
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
                          {" "}
                          {formatCurrencyToLocal(principal || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Interest Rate:
                        </span>
                        <span className="font-medium">{interest || "0"}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Term:</span>
                        <span className="font-medium">{term || "0"} Weeks</span>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Weekly Payment:
                        </span>
                        <span className="font-bold text-lg">
                          {" "}
                          {formatCurrencyToLocal(wpay || 0.0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Total Payment:
                        </span>
                        <span className="font-bold text-lg">
                          {" "}
                          {formatCurrencyToLocal(payment || 0.0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div></div>
                    <div className="flex gap-4 pt-4">
                      <Button color="primary" onPress={onClose}>
                        Cancel
                      </Button>
                      {isLoading ? (
                        <Button type="submit" color="success" disabled>
                          <Spinner size="md" color="default" /> Processing...
                        </Button>
                      ) : (
                        <Button type="submit" color="success">
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
