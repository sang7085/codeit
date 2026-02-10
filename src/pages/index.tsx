// src/pages/index.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { Item } from "../types/todo";
import Link from "next/link";
import Image from "next/image";
import { getItems, addItem } from "../services/todoApi";
import Header from "@/components/header";

export default function HomePage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState("");

  const todoItems = items.filter((item) => !item.isCompleted);
  const doneItems = items.filter((item) => item.isCompleted);

  async function fetchTodosList() {
    const data = await getItems();
    setItems(data);
  }

  useEffect(() => {
    fetchTodosList();
  }, []);

  // ⭐ 수정: 의존성 배열을 빈 배열로 변경
  useEffect(() => {
    const handleRouteChange = () => {
      fetchTodosList();
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []); // ⭐ 빈 배열로 변경

  async function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;

    await addItem(trimmed);
    setInput("");
    fetchTodosList();
  }

  return (
    <>
      <Header />
      <main>
        <div className="inner">
          <div className="input-wrap">
            <div className="enter-inp-wrap">
              <input
                className="enter-inp"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="할 일을 입력해주세요"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                  }
                }}
              />
            </div>
            <button
              className={`btn-add${input.trim() ? " on" : ""}`}
              onClick={handleAdd}
            ></button>
          </div>
          <div className="con">
            <div className="left-box">
              <h2 className="box-title"><Image src="/assets/images/img-box-title01.svg" width={100} height={36} alt="TODO" /></h2>
              <ul className="item-list-wrap">
                {todoItems.map((item) => (
                  <li className="item-list" key={item.id}>
                    <Link href={`/todos/${item.id}`}>
                      <div className="info">
                        <div className="checkbox"><Image src="/assets/images/img-check-off.svg" width={32} height={32} alt="checked" /></div>
                        <h3>{item.name}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
                {todoItems.length === 0 &&
                  <div className="no-data todo">
                    <Image src="/assets/images/img-nodata01.svg" width={200} height={200} alt="TODO" />
                    <p>할 일이 없어요.<br />TODO를 새롭게 추가해주세요!</p>
                  </div>
                }
              </ul>
            </div>

            <div className="right-box">
              <h2 className="box-title"><Image src="/assets/images/img-box-title02.svg" width={97} height={36} alt="DONE" /></h2>
              <ul className="item-list-wrap checked">
                {doneItems.map((item) => (
                  <li className="item-list" key={item.id}>
                    <Link href={`/todos/${item.id}`}>
                      <div className="info">
                        <div className="checkbox"><Image src="/assets/images/img-check-on.svg" width={32} height={32} alt="checked" /></div>
                        <h3>{item.name}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
                {doneItems.length === 0 &&
                  <div className="no-data todo">
                    <Image src="/assets/images/img-nodata01.svg" width={200} height={200} alt="TODO" />
                    <p>할 일이 없어요.<br />TODO를 새롭게 추가해주세요!</p>
                  </div>
                }
              </ul>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}