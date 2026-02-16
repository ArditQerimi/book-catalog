import AdminContainer from "@/app/components/AdminContainer";
import { redirect } from "next/navigation";
import { getBooksAction, getCategoriesAction, getAuthorsInfoAction, getLanguagesAction } from "../../lib/actions";
import { verifySession } from "../../lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    const user = await verifySession();
    if (!user) {
        redirect("/login");
    }

    const [books, categories, authors, languages] = await Promise.all([
        getBooksAction(),
        getCategoriesAction(),
        getAuthorsInfoAction(),
        getLanguagesAction()
    ]);

    return (
        <div className="w-full">
            <AdminContainer
                initialBooks={books as any}
                initialCategories={categories as any}
                initialAuthors={authors as any}
                initialLanguages={languages as any}
            />
        </div>
    );
}
