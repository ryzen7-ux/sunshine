import {
  HomeIcon,
  UsersRoundIcon,
  Group,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundPen,
} from "lucide-react";

export const HomeBIcon = () => {
  return <HomeIcon className="h-5 w-5 text-blue-500" />;
};

export const UsersBRoundIcon = () => {
  return <UsersRoundIcon className="h-5 w-5 text-blue-700" />;
};

export const GroupBIcon = () => {
  return <Group className="h-5 w-5 text-yellow-700" />;
};

export const UserBCheckIcon = () => {
  return <UserRoundCheck className="h-5 w-5 text-pink-700" />;
};

export const UserBPlus = () => {
  return <UserRoundPlus className="h-5 w-5 text-pink-700" />;
};

export const UserBPen = () => {
  return <UserRoundPen className="h-5 w-5 text-pink-700" />;
};
