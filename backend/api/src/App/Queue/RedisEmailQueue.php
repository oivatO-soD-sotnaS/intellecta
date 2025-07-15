<?php

namespace App\Queue;

use Predis\Client;

class RedisEmailQueue
{
    private Client $redis;
    private string $queue = 'email_queue';

    public function __construct()
    {
        $this->redis = new Client([
            'host' => 'redis_container',
            'port' => 6379,
        ]);
    }

    public function push(array $emailData): void
    {
        $this->redis->lpush($this->queue, [json_encode($emailData)]);
    }

    public function pop(): ?array
    {
        $data = $this->redis->rpop($this->queue);
        return $data ? json_decode($data, true) : null;
    }
}
