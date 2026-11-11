<x-mail::message>
# {{ __('Hello :name!', ['name' => $name]) }}

{{ __('We are happy to share your invitation to :title.', ['title' => $title]) }}

{{ $description }}

<x-mail::button :url="$url">
{{ __('Open my invitation') }}
</x-mail::button>

@if ($rsvpDeadline)
{{ __('Please confirm your attendance on the invitation before :date.', ['date' => $rsvpDeadline]) }}
@endif

{{ __('This link is personal: it was made for you.') }}
</x-mail::message>
