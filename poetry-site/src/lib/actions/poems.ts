"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Poem } from "@/types";

function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

export async function getPublishedPoems(): Promise<Poem[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("poems")
		.select("*")
		.eq("is_published", true)
		.order("created_at", { ascending: false });

	if (error) throw error;
	return (data || []) as Poem[];
}

export async function getAllPoems(): Promise<Poem[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("poems")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw error;
	return (data || []) as Poem[];
}

export async function getPoemBySlug(slug: string): Promise<Poem | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("poems")
		.select("*")
		.eq("slug", slug)
		.eq("is_published", true)
		.single();

	if (error) return null;
	return data as Poem;
}

export async function getPoemById(id: string): Promise<Poem | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("poems")
		.select("*")
		.eq("id", id)
		.single();

	if (error) return null;
	return data as Poem;
}

export async function getFeaturedPoem(): Promise<Poem | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("poems")
		.select("*")
		.eq("is_published", true)
		.order("created_at", { ascending: false })
		.limit(1);

	if (error) {
		console.error(error);
		return null;
	}

	return (data?.[0] || null) as Poem | null;
}

export async function createPoem(formData: {
	title: string;
	content: string;
	tags: string[];
	is_published: boolean;
}): Promise<Poem> {
	const supabase = await createClient();
	const slug = slugify(formData.title);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error } = await (supabase as any)
		.from("poems")
		.insert({
			...formData,
			slug,
		})
		.select()
		.single();

	if (error) throw error;
	revalidatePath("/poems");
	revalidatePath("/admin");
	return data as Poem;
}

export async function updatePoem(
	id: string,
	updates: Partial<Omit<Poem, "id" | "created_at">>
): Promise<Poem> {
	const supabase = await createClient();

	const updateData = { ...updates } as Record<string, unknown>;
	if (updates.title) {
		updateData.slug = slugify(updates.title);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, error } = await (supabase as any)
		.from("poems")
		.update({ ...updateData, updated_at: new Date().toISOString() })
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	revalidatePath("/poems");
	revalidatePath("/admin");
	return data as Poem;
}

export async function deletePoem(id: string): Promise<void> {
	const supabase = await createClient();
	const { error } = await supabase.from("poems").delete().eq("id", id);
	if (error) throw error;
	revalidatePath("/poems");
	revalidatePath("/admin");
}

export async function togglePublish(
	id: string,
	is_published: boolean
): Promise<void> {
	const supabase = await createClient();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { error } = await (supabase as any)
		.from("poems")
		.update({ is_published, updated_at: new Date().toISOString() })
		.eq("id", id);
	if (error) throw error;
	revalidatePath("/poems");
	revalidatePath("/admin");
}