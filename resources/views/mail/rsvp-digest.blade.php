<x-mail::message>
# {{ __('Hello :name!', ['name' => $name]) }}

{{ trans_choice('{1} On :date, :count person answered your invitation :title.|[2,*] On :date, :count people answered your invitation :title.', $answerCount, ['date' => $date, 'title' => $title]) }}

<x-mail::table>
| {{ __('Name') }} | {{ __('Answer') }} |
| :--- | :--- |
@foreach ($answers as $answer)
| {{ str_replace('|', '/', $answer->name) }} | {{ $answer->attending ? trans_choice('{1} Will attend (:count person)|[2,*] Will attend (:count people)', $answer->seats_confirmed) : __('Will not attend') }} |
@endforeach
</x-mail::table>

@if ($unlisted > 0)
{{ trans_choice('{1} And :count more answer, which you can see in the panel.|[2,*] And :count more answers, which you can see in the panel.', $unlisted) }}
@endif

**{{ __('So far') }}:** {{ __(':attending will attend (:people people), :declined will not attend and :pending are pending.', $summary) }}

<x-mail::button :url="$url">
{{ __('See the RSVPs') }}
</x-mail::button>

<x-mail::subcopy>
{{ __('You get this summary on each day after someone answers. You can turn it off in your profile:') }} [{{ $settingsUrl }}]({{ $settingsUrl }})
</x-mail::subcopy>
</x-mail::message>
