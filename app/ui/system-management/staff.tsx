"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
  Badge,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
  Chip,
  addToast,
} from "@heroui/react";
import { EllipsisVertical, Trash, Edit } from "lucide-react";
import EditStaff from "@/app/ui/system-management/edit-staff";
import { DeleteStaff } from "@/app/ui/system-management/buttons";
import { boolean } from "zod";

export default function Staff({ users }: { users: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [res, setRes] = useState<{ success: boolean; message: string }>();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {users?.map((user: any) => (
        <Card
          className={`hover:shadow-md hover:shadow-green-600 shadow-md shadow-green-300 ${
            user.name === "henry-admin" ? "hidden" : ""
          }`}
          key={user.id}
        >
          <CardHeader>
            <div className="flex justify-between w-full">
              <div className="flex gap-3">
                <Image
                  alt="heroui logo"
                  height={50}
                  radius="sm"
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew&s"
                  width={50}
                  className=""
                />
                <div className="flex flex-col">
                  <p className="text-md">{user.name}</p>
                  <p className="text-small text-default-500">{user.email}</p>
                </div>
              </div>{" "}
              <div className="">
                <EditStaff user={user} />
                <DeleteStaff id={user.id} />
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="text-small text-default-500">
                Role:{" "}
                <Chip color="primary" size="sm">
                  {user?.role}
                </Chip>
              </div>
              <p className="text-small text-default-500">
                Status: {user.status}
              </p>
              <p className="text-small text-default-500">Phone: {user.phone}</p>
            </div>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
}
