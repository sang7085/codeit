import { Item, ItemDetail } from "@/types/todo";

export const tenantId = "basira";
const baseUrl = "https://assignment-todolist-api.vercel.app";

export async function getItems(
	page = 1,
	pageSize = 10): Promise<Item[]> {
	try {
		const response = await fetch(`${baseUrl}/api/${tenantId}/items?page=${page}&pageSize=${pageSize}`);
		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
		console.log("error");
		return [];
	}
}

export async function addItem(name: string) {
	// 공백값 안들어가게
	const trimmed = name.trim();
	if (!trimmed) return null;
	try {
		const response = await fetch(`${baseUrl}/api/${tenantId}/items`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});
		const json = await response.json();
		return json;
	} catch (error) {
		console.log("error");
		return [];
	}
}

export async function deleteItems(itemId: number,) {
	try {
		const response = await fetch(`${baseUrl}/api/${tenantId}/items/${itemId}`, { method: "DELETE" });
		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
		console.log("error");
		return [];
	}
}

// 항목수정
export async function editItem(
	itemId: number,
	payload: {
		name: string;
		memo: string | null;
		imageUrl: string | null;
		isCompleted: boolean;
	}
) {
	try {
		const response = await fetch(
			`${baseUrl}/api/${tenantId}/items/${itemId}`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			}
		);

		const json = await response.json();
		return json;
	} catch (error) {
		console.log("error");
		return null;
	}
}

// 디테일 페이지
export async function getItemDetail(itemId: number,) {
	try {
		const response = await fetch(`${baseUrl}/api/${tenantId}/items/${itemId}`);
		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
		console.log("error");
		return [];
	}
}

// 이미지 업로드
export async function uploadImage(file: File) {
	try {
		const formData = new FormData();
		formData.append("image", file);

		const response = await fetch(`${baseUrl}/api/${tenantId}/images/upload`, {
			method: "POST",
			body: formData,
		});

		const json = await response.json();
		return json;
	} catch (error) {
		console.log("error");
		return null;
	}
}
