import { BookingExperience } from "@/components/booking-experience";
import { getUserSession } from "@/lib/auth";

type BookingPageProps = {
  searchParams: Promise<{ tour?: string }>;
};

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const params = await searchParams;
  const user = await getUserSession();

  return (
    <BookingExperience
      initialTourSlug={params.tour}
      initialEmail={user?.email}
      initialPhone={user?.phone}
    />
  );
}
