import { Kafka } from "kafkajs";

// Node18+ has global fetch; if older Node, uncomment below
// import fetch from 'node-fetch';

const kafka = new Kafka({
  clientId: "notification-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "notification-group" });

async function runConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "enrolled-events", fromBeginning: true });

  console.log("Consumer listening for enrolled-events...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      console.log("📩 Event received:", event);

      // Send as POST with JSON body; service will normalize and surface message
      try {
        const response = await fetch(
          `http://localhost:4000/notify/${encodeURIComponent(event.userId)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event }),
          }
        );
        if (!response.ok) {
          console.error("❌ Failed to deliver notification", response.status);
        } else {
          const resJson = await response.json().catch(() => ({}));
          console.log("📨 Notification POST result:", resJson);
        }
      } catch (err) {
        console.error("❌ Error calling notification service:", err.message);
      }
      // Yahan se WebSocket ya push notification trigger kar sakte ho
      // Example: io.to(socketId).emit("notification", event)
    },
  });
}

runConsumer().catch(console.error);
