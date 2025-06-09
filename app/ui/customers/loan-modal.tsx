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
} from "@heroui/react";
import { MemberForm } from "@/app/lib/sun-defination";
import { ClockIcon, CheckIcon } from "@heroicons/react/20/solid";
import { createLoan, LoanState } from "@/app/lib/sun-actions";
import { useActionState } from "react";

export default function LoanModal({
  isOpen,
  onOpenChange,
  memberData,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  memberData: MemberForm;
}) {
  const [amount, setAmount] = React.useState("");
  const [interest, setInterest] = React.useState("");
  const [term, setTerm] = React.useState("");
  const [weeklyPayment, setWeeklyPayment] = React.useState(0);

  const principal = Number.parseFloat(amount);
  const rate = Number.parseFloat(interest) / 100 / 12;
  const Loanterm = Number.parseInt(term);

  const payment =
    (principal * rate * Math.pow(1 + rate, Loanterm)) /
    (Math.pow(1 + rate, Loanterm) - 1);
  const wpay = Math.round(payment * 100) / 100;

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
  const initialState: LoanState = { message: null, errors: {} };

  const [state, formAction, isLoading] = useActionState(
    createLoan,
    initialState
  );
  // React.useEffect(() => {
  //   if (state?.status === "success") {
  //     onOpenChange();
  //   }
  // }, [state.status, onOpenChange]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xl"
        className="overflow-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center">
                Loan Application
              </ModalHeader>
              <Divider />
              <ModalBody>
                <form action={formAction}>
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
                      />
                      <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {state?.errors?.amount &&
                          state.errors.amount.map((error: string) => (
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
                              {error}
                            </p>
                          ))}
                      </div>
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
                        label="Interest Rate (%)"
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        defaultValue={interest}
                        onChange={(e: any) => setInterest(e.target.value)}
                      />
                      <div
                        id="amount-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {state?.errors?.interest &&
                          state.errors.interest.map((error: string) => (
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
                              {error}
                            </p>
                          ))}
                      </div>
                    </div>
                    <div className="w-full">
                      <Input
                        color="primary"
                        isRequired
                        name="term"
                        type="number"
                        className="outline-2 outline-blue-500  "
                        label="Loan Term (Weeks)"
                        labelPlacement="outside"
                        size="md"
                        variant="faded"
                        defaultValue={term}
                        onChange={(e: any) => setTerm(e.target.value)}
                      />
                      <div
                        id="term-error"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {state?.errors?.term &&
                          state.errors.term.map((error: string) => (
                            <p
                              className="mt-2 text-sm text-red-500"
                              key={error}
                            >
                              {error}
                            </p>
                          ))}
                      </div>
                    </div>
                  </div>
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
                    >
                      {state?.errors?.status &&
                        state.errors.status.map((error: string) => (
                          <p className="mt-2 text-sm text-red-500" key={error}>
                            {error}
                          </p>
                        ))}
                    </div>
                  </fieldset>
                  <div className="py-2">
                    <p className="text-xl py-2">Loan Summary</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Loan Amount:
                        </span>
                        <span className="font-medium">Ksh {amount || "0"}</span>
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
                          Ksh {wpay || "0"}
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
