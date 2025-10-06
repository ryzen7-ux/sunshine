import clsx from "clsx";
import { Aperture } from "lucide-react";
import EditRegion from "@/app/ui/system-management/edit-region";
import { DeleteRegion } from "@/app/ui/system-management/delete-region";

export default function Regions({
  users,
  regions,
}: {
  users: any;
  regions: any;
}) {
  return (
    <>
      <div className="mb-6">
        <div className="bg-white pr-2 rounded-xl shadow-lg bg-gray-200 ">
          <div className="flex grow flex-col justify-between rounded-xl py-2 px-2 ">
            {regions.map((region: any) => (
              <div
                key={region.id}
                className={`border rounded-md  py-2 my-3 hover:bg-green-100 ${
                  region.name === "default" ? "hidden" : ""
                }`}
              >
                <div className="px-2 flex justify-between">
                  <Aperture className="h-5 w-5 text-green-700" />
                  <div className="flex">
                    <EditRegion users={users} region={region} />
                    <DeleteRegion id={region.id} />
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="flex items-center flex-wrap">
                    <div className="min-w-0 ml-6">
                      <p className="truncate text-sm font-semibold md:text-lg">
                        {region.name}
                      </p>
                      <p className=" text-sm text-gray-700 sm:block">
                        {region.county}
                      </p>
                      <p className=" text-sm text-gray-500 sm:block flex flex-wrap">
                        Region Manager: {region.custodian}
                      </p>
                      <p className=" text-sm text-gray-500 sm:block"></p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p
                      className={`truncate text-sm font-extrabold md:text-lg flex justify-center`}
                    ></p>
                    <p
                      className={`truncate text-md text-green-500 font-extrabold pt-2 flex justify-center`}
                    ></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
