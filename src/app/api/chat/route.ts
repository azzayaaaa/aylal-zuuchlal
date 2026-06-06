import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { contactInfo } from "@/lib/contact-data";

const CHAT_MODEL = process.env.CHAT_MODEL || "llama-3.1-8b-instant";
const CHAT_TIMEOUT_MS = 8000;

const packageKnowledge = [
  {
    name: "Токио & Фүжи уулын аялал",
    aliases: ["tokyo", "fuji", "фүжи", "сакура", "kawaguchiko", "oshino"],
    duration: "7 өдөр / 6 шөнө",
    price: "3,990,000₮-с",
    fit: "хос, найзууд, зураг авах дуртай аялагчдад",
    route: "Улаанбаатар → Токио → Фүжи → Шибуяа",
    highlights: "Фүжи уул, Lake Kawaguchiko, Oshino Hakkai, Oishi Park, Shibuya, Gotemba outlet",
  },
  {
    name: "Tokyo Disneyland гэр бүлийн аялал",
    aliases: ["disney", "disneyland", "дисней", "гэр бүл", "хүүхэд"],
    duration: "6 өдөр / 5 шөнө",
    price: "4,590,000₮-с",
    fit: "хүүхэдтэй гэр бүлд",
    route: "Улаанбаатар → Токио → Disneyland → Odaiba",
    highlights: "Disneyland, DisneySea сонголт, Odaiba, TeamLab, хүүхдэд ээлтэй хотын маршрут",
  },
  {
    name: "Токио premium shopping аялал",
    aliases: ["shopping", "шоппинг", "anime", "аниме", "akihabara", "harajuku", "ginza"],
    duration: "5 өдөр / 4 шөнө",
    price: "3,290,000₮-с",
    fit: "найзууд, хосууд, shopping/anime сонирхогчдод",
    route: "Улаанбаатар → Токио → Shibuya → Akihabara",
    highlights: "Shibuya, Harajuku, Omotesando, Ginza, Akihabara, Gotemba outlet",
  },
];

const quickReplies = [
  {
    patterns: ["hi", "hello", "сайн уу", "sain uu", "сайн байна уу", "sn uu"],
    answer:
      "Сайн байна уу! Би Sakura Travel-ийн AI туслах байна. Төсөв, хоног, хэдэн хүн явах, гэр бүл/хос/найзууд эсэхээ хэлбэл Tokyo, Fuji, Disneyland, shopping, anime сонирхолд тааруулж маршрут санал болгоё.",
  },
  {
    patterns: ["утас", "phone", "холбогдох", "contact", "хаяг", "байршил"],
    answer: `Бидэнтэй ${contactInfo.phone} утсаар, ${contactInfo.email} имэйлээр холбогдож болно. Хаяг: ${contactInfo.address}.`,
  },
  {
    patterns: ["захиалга", "booking", "захиалах", "захиал"],
    answer:
      "Захиалга хийхдээ аяллаа сонгоод нэр, утас, имэйл, явах өдөр, хүний тоогоо бөглөнө. Дараа нь Sakura Travel-ийн менежер тантай холбогдож суудал, төлбөр, маршрутыг баталгаажуулна.",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replaceAll("ү", "у")
    .replaceAll("ө", "о")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchedPackage(prompt: string) {
  const normalizedPrompt = normalize(prompt);
  return packageKnowledge.find((item) =>
    item.aliases.some((alias) => normalizedPrompt.includes(normalize(alias))),
  );
}

function extractNumberBefore(prompt: string, words: string[]) {
  const escapedWords = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const match = prompt.match(new RegExp(`(\\d+)\\s*(?:${escapedWords})`, "iu"));
  return match ? Number(match[1]) : null;
}

function itineraryAnswer(prompt: string) {
  const normalizedPrompt = normalize(prompt);
  const asksForPlan = ["төсөв", "tosov", "хоног", "honog", "маршрут", "itinerary", "аялал"].some(
    (word) => normalizedPrompt.includes(normalize(word)),
  );

  if (!asksForPlan) return null;

  const days = extractNumberBefore(prompt, ["хоног", "өдөр", "хон", "honog", "udur", "udur"]) ?? undefined;
  const people = extractNumberBefore(prompt, ["хүн", "hun", "том хүн"]) ?? undefined;
  const budgetMillion = extractNumberBefore(prompt, ["сая", "say"]) ?? undefined;
  const likesDisney = ["disney", "disneyland", "дисней", "гэр бүл", "хүүхэд"].some((word) =>
    normalizedPrompt.includes(normalize(word)),
  );
  const likesAnimeShopping = ["anime", "аниме", "shopping", "шоппинг", "akihabara", "harajuku"].some((word) =>
    normalizedPrompt.includes(normalize(word)),
  );
  const likesFuji = ["fuji", "фүжи", "сакура", "зураг"].some((word) =>
    normalizedPrompt.includes(normalize(word)),
  );

  const recommended = likesDisney
    ? packageKnowledge[1]
    : likesAnimeShopping || (days && days <= 5)
      ? packageKnowledge[2]
      : likesFuji || (days && days >= 7)
        ? packageKnowledge[0]
        : packageKnowledge[1];

  const travelerText = people ? `${people} хүнд` : "танай багт";
  const dayText = days ? `${days} хоногт` : "сонгосон хоногт";
  const budgetText = budgetMillion
    ? ` ${budgetMillion} сая төгрөгийн төсөв ${people && people > 1 ? "нийт төсөв үү, нэг хүний төсөв үү гэдгээс эцсийн сонголт хамаарна." : "бол нэг хүний төсөв гэж үзвэл илүү бодитой төлөвлөх боломжтой."}`
    : " Төсвөө хэлбэл буудал, тээвэр, нэмэлт үзвэрийг илүү нарийвчилж өгнө.";

  return `${travelerText} ${dayText} ${recommended.name} хамгийн тохиромжтой санагдаж байна. ${budgetText}

Санал болгох маршрут:
1. Улаанбаатараас Токио руу нисэж, буудалдаа байрлана.
2. Токиогийн хотын аялал: Asakusa, Skytree, Shibuya.
3. ${recommended.highlights}.
4. Сонирхлоосоо хамаараад ${likesAnimeShopping ? "Akihabara, Harajuku, Ginza shopping" : likesDisney ? "Disneyland эсвэл DisneySea" : "Gotemba outlet эсвэл Oishi Park"} нэмнэ.
5. Сүүлийн өдөр чөлөөт shopping хийгээд буцах нислэгтээ бэлдэнэ.

Урьдчилсан үнэ: ${recommended.price}. Эцсийн үнэ хүний тоо, өдөр, буудал, тээвэр, нэмэлт үйлчилгээний сонголтоос хамаарна.`;
}

function instantAnswer(prompt: string) {
  const normalizedPrompt = normalize(prompt);
  const normalizedWords = new Set(normalizedPrompt.split(" "));
  const quick = quickReplies.find((item) =>
    item.patterns.some((pattern) => {
      const normalizedPattern = normalize(pattern);
      if (["hi", "hello", "sn"].includes(normalizedPattern)) {
        return normalizedWords.has(normalizedPattern);
      }

      return normalizedPrompt.includes(normalizedPattern);
    }),
  );

  if (quick) return quick.answer;

  const itinerary = itineraryAnswer(prompt);
  if (itinerary) return itinerary;

  const pack = matchedPackage(prompt);
  if (!pack) return null;

  return `${pack.name} санал болгож байна. Хугацаа: ${pack.duration}. Үнэ: ${pack.price}. Маршрут: ${pack.route}. Онцлох хэсэг: ${pack.highlights}. Энэ багц ${pack.fit} хамгийн тохиромжтой. Эцсийн үнэ хүний тоо, өдөр, буудал, нэмэлт үйлчилгээний сонголтоос хамаарна.`;
}

function systemPrompt() {
  const packageText = packageKnowledge
    .map(
      (item) =>
        `- ${item.name}: ${item.duration}, ${item.price}, ${item.fit}. Маршрут: ${item.route}. Онцлох: ${item.highlights}.`,
    )
    .join("\n");

  return `Чи Sakura Travel вэбсайтын аяллын AI туслах.
Зөв, цэвэр, алдаагүй Монгол хэлээр ярь. Хариулт чинь дулаан, ойлгомжтой, богино байна.
Хэрэглэгч латинаар бичвэл Монгол кириллээр хариул.
Зөвхөн Sakura Travel, Япон аялал, Tokyo/Fuji/Disneyland/shopping/anime маршрут, төсөв, хоног, захиалга, төлбөр, холбоо барих мэдээлэлтэй холбоотой асуултад хариул.
Баримт зохиож болохгүй. Мэдэхгүй зүйл байвал захиалгын маягтаар хүсэлт үлдээхийг санал болго.
Үнэ урьдчилсан бөгөөд эцсийн үнэ хүний тоо, өдөр, буудал, тээвэр, нэмэлт үйлчилгээний сонголтоос хамаарна гэж шаардлагатай үед сануул.

Аяллын багцууд:
${packageText}

Холбоо барих:
Утас: ${contactInfo.phone}
Имэйл: ${contactInfo.email}
Хаяг: ${contactInfo.address}
Instagram: ${contactInfo.instagram}
Вэб: ${contactInfo.website}
Facebook/Page: ${contactInfo.pageName}`;
}

export async function POST(req: Request) {
  const { message } = (await req.json()) as { message?: string };
  const prompt = String(message ?? "").trim();

  if (!prompt) {
    return Response.json({ answer: "Асуух зүйлээ бичээрэй." }, { status: 400 });
  }

  const localAnswer = instantAnswer(prompt);
  if (localAnswer) {
    return Response.json({ answer: localAnswer, source: "local" });
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { answer: "Чатботын түлхүүр тохируулаагүй байна." },
      { status: 500 },
    );
  }

  try {
    const { text } = await generateText({
      model: groq(CHAT_MODEL),
      system: systemPrompt(),
      prompt,
      temperature: 0.3,
      maxOutputTokens: 260,
      maxRetries: 1,
      timeout: CHAT_TIMEOUT_MS,
    });

    return Response.json({ answer: text.trim(), source: "ai" });
  } catch (error) {
    console.error("Chat generation failed", error);

    return Response.json({
      answer:
        "Уучлаарай, AI туслах түр удааширлаа. Та төсөв, хоног, хэдэн хүн явах, Fuji/Disneyland/shopping/anime сонирхлоо бичээд дахин илгээнэ үү.",
      source: "fallback",
    });
  }
}
