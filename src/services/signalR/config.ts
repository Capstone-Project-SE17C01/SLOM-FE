// signalRConnector.ts
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { InitSignalROptions } from "../../types/IMessage";
// import 

export function initSignalRConnection({
  userInfo,
  selectedUser,
  setMessages,
  onConnectionCreated,
}: InitSignalROptions): () => void {
  const connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_API_SERVER}/hub`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  const connectionName = "receivemessage" + (userInfo?.email ?? "");
  const listId: string[] = [];

  connection
    .start()
    .then(() => {
      connection.invoke("RetrieveMessageHistory");
    })
    .catch((err) => {
      console.error("Error while connecting to SignalR Hub:", err);
    });

  connection.on(connectionName, (id, name, content) => {
    if (!listId.includes(id) && name === selectedUser?.email) {
      setMessages((prev) => [
        ...prev,
        { id, content, isSender: false },
      ]);
      listId.push(id);
    }
  });

  // Let parent set connection reference if needed
  if (onConnectionCreated) {
    onConnectionCreated(connection);
  }

  return () => {
    connection.off(connectionName);
    connection.stop(); // clean up
  };
}