// signalRConnector.ts
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { InitSignalRNumberNotReadOptions, InitSignalROptions, User,  } from "../../types/IMessage";
// import

export function initSignalRConnection({
  userInfo,
  selectedUser,
  setMessages,
  onConnectionCreated,
  setUsers,
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

  connection.on(
    connectionName,
    (id, name, content, dateTime, images, image, email) => {
      if (!listId.includes(id)) {
        if (name === selectedUser?.email) {
          setMessages((prev) => [
            ...prev,
            { id, content, isSender: false, images },
          ]);
          const newUser: User = {
            id: 1,
            name: email,
            image: image,
            lastMessage: content,
            isSender: false,
            isSeen: false,
            lastSent: dateTime,
            email: name,
          };
          setUsers((prev) => {
            const filteredPrev = prev.filter(
              (user) => user.email !== newUser.email
            );
  
            const updatedPrev = filteredPrev.map((user) => ({
              ...user,
              id: user.id + 1,
            }));
  
            return [newUser, ...updatedPrev];
          });
          listId.push(id);
        } else {
          const newUser: User = {
            id: 1,
            name: email,
            image: image,
            lastMessage: content,
            isSender: false,
            isSeen: false,
            lastSent: dateTime,
            email: name,
          };
          setUsers((prev) => {
            const filteredPrev = prev.filter(
              (user) => user.email !== newUser.email
            );
  
            const updatedPrev = filteredPrev.map((user) => ({
              ...user,
              id: user.id + 1,
            }));
  
            return [newUser, ...updatedPrev];
          });
          listId.push(id);
        }
      } 
    }
  );

  if (onConnectionCreated) {
    onConnectionCreated(connection);
  }

  return () => {
    connection.off(connectionName);
    connection.stop();
  };
}

export function initSignalRNumberNotReadConnection({
  userInfo,
  setUnreadCount,
  onConnectionCreated,
}: InitSignalRNumberNotReadOptions): () => void {
  const connection = new HubConnectionBuilder()
    .withUrl(`${process.env.NEXT_PUBLIC_API_SERVER}/hub`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  const connectionName = (userInfo?.email ?? "");

  connection
    .start()
    .then(() => {
      connection.invoke("RetrieveMessageHistory");
    })
    .catch((err) => {
      console.error("Error while connecting to SignalR Hub:", err);
    });

  connection.on(connectionName, (number) => {
    if (setUnreadCount) {
      setUnreadCount(number);
    }
  });

  if (onConnectionCreated) {
    onConnectionCreated(connection);
  }

  return () => {
    connection.off(connectionName);
    connection.stop();
  };
}