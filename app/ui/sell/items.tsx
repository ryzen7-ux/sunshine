"use client";
import React from "react";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import ModaFormComponent from "@/app/ui/sell/modal-form-component";
import Receipt from "@/app/ui/sell/receipt";

export default function SellItems() {
  const list = [
    {
      title: "Photocopy",
      color: "bg-red-800",
      price: 5.0,
    },
    {
      title: "Printing",
      color: "bg-orange-800",
      price: 10.0,
    },
    {
      title: "Lamination",
      color: "bg-yellow-800",
      price: 50.0,
    },
    {
      title: "Binding",
      color: "bg-lime-800",
      price: 100.0,
    },
    {
      title: "Scanning",
      color: "bg-green-800",
      price: 20.0,
    },
    {
      title: "Dj Mixes",
      color: "bg-emerald-800",
      price: 20.0,
    },
    {
      title: "Computer Packages",
      color: "bg-teal-800",
      price: 2500,
    },
    {
      title: "Online Services",
      color: "bg-cyan-800",
      price: 2500,
    },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [itemIndex, setItemIndex] = React.useState(0);
  const [status, setStatus] = React.useState(false);

  console.log(status);

  return (
    <div className="grid grid-cols-2 col-span-8">
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 col-span-6 md:h-36">
        {list.map((item, index) => (
          /* eslint-disable no-console */
          <Card
            key={index}
            isPressable
            shadow="lg"
            onPress={() => {
              onOpen();
              setItemIndex(index);
            }}
            className={`rounded-sm ${item.color}`}
          >
            <CardBody className="overflow-visible p-0"></CardBody>
            <CardFooter className="text-small flex flex-col items-start ">
              <b className="text-white">{item.title}</b>
              <p className="text-white pt-2">Ksh {item.price}</p>
            </CardFooter>
          </Card>
        ))}

        {!status ? (
          <Modal
            size="xl"
            backdrop="opaque"
            isOpen={isOpen}
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                },
                exit: {
                  y: -20,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                },
              },
            }}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {list[itemIndex].title}
                  </ModalHeader>
                  <ModalBody>
                    <ModaFormComponent
                      list={list}
                      index={itemIndex}
                      setStatus={setStatus}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        ) : (
          <Modal
            size="full"
            backdrop="opaque"
            isOpen={isOpen}
            motionProps={{
              variants: {
                enter: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                },
                exit: {
                  y: -20,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                    ease: "easeIn",
                  },
                },
              },
            }}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Reciept
                  </ModalHeader>
                  <ModalBody>
                    <Receipt />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </div>
      <Receipt />
    </div>
  );
}
