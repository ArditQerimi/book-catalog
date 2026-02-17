import 'dotenv/config';
import { db } from '../lib/db';
import { books, users, scholars, categories, authorsInfo, languages } from '../schema';
import { MOCK_BOOKS } from '../constants';
import * as bcrypt from 'bcrypt';

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Seed Categories
        console.log('   Populating categories...');
        const categoriesData = [
            { name: "Philosophy", description: "The study of fundamental questions about existence, knowledge, and values." },
            { name: "Theology", description: "The systematic study of the nature of the divine and religious belief." },
            { name: "Medicine", description: "The science and practice of establishing the diagnosis, prognosis, and treatment of disease." },
            { name: "Mathematics", description: "The science of numbers, space, and quantity." },
            { name: "Poetry", description: "A form of literature that uses aesthetic and rhythmic qualities of language." },
            { name: "History", description: "The study of past events, particularly in human affairs." }
        ];
        for (const cat of categoriesData) {
            await db.insert(categories).values(cat).onConflictDoNothing();
        }

        // 2. Seed Authors Info
        console.log('   Populating authors info...');
        const authorsData = [
            { name: "Abu Khadeejah", bio: "Contemporary scholar and teacher focusing on Theology and Hadith.", image: "" },
            { name: "Ali Nasir al-Faqihi", bio: "Respected scholar known for his works on Islamic creed and the rights of the Companions.", image: "" },
            { name: "Ibn Taymiyyah", deathYear: 1328, bio: "Shaykh al-Islam, one of the most influential scholars in Islamic history, known for his vast knowledge in theology and law.", image: "" },
            { name: "Muhammad ibn Abdul-Wahhab", deathYear: 1792, bio: "A monumental scholar and reformer who called for a return to the pure foundations of monotheism.", image: "" },
            { name: "Abu Iyaad", bio: "Contemporary scholar and researcher specializing in Islamic theology and history.", image: "" },
            { name: "Ubayd al-Jabiri", deathYear: 2022, bio: "Prominent contemporary scholar known for his clear explanations of Islamic creed and methodology.", image: "" },
            { name: "Ibn Abee Daawud", deathYear: 929, bio: "Classical scholar of Hadith and theology, author of the famous creedal poem Al-Ha'iyyah.", image: "" },
            { name: "Shaykh Uthaymeen", deathYear: 2001, bio: "One of the giants of the 20th century, master of Fiqh, Aqeedah, and Tafsir.", image: "" },
            { name: "Saleh al-Fawzan", bio: "Highly respected contemporary scholar and member of the Council of Senior Scholars.", image: "" },
            { name: "Muhammad Al-Wasaabee", deathYear: 2015, bio: "Influential contemporary scholar from Yemen, known for his dedication to teaching the Sunnah.", image: "" }
        ];
        for (const auth of authorsData) {
            await db.insert(authorsInfo).values(auth).onConflictDoNothing();
        }

        // 3. Seed Languages
        console.log('   Populating languages...');
        const languagesData = [
            { name: "Arabic", code: "ar" },
            { name: "Persian", code: "fa" },
            { name: "Latin", code: "la" },
            { name: "Greek", code: "gr" },
            { name: "English", code: "en" }
        ];
        for (const lang of languagesData) {
            await db.insert(languages).values(lang).onConflictDoNothing();
        }

        // 4. Seed Scholars
        console.log('   Populating scholars...');
        const scholarsData = [


            {
                name: "Ali Nasir al-Faqihi",
                title: "Shaykh",
                period: "Modern Era",
                bio: "Specialist in Theology and the rights of the Companions.",
                image: "",
                specialization: "Theology / Aqeedah",
            },
            {
                name: "Ibn Taymiyyah",
                title: "Shaykh al-Islam",
                period: "1263–1328 CE",
                bio: "Vast knowledge in theology, philosophy, and law.",
                image: "",
                specialization: "Theology / Jurisprudence",
            },
            {
                name: "Muhammad ibn Abdul-Wahhab",
                title: "Reformer",
                period: "1703–1792 CE",
                bio: "Reformist scholar who called for a return to pure monotheism.",
                image: "",
                specialization: "Theology / Tawhid",
            },
            {
                name: "Abu Iyaad",
                title: "Contemporary Researcher",
                period: "Modern Era",
                bio: "Researcher into Islamic theology and history.",
                image: "",
                specialization: "Theology / History",
            },
            {
                name: "Ubayd al-Jabiri",
                title: "Shaykh",
                period: "1938–2022 CE",
                bio: "Respected teacher of Islamic creed and methodology.",
                image: "",
                specialization: "Theology / Aqeedah",
            },
            {
                name: "Ibn Abee Daawud",
                title: "Imam",
                period: "844–929 CE",
                bio: "Hadith scholar and author of Al-Ha'iyyah.",
                image: "",
                specialization: "Hadith / Theology",
            },
            {
                name: "Shaykh Uthaymeen",
                title: "Shaykh",
                period: "1925–2001 CE",
                bio: "Master of Fiqh, Aqeedah, and Tafsir.",
                image: "",
                specialization: "Theology / Jurisprudence",
            },
            {
                name: "Saleh al-Fawzan",
                title: "Shaykh",
                period: "Born 1933 CE",
                bio: "Member of the Council of Senior Scholars.",
                image: "",
                specialization: "Theology / Jurisprudence",
            },
            {
                name: "Muhammad Al-Wasaabee",
                title: "Shaykh",
                period: "1956–2015 CE",
                bio: "Prominent scholar from Yemen.",
                image: "",
                specialization: "Theology / Tawhid",
            }
        ];
        for (const scholar of scholarsData) {
            await db.insert(scholars).values(scholar).onConflictDoNothing();
        }


        // 5. Seed Admin User
        console.log('   Populating admin account...');
        const hashedPassword = await bcrypt.hash('admin', 10);
        const [admin] = await db.insert(users).values({
            username: 'admin',
            password: hashedPassword,
            role: 'admin',
        }).onConflictDoUpdate({
            target: users.username,
            set: { password: hashedPassword }
        }).returning();

        // 5.5. Seed Alice and Bob
        console.log('   Populating Alice and Bob...');
        const userPassword = await bcrypt.hash('password123', 10);
        await db.insert(users).values([
            { username: 'Alice', password: userPassword, role: 'user' },
            { username: 'Bob', password: userPassword, role: 'user' }
        ]).onConflictDoNothing();

        // 6. Seed Books
        console.log(`   Populating ${MOCK_BOOKS.length} books...`);
        for (const book of MOCK_BOOKS) {
            await db.insert(books).values({
                title: book.title,
                author: book.author,
                category: book.category,
                year: book.year,
                description: book.description,
                historicalContext: book.historicalContext,
                themes: book.themes || [],
                coverImage: book.coverImage,
                isbn: book.isbn,
                pages: book.pages,
                language: book.language,
                publisher: book.publisher,
                price: book.price,
                inStock: book.inStock,
                userId: admin.id
            }).onConflictDoNothing();
        }

        console.log('✅ Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seed();
