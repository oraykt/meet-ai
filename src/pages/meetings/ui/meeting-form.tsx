"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { meetingInsertSchema, meetingUpdateSchema } from "../schemas";
import { MeetingGetOne } from "../types";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { useDebounce } from "react-use";
import { NewAgentDialog } from "@/pages/agents/ui/new-agent-dialog";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({ onSuccess, onCancel, initialValues }: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearchTerm, setAgentSearchTerm] = useState("");
  const [debouncedAgentSearchTerm, setDebouncedAgentSearchTerm] = useState("");

  // Debounce the agent search term
  useDebounce(
    () => {
      setDebouncedAgentSearchTerm(agentSearchTerm);
    },
    500,
    [agentSearchTerm]
  );

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: debouncedAgentSearchTerm,
    })
  );

  // console.log("Agents data:", agents.data);

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        // TODO: Invalidate free tier usage
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade?"
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }
        onSuccess?.(initialValues?.id);
      },
      onError: (error) => {
        toast.error(error.message);
        // TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade?"
      },
    })
  );

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  // Determine if the client is editing
  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;
  const onSubmit = (
    formValue: z.infer<typeof meetingInsertSchema | typeof meetingUpdateSchema>
  ) => {
    if (isEdit) {
      updateMeeting.mutate({ ...formValue, id: initialValues.id });
    } else {
      createMeeting.mutate(formValue);
    }
  };

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math consultations" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            variant="botttsNeutral"
                            seed={agent.name}
                            className="border size-6"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearchTerm}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what you&apos;re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create a new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button variant="ghost" disabled={isPending} type="button" onClick={() => onCancel()}>
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
