import { useEffect, useState } from "react";
import type { MyListItem } from "../services/myList";
import { readMyList, toggleMyList } from "../services/myList";

export function useMyList() {
  const [items, setItems] = useState<MyListItem[]>([]);

  useEffect(() => {
    setItems(readMyList());
  }, []);

  const toggle = (item: MyListItem) => {
    const res = toggleMyList(item);
    setItems(res.items);
    return res.isNowInList;
  };

  const contains = (id: number) => items.some((m) => m.id === id);

  return { items, toggle, contains };
}
