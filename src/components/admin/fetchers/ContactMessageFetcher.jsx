import { getAllContactMessages } from "@/actions/contactActions";
import ContactMessagesTable from "@/components/admin/tables/ContactMessagesTable";

export default async function ContactMessageFetcher() {
  const messages = await getAllContactMessages();
  return <ContactMessagesTable messages={messages} />;
}
