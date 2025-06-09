import { deleteGroup, deleteMember } from "@/app/lib/sun-actions";
import { Trash2Icon, Trash2, Eye, Pen } from "lucide-react";
import { Tooltip } from "@heroui/react";

export function DeleteGroupAction({ id }: { id: string }) {
  const deleteGroupWithId = deleteGroup.bind(null, id);
  return (
    <>
      <Tooltip color="danger" content="Delete group">
        <form action={deleteGroupWithId}>
          <button type="submit">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <Trash2 className="h-5 w-5" />
            </span>
          </button>
        </form>
      </Tooltip>
    </>
  );
}

export function DeleteMemberAction({ id, gid }: { id: string; gid: string }) {
  const deleteMemberWithId = deleteMember.bind(null, id, gid);
  return (
    <>
      <Tooltip color="danger" content="Delete member">
        <form action={deleteMemberWithId}>
          <button type="submit">
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <Trash2 className="h-5 w-5" />
            </span>
          </button>
        </form>
      </Tooltip>
    </>
  );
}
