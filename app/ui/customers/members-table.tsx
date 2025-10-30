"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { EditMemberModal } from "./edit-meber-modal";
import Link from "next/link";
import { deleteGroup } from "@/app/lib/sun-actions";
import { DeleteMemberAction } from "@/app/ui/customers/table-actions";
import MemberModal from "@/app/ui/customers/member-modal";
import LoanModal from "@/app/ui/customers/loan-modal";
import { BanknotesIcon } from "@heroicons/react/20/solid";
import { EditIcon, DeleteIcon, EyeIcon } from "lucide-react";

export const columns = [
  { name: "ID NO", uid: "idnumber" },
  { name: "NAME", uid: "firstname" },
  { name: "PHONE", uid: "phone" },
  { name: "LOCATION", uid: "location" },
  { name: "BUSINESS", uid: "business" },
  { name: "ACTIONS", uid: "actions" },
];

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function MembersTable({
  group,
  members,
}: {
  group: any;
  members: any;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isOpenLoan, setIsOpenLoan] = React.useState(false);

  const [memberData, setMemberData] = React.useState({});

  const renderCell = React.useCallback((member: any, columnKey: any) => {
    const cellValue = member[columnKey];

    switch (columnKey) {
      case "id":
        return (
          <div className="flex flex-col">
            <p className="py-2 text-xs">{member.idnumber}</p>
          </div>
        );
      case "firstname":
        return (
          <div className="flex flex-col">
            <p className=" text-bold text-md ">
              {member.firstname} {member.surname}
            </p>
          </div>
        );

      case "location":
        return (
          <div>
            <p className="text-bold text-md ">{member.location}</p>
          </div>
        );
      case "business":
        return (
          <div>
            <p className="text-bold text-md ">{member.nature}</p>
          </div>
        );

      case "actions":
        return (
          <div className="relative flex justify-center gap-2">
            <Tooltip color="primary" content="New loan">
              <button
                onClick={() => {
                  setIsOpenLoan(true);
                  setMemberData(member);
                }}
              >
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <BanknotesIcon className="h-5 w-5 fill-blue-500" />
                </span>
              </button>
            </Tooltip>
            <Tooltip color="warning" content="Member details">
              <Link
                href={`/dashboard/customers/${group.id}/details/${member.id}/details`}
              >
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon className="h-5 w-5 text-yellow-500" />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color="success" content="Edit member">
              <EditMemberModal member={member} />
            </Tooltip>
            <DeleteMemberAction id={member.id} gid={group.id} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Table
        isStriped
        aria-label="Example table with custom cells"
        color="success"
        className="pb-12 mb-12"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {Object.keys(members).length > 0 ? (
          <TableBody items={members}>
            {(item: any) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        )}
      </Table>
      <MemberModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        memberData={memberData}
        onClose={onClose}
      />

      <LoanModal
        isOpen={isOpenLoan}
        onOpenChange={setIsOpenLoan}
        memberData={memberData}
        onClose={onClose}
      />
    </>
  );
}
