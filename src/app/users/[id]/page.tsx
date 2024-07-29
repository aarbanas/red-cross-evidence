"use client";
import MainLayout from "~/components/layout/mainLayout";
import { useParams } from "next/navigation";

interface Params {
  id: string;
}

export default function Page() {
  const params = useParams() as unknown as Params; // Correct type casting
  const { id } = params;

  return (
    <MainLayout
      headerChildren={
        <h1 className="text-xl font-bold">Uređivanje volontera {id}</h1>
      }
    >
      <div>{/* form */}</div>
    </MainLayout>
  );
}
