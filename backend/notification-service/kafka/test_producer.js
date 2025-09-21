import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: ["localhost:9092"], // Kafka broker address
});

const producer = kafka.producer();

async function runProducer() {
  await producer.connect();
  console.log("Producer connected to Kafka");

  const event = {
    event: "student_enrolled",
    userId: 101,
    courseId: "web-dev-101",
  };

  await producer.send({
    topic: "enrolled-events", // topic name
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log("✅ Event sent:", event);

  await producer.disconnect();
}

runProducer().catch(console.error);
