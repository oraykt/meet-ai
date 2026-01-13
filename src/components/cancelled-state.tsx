import { EmptyState } from "./empty-state";

export const CancelledState = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting is cancelled"
        description="This meeting has been cancelled and is no longer active."
        imageUrl="/cancelled.svg"
      />
    </div>
  );
};
