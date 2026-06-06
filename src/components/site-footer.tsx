import Image from "next/image";
import { AtSign, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "@/lib/contact-data";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer relative overflow-hidden bg-[#10201d] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8c77a]/45 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-5 md:grid-cols-[1.1fr_0.8fr_0.9fr] lg:px-8">
        <div className="footer-reveal">
          <div className="flex items-center gap-3">
            <Image
              src="/sakura-travel-logo.svg"
              alt="Sakura Travel logo"
              width={56}
              height={56}
              className="h-14 w-14 rounded-[8px] bg-white object-contain p-1"
            />
            <div>
              <p className="font-semibold">Sakura Travel</p>
              <p className="mt-1 text-sm text-white/66">{contactInfo.pageName}</p>
            </div>
          </div>
          <p className="mt-5 max-w-md leading-7 text-white/72">
            Япон аяллын маршрут, буудал, тээвэр, захиалгын зөвлөгөөг нэг дор
            зохион байгуулдаг premium travel desk.
          </p>
        </div>

        <div className="footer-reveal">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4c76b]">
            Address
          </h2>
          <a
            href={contactInfo.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-4 flex items-start gap-3 overflow-hidden rounded-[8px] border border-white/12 bg-white/7 p-4 leading-7 text-white/78 transition hover:bg-white/12 hover:text-white"
          >
            <span className="absolute inset-x-4 bottom-3 h-px bg-gradient-to-r from-[#e8c77a]/0 via-[#e8c77a]/45 to-[#e8c77a]/0" />
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#f4c76b]" />
            <span>
              {contactInfo.address}
              <ExternalLink className="ml-2 inline h-4 w-4 align-[-2px]" />
            </span>
          </a>
        </div>

        <div className="footer-reveal">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4c76b]">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-white/78">
            <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition hover:text-white">
              <Phone className="h-4 w-4 text-[#f4c76b]" />
              {contactInfo.phone}
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-2 transition hover:text-white">
              <Mail className="h-4 w-4 text-[#f4c76b]" />
              {contactInfo.email}
            </a>
            <p className="footer-social flex items-center gap-2 transition hover:text-white">
              <AtSign className="h-4 w-4 text-[#f4c76b]" />
              {contactInfo.instagram}
            </p>
            <a href={contactInfo.websiteUrl} target="_blank" rel="noopener noreferrer" className="footer-social inline-flex items-center gap-2 transition hover:text-white">
              {contactInfo.website}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Sakura Travel LLC
      </div>
    </footer>
  );
}
