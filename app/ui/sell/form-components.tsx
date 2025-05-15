import {Select, SelectItem} from "@heroui/react";
import { Square2StackIcon } from "@heroicons/react/24/solid";

export const animals = [
  {key: "photocopy", label: "Photocopy"},
  {key: "dog", label: "Dog"},
  {key: "elephant", label: "Elephant"},
  {key: "lion", label: "Lion"},
  {key: "tiger", label: "Tiger"},
  {key: "giraffe", label: "Giraffe"},
  {key: "dolphin", label: "Dolphin"},
  {key: "penguin", label: "Penguin"},
  {key: "zebra", label: "Zebra"},
  {key: "shark", label: "Shark"},
  {key: "whale", label: "Whale"},
  {key: "otter", label: "Otter"},
  {key: "crocodile", label: "Crocodile"},
];

export  function SelectForm() {
  return (
    <Select
    color="secondary"
      className="max-w"
      defaultSelectedKeys={["photocopy"]}
      label="Select an Item"
      placeholder=""
      startContent={<Square2StackIcon className="h-5 w-5" />}
    >
      {animals.map((animal) => (
        <SelectItem key={animal.key}>{animal.label}</SelectItem>
      ))}
    </Select>
  );
}
