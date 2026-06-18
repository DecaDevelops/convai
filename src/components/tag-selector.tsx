import useTags from "@/features/tag/tag-context";
import { TagSelect } from "@/features/tag/tag-types";
import {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "./ui/input";

const TagSelectorItem: React.FC<{
  tag: TagSelect;
  onSelect: VoidFunction;
}> = memo(({ tag, onSelect }) => {
  return (
    <div className="w-full cursor-pointer p-3" onClick={onSelect}>
      {tag.name}
    </div>
  );
});

TagSelectorItem.displayName = "TagSelectorItem";

export default function TagSelector({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: TagSelect[];
  setSelectedTags: Dispatch<SetStateAction<TagSelect[]>>;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const { tags } = useTags();
  const availableTags = useMemo(() => {
    const filteredTags = tags.filter(
      (x) => !selectedTags.some((y) => y.id === x.id),
    );
    return filteredTags;
  }, [selectedTags, tags]);

  const filteredTags = useMemo(() => {
    const search = searchString.toLowerCase().trim();
    if (!search) return availableTags;

    return availableTags.filter((x) => x.name.toLowerCase().includes(search));
  }, [availableTags, searchString]);

  const onFocusIn = (e: MouseEvent) => {
    const current = divRef?.current;
    if (!current) return;
    setOpen(current.contains(e.target as Node));
  };

  const onAdd = (x: TagSelect) => {
    setSelectedTags((c) => [...c, x]);
    setSearchString("");
  };
  useEffect(() => {
    document.addEventListener("mousedown", onFocusIn);
    return () => document.removeEventListener("mousedown", onFocusIn);
  }, []);

  return (
    <div className="w-full relative" ref={divRef}>
      <Input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchString(e.target.value)}
      />
      <div
        className={`bg-slate-900 w-full max absolute bottom-full max-h-36 overflow-y-scroll flex flex-col ${!open && "hidden"}`}
      >
        {filteredTags.map((x) => (
          <TagSelectorItem onSelect={() => onAdd(x)} tag={x} key={x.id} />
        ))}
      </div>
    </div>
  );
}
