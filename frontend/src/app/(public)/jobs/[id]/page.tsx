import JobDetailComponent from "@/components/custom/JobDetail";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className=" w-full  flex-1 flex flex-col">
      <JobDetailComponent jobId={Number(id)} />
    </div>
  );
}