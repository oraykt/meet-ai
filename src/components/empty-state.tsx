import Image from "next/image";

interface EmptyStateProps {
  title: string;
  description?: string;
  imageUrl?: string;
}
export const EmptyState = ({
  title = "No results.",
  description,
  imageUrl = "/empty.svg",
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Image src={imageUrl} width={240} height={240} alt={title} />
      <h2 className="text-lg font-medium">{title}</h2>
      {description && <p className="text-sm text-gray-500 max-w-100">{description}</p>}
    </div>
  );
};
