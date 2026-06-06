import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { contactInfo } from "@/lib/contact-data";
import { destinations, siteKnowledge } from "@/lib/travel-data";

export async function POST(req: Request) {
  const { message } = (await req.json()) as { message?: string };
  const prompt = String(message ?? "").trim();

  if (!prompt) {
    return Response.json({ answer: "Асуух зүйлээ бичээрэй." }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { answer: "Чатботын түлхүүр тохируулаагүй байна." },
      { status: 500 },
    );
  }

  const normalizedPrompt = prompt.toLowerCase();
  const matchedDestination = destinations.find((destination) => {
    const title = destination.title.toLowerCase();
    const shortTitle = destination.shortTitle.toLowerCase();
    return (
      normalizedPrompt.includes(title) ||
      normalizedPrompt.includes(shortTitle) ||
      destination.tags.some((tag) => normalizedPrompt.includes(tag.toLowerCase()))
    );
  });

  if (matchedDestination) {
    return Response.json({
      answer: `${matchedDestination.title}: ${matchedDestination.days}, тохиромжтой улирал ${matchedDestination.bestSeason}, ${matchedDestination.groupSize}, үнэ ${matchedDestination.priceFrom}. Багтсан үйлчилгээ: ${matchedDestination.includes.join(", ")}. Эцсийн үнэ хүний тоо, өдөр, буудал, нэмэлт үйлчилгээний сонголтоос хамаарна.`,
    });
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: `Чи Sakura Travel вэбсайтын аяллын туслах чатбот.
Зөвхөн доорх "Вэбсайтын мэдээлэл" хэсэгт байгаа мэдээлэлд тулгуурлаж Монгол хэлээр цэгцтэй, богино хариул.
Баримт зохиож болохгүй. Мэдэхгүй зүйл байвал захиалгын маягтаар хүсэлт үлдээхийг зөвлө.
Зөвхөн Sakura Travel, Япон аялал, маршрут, төлбөр, захиалга, холбоо барих мэдээлэлтэй холбоотой асуултад хариул.
Хэрэв хэрэглэгч өөр сэдэв асуувал "Уучлаарай, би зөвхөн Sakura Travel-ийн аялал, маршрут, захиалгатай холбоотой асуултад хариулна." гэж хэлээд өөр мэдээлэл бүү өг.
Үнэ урьдчилсан бөгөөд эцсийн үнэ хүний тоо, өдөр, буудал, тээврээс хамаарна гэж шаардлагатай үед сануул.

Вэбсайтын мэдээлэл:
${siteKnowledge}

Холбоо барих мэдээлэл:
Хаяг: ${contactInfo.address}
Утас: ${contactInfo.phone}
Имэйл: ${contactInfo.email}
Инстаграм: ${contactInfo.instagram}
Веб: ${contactInfo.website}
Facebook/Page нэр: ${contactInfo.pageName}`,
      prompt,
    });

    return Response.json({ answer: text });
  } catch {
    return Response.json(
      {
        answer:
          "Чатбот түр ажиллахгүй байна. Түлхүүр болон интернет холболтоо шалгана уу.",
      },
      { status: 500 },
    );
  }
}
