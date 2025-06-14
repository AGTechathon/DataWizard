import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Coachingexperts } from "@/services/Options";
import { useMutation } from "convex/react";
import { LoaderCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export function UserInputDialog({ children, CoachingOption }) {
  const [selectedExpert, setSelectedExpert] = useState();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);

  const onClickConnect = async () => {
    if (!selectedExpert) return;
    setLoading(true);
    try {
      const result = await createDiscussionRoom({
        expertName: selectedExpert,
        coachingOption: CoachingOption?.name,
      });
      console.log("Room created:", result);
      setOpenDialog(false);
      router.push(`/discussion-room/${result}`);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div>
          <DialogHeader>
            <DialogTitle>{CoachingOption.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-3">
            <h2 className="text-black mt-5">Select your Healthcare Expert</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 w-full gap-6">
              {Coachingexperts.map((expert, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedExpert(expert.name)}
                  className={`p-1 rounded-2xl cursor-pointer ${
                    selectedExpert === expert.name ? "border-2 border-primary" : ""
                  }`}
                >
                  <Image
                    src={expert.avatar}
                    alt={expert.name}
                    width={50}
                    height={50}
                    className="mt-2 rounded-2xl object-cover hover:scale-105 transition-all p-1 h-[50px] w-[50px]"
                  />
                  <h2 className="text-gray text-center">{expert.name}</h2>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <DialogClose>
                <Button asChild variant="ghost">Cancel</Button>
              </DialogClose>
              <Button
                onClick={onClickConnect}
                className="flex items-center gap-2 bg-orange-500"
                variant="default"
              >
                {loading && <LoaderCircle className="animate-spin w-5 h-5" />}
                Connect
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserInputDialog;
