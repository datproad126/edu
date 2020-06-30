<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $fillable = [
        'user_id',
        'user_agent'
        // 'ip_address',
        // 'payload',
        // 'last_activity'
    ];
    protected $table = 'sessions';
}
