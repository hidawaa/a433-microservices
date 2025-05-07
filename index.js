// Load konfigurasi dari .env
require("dotenv").config();

// Import Express.js
const express = require("express");

// Instance Express
const app = express();

// Import body-parser
const bp = require("body-parser");

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
  // Blok Try Catch
  try {
    // Membuat koneksi ke RabbitMQ
    connection = await amqp.connect(amqpServer);

    // Membuat channel komunikasi
    channel = await connection.createChannel();

    // Membuat antrian jika belum ada
    await channel.assertQueue("order");

    // Handle pesan dari antrein "order"
    channel.consume("order", (data) => {
      // Menampilkan data order yang diterima
      console.log(`Order received: ${Buffer.from(data.content)}`);

      // Menampilkan pesan order akan segera dikirim
      console.log("** Will be shipped soon! **\n");

      //Memberi tanda pesan telah diproses
      channel.ack(data);
    });

    // Catch
  } catch (ex) {
    // Menampilkan error ketika gagal
    console.error(ex);
  }
}

// Menjalankan server Express pada port sesuai environment variable
app.listen(process.env.PORT, () => {
  // Menampilkan pesan server telah berjalan pada port sesuai environment variable
  console.log(`Server running at ${process.env.PORT}`);
});
