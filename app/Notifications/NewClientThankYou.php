<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\HtmlString;

class NewClientThankYou extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */

    public function __construct()
    {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {

        return (new MailMessage())
            ->greeting('Thank You')
            ->subject(Lang::get('New Client Request'))
            ->line(Lang::get('Thank you for your submission.'))
            ->line(Lang::get('We will review the information and documents provided and get back to you shortly.  We aim to answer all new client requests within one business day.'))
            ->line(new HtmlString('If you wish to add to or follow up your submission, please contact us by email 
            at <a href="mailto:mail@evolutionlawyers.nz">mail@evolutionlawyers.nz</a> or call us on <a href="tel:0800352993">0800 352 993.</a>'))
           ;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
