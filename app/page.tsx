import { getBooksAction } from "@/lib/actions";
import ArchiveContainer from "@/app/components/ArchiveContainer";

export const revalidate = 60;

export default async function HomePage() {
    const books = await getBooksAction();

    return (
        <div className="w-full">
            <ArchiveContainer initialBooks={books as any} />
        </div>
    );
}
