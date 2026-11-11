<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Quoted = 'quoted';
    case Active = 'active';
    case Delivered = 'delivered';
    case Archived = 'archived';
}
