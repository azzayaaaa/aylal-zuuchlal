import {
  Bot,
  CreditCard,
  Newspaper,
  Percent,
  WalletCards,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { blogPosts } from "@/lib/travel-data";

const paymentCards = [
  {
    icon: WalletCards,
    title: "Урьдчилгаа төлбөр",
    text: "Захиалга pending төлөвтэй үүсээд админ төлбөр баталгаажуулсны дараа confirmed болно.",
  },
  {
    icon: CreditCard,
    title: "Бүтэн төлбөр",
    text: "Дансаар төлөх, баримт илгээх, payment success төлөв рүү шилжүүлэх урсгалд бэлэн.",
  },
  {
    icon: Percent,
    title: "Group хөнгөлөлт",
    text: "Гэр бүл, найзууд, байгууллагын аялалд зориулсан тусгай нөхцөлийг захиалга дээр тэмдэглэнэ.",
  },
];

const aiCards = [
  "5 сая төгрөгтэй, 7 хоног амарна гэвэл Tokyo + Fuji багцыг санал болгоно.",
  "Гэр бүл, couple, group гэсэн нөхцөлөөр тохирох багц сонгоход тусална.",
  "Anime сонирхдог бол Akihabara, Shibuya, Ikebukuro, Ghibli Museum чиглэлтэй маршрут санал болгоно.",
  "FAQ chatbot нь Sakura Travel, Япон аялал, төлбөрийн асуултад төвлөрч хариулна.",
];

export function PaymentSection() {
  return (
    <section id="payment" className="bg-[#fbf7ef] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#276457]">
            Төлбөр
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            Захиалга, төлбөр, үлдэгдэл хяналттай
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {paymentCards.map(({ icon: Icon, title, text }) => (
            <Reveal
              key={title}
              className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-[#ead9c4]"
            >
              <Icon className="h-7 w-7 text-[#d7a34f]" />
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-3 leading-7 text-[#5d655f]">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AiFeatureSection() {
  return (
    <section id="ai" className="bg-[#10201d] py-20 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f4c76b]">
            AI туслах
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            Аялал, itinerary санал болгоно
          </h2>
          <p className="mt-5 leading-8 text-white/72">
            Хэрэглэгч төсөв, хугацаа, сонирхлоо бичихэд тохирох багц болон
            өдрийн маршрут санал болгох chatbot доод буланд ажиллана.
          </p>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {aiCards.map((item) => (
            <Reveal
              key={item}
              className="rounded-[24px] border border-white/12 bg-white/7 p-5"
            >
              <Bot className="h-6 w-6 text-[#f4c76b]" />
              <p className="mt-4 leading-7 text-white/82">{item}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogNewsSection() {
  return (
    <section id="blog" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#276457]">
            Зөвлөгөө
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-normal sm:text-5xl">
            Япон аяллын зөвлөгөө
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <Reveal
              key={post.title}
              className="rounded-[28px] bg-[#fbf7ef] p-6 ring-1 ring-[#ead9c4]"
            >
              <Newspaper className="h-6 w-6 text-[#276457]" />
              <p className="mt-5 text-sm font-semibold text-[#b0184c]">
                {post.category} · {post.readTime}
              </p>
              <h3 className="mt-3 text-xl font-semibold leading-snug">
                {post.title}
              </h3>
              <p className="mt-3 leading-7 text-[#5d655f]">{post.excerpt}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
