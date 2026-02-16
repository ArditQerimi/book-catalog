import { db } from "./lib/db";
import { scholars, historyEvents, categories, authorsInfo, languages, books } from "./schema";

async function seed() {
    console.log("Seeding the legacy...");

    // Seed Categories
    console.log("Preserving categories...");
    await db.insert(categories).values([
        { name: "Philosophy", description: "The study of fundamental questions about existence, knowledge, and values." },
        { name: "Theology", description: "The systematic study of the nature of the divine and religious belief." },
        { name: "Medicine", description: "The science and practice of establishing the diagnosis, prognosis, and treatment of disease." },
        { name: "Mathematics", description: "The science of numbers, space, and quantity." },
        { name: "Poetry", description: "A form of literature that uses aesthetic and rhythmic qualities of language." }
    ]).onConflictDoNothing();

    // Seed Authors Info
    console.log("Archiving sages...");
    await db.insert(authorsInfo).values([
        { name: "Al-Ghazali", deathYear: 1111, bio: "Hujjat al-Islam, master of theology and philosophy.", image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800" },
        { name: "Ibn Sina", deathYear: 1037, bio: "The Shaykh al-Ra'is, father of early modern medicine.", image: "https://images.unsplash.com/photo-1473186578172-c141e6798ec4?auto=format&fit=crop&q=80&w=800" },
        { name: "Rumi", deathYear: 1273, bio: "Renowned mystic and poet of the 13th century.", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" }
    ]).onConflictDoNothing();

    // Seed Languages
    console.log("Recording tongues...");
    await db.insert(languages).values([
        { name: "Arabic", code: "ar" },
        { name: "Persian", code: "fa" },
        { name: "Latin", code: "la" },
        { name: "Greek", code: "gr" }
    ]).onConflictDoNothing();

    // Seed Scholars
    console.log("Documenting scholars...");
    await db.insert(scholars).values([
        {
            name: "Al-Ghazali",
            title: "Hujjat al-Islam (Proof of Islam)",
            period: "1058–1111 CE",
            bio: "A polymath and one of the most influential philosophers, theologians, and mystics. His 'The Incoherence of the Philosophers' was a landmark in intellectual history.",
            image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800",
            specialization: "Philosophy / Theology",
        },
        {
            name: "Ibn Sina (Avicenna)",
            title: "Al-Shaykh al-Ra'is",
            period: "980–1037 CE",
            bio: "The father of early modern medicine. His 'Canon of Medicine' remained a standard medical authority in Europe and the Islamic world for centuries.",
            image: "https://images.unsplash.com/photo-1473186578172-c141e6798ec4?auto=format&fit=crop&q=80&w=800",
            specialization: "Medicine / Philosophy",
        },
        {
            name: "Fatima al-Fihri",
            title: "Founder of Al-Qarawiyyin",
            period: "800–880 CE",
            bio: "A visionary woman who founded the University of al-Qarawiyyin in Fes, recognized by UNESCO and Guinness World Records as the oldest existing, continually operating university.",
            image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800",
            specialization: "Education / Philanthropy",
        }
    ]).onConflictDoNothing();

    // Seed History Events
    console.log("Chiseling history...");
    await db.insert(historyEvents).values([
        {
            title: "The House of Wisdom (Bayt al-Hikmah)",
            period: "8th–13th Century",
            description: "Founded in Baghdad by Harun al-Rashid, this center of learning hosted the Translation Movement, where major Greek and Indian texts were preserved in Arabic.",
            image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
            type: "achievement",
            order: 1,
        },
        {
            title: "The Golden Age of Al-Andalus",
            period: "711–1492 CE",
            description: "A period of unparalleled cultural and scientific flourishing in Islamic Iberia, where scholars of different faiths collaborated in centers like Cordoba and Granada.",
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800",
            type: "era",
            order: 2,
        }
    ]).onConflictDoNothing();

    // Seed Books
    console.log("Enshrining manuscripts...");
    await db.insert(books).values([
        {
            title: "The Deliverance from Error",
            author: "Al-Ghazali",
            category: "Philosophy",
            year: 1108,
            description: "An autobiographical work by Al-Ghazali, discussing his spiritual journey and the path to knowledge.",
            historicalContext: "Written during a period of deep intellectual crisis in the Islamic world.",
            coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
            isbn: "978-0-123456-01-1",
            pages: 150,
            language: "Arabic",
            publisher: "Legacy Exports",
            price: "25.00",
            themes: ["Spirituality", "Skepticism", "Theology"]
        },
        {
            title: "The Canon of Medicine",
            author: "Ibn Sina",
            category: "Medicine",
            year: 1025,
            description: "One of the most famous medical books in history, which served as a textbook for medical students for centuries.",
            historicalContext: "A culmination of Graeco-Roman, Persian, and Indian medical traditions.",
            coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
            isbn: "978-0-123456-02-2",
            pages: 800,
            language: "Arabic",
            publisher: "Hamadard Publications",
            price: "45.99",
            themes: ["Medicine", "Anatomy", "Healing"]
        }
    ]).onConflictDoNothing();

    console.log("Archive populated with the wisdom of sages.");
}

seed().catch(console.error);
