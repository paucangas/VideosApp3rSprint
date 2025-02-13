@extends('layouts.videos-app')

@section('content')
    <h1>{{ $video->title }}</h1>
    <p>{{ $video->description }}</p>
    <video src="{{ $video->url }}" controls></video>
@endsection
