import { getPoemById } from "@/lib/actions/poems";
import { notFound } from "next/navigation";
import PoemEditor from "@/components/admin/PoemEditor";

export default async function EditPoemPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const poem = await getPoemById(id);

	if (!poem) notFound();

	return <PoemEditor poem={poem} />;
}
