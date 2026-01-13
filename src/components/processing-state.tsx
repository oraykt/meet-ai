import { EmptyState } from "./empty-state";

export const ProcessingState = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting completed"
        description="This meeting is currently being processed and a summary will appear here."
        imageUrl="/processing.svg"
      />
    </div>
  );
};
