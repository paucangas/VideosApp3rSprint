@extends('layouts.videos-app')

@section('content')
    <h1>Videos</h1>
    <ul>
        @foreach ($videos as $video)
            <li>
                <a href="{{ url('/videos', $video->id) }}">
                    {{ $video->title }}
                </a>
            </li>
        @endforeach
    </ul>
@endsection
