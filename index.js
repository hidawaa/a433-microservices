// Load konfigurasi dari .env
require("dotenv").config();

// Import Express.js
const express = require("express");

// Instance Express
const app = express();

// Import body-parser
const bp = require("body-parser");

// Handling JSON
app.use(bp.json());

// Impor amqplib
const amqp = require("amqplib");

// Mengambil AMQP_URL dari environment variable
const amqpServer = process.env.AMQP_URL;

// Delkarasi variabel
var channel, connection;

// Memanggil fungsi koneksi ke RabbitMQ
connectToQueue();

// Fungsi koneksi ke RabbitMQ
async function connectToQueue() {
  // Membuat koneksi ke RabbitMQ
  connection = await amqp.connect(amqpServer);

  // Membuat channel komunikasi
  channel = await connection.createChannel();

  // Blok Try Catch
  try {
    // Mendefinisikan nama antrian
    const queue = "order";

    // Membuat antrian jika belum ada
    await channel.assertQueue(queue);

    // Menampilkan pesan ketika koneksi berhasil
    console.log("Connected to the queue!");

    // Catch
  } catch (ex) {
    // Menampilkan error ketika koneksi gagal
    console.error(ex);
  }
}

// Endpoint HTTP POST untuk membuat order baru
app.post("/order", (req, res) => {
  // Mengambil data order dari body request
  const { order } = req.body;

  // Memanggil fungsi pengiriman data order ke antrian
  createOrder(order);

  // Mengirim respon ke client
  res.send(order);
});

// Fungsi untuk mengirim data order ke antrian RabbitMQ
const createOrder = async (order) => {
  // Nama antrian yang akan digunakan
  const queue = "order";

  // Mengirim data order ke antrian dalam format JSON
  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));

  // Menampilkan pesan order berhasil dibuat
  console.log("Order succesfully created!");

  // Handle sinyal SIGINT (Ctrl + C) untuk menutup koneksi RabbitMQ
  process.once("SIGINT", async () => {
    // Menampilkan pesan penutupan koneksi
    console.log("got sigint, closing connection");

    // Close channel
    await channel.close();

    // Close koneksi
    await connection.close();

    // Keluar
    process.exit(0);
  });
};

// Menjalankan server Express pada port sesuai environment variable
app.listen(process.env.PORT, () => {
  // Menampilkan pesan server telah berjalan pada port sesuai environment variable
  console.log(`Server running at ${process.env.PORT}`);
});
