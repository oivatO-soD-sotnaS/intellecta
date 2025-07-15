<?php

use App\Queue\RedisEmailQueue;
use App\Services\EmailService;

require __DIR__ . '/../vendor/autoload.php';


$queue = new RedisEmailQueue();
$mailer = new EmailService();

echo "[*] Email Worker started...\n";

while (true) {
    $job = $queue->pop();

    if ($job === null) {
        usleep(200000); // 200ms delay
        continue;
    }
    try {
        $mailer->sendMail(
            $job['to'],
            $job['toName'],
            $job['subject'],
            $job['body'],
            $job['altBody'] ?? ''
        );

        echo "[✔] Sent: {$job['to']}\n";
    } catch (Throwable $e) {
        echo "[✘] Failed to send: {$e->getMessage()}\n";
        // Optionally requeue or log
    }
}
