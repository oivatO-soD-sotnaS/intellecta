import EventsClient from "./components/EventsClient"

export default function Page({ params }: { params: { id: string } }) {
  return <EventsClient institutionId={params.id} />
}
