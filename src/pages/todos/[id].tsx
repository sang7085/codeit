import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ItemDetail } from "@/types/todo";
import { getItemDetail, editItem, uploadImage, deleteItems } from "@/services/todoApi";
import Header from "@/components/header";

export default function TodoDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [detail, setDetail] = useState<ItemDetail | null>(null);
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const initialRef = useRef<{
    name: string;
    memo: string;
    imageUrl: string;
    isCompleted: boolean;
  } | null>(null);

  async function fetchDetail(itemId: number) {
    const data = await getItemDetail(itemId);
    setDetail(data);
  }

  useEffect(() => {
    if (!router.isReady) return;

    const itemId = Number(id);
    if (Number.isNaN(itemId)) return;

    fetchDetail(itemId);
  }, [router.isReady, id]);

  // 내용 수정하기
  useEffect(() => {
    if (!detail) return;

    const init = {
      name: detail.name ?? "",
      memo: detail.memo ?? "",
      imageUrl: detail.imageUrl ?? "",
      isCompleted: detail.isCompleted,
    };

    setName(init.name);
    setMemo(init.memo);
    setImageUrl(init.imageUrl);
    setIsCompleted(init.isCompleted);

    initialRef.current = init;
  }, [detail]);

  const isDirty = useMemo(() => {
    const init = initialRef.current;
    if (!init) return false;

    return (
      name !== init.name ||
      memo !== init.memo ||
      imageUrl !== init.imageUrl ||
      isCompleted !== init.isCompleted
    );
  }, [name, memo, imageUrl, isCompleted]);

  // 파일첨부하기
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("이미지는 최대 5MB까지 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);
      const result = await uploadImage(file);
      const url =
        (result as any)?.url ??
        (result as any)?.imageUrl ??
        (result as any)?.image_url ??
        null;

      setImageUrl(url);
    } catch (error) {
      console.error(error);
      alert("이미지 업로드 실패");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  // 삭제하기
  async function handleDelete() {
    if (!detail) return;

    try {
      await deleteItems(detail.id);
      router.push("/");
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  }

  // 수정완료
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!detail) return;

    const trimmedName = name.trim();
    if (!trimmedName) return;

    await editItem(detail.id, {
      name: trimmedName,
      memo: memo.trim(),
      imageUrl: imageUrl.trim(),
      isCompleted,
    });

    router.push("/");
  }

  return (
    <>
      <Header />
      <main>
        <div className="inner">
          <div className="detail-wrap">
            <form
              onSubmit={handleSubmit}
            >
              <div className={`check-box-wrap ${isCompleted ? "checked" : ""}`}>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                  />
                  <span className="custom-checkbox" />
                </label>

                <label className="name-label">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
              </div>

              <div className="detail-con">
                <div className={`file-wrap ${!imageUrl ? "no-data" : ""}`}>
                  {!!imageUrl && (
                    <div className="preview">
                      <img src={imageUrl} alt="미리보기" />
                    </div>
                  )}

                  <button
                    className="btn-file"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>

                <div className="memo-wrap">
                  <label>
                    <div className="title">Memo</div>
                    <textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      rows={3}
                    />
                  </label>
                </div>
              </div>


              <div className="btn-wrap">
                <button
                  type="submit"
                  disabled={!isDirty || isUploading}
                  className={`btn-submit ${(!isDirty || isUploading) ? "disabled" : ""}`}
                >
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isUploading}
                  className="btn-delete"
                >
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
