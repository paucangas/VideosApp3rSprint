@extends('layouts.videos-app')

@section('content')
    <h1>Videos</h1>
    <p>Benvingut als videos de Pau</p>
    <nav>
        <ul>
            <li><a href="{{ url('/', 1) }}">Video 1</a></li>
            <li><a href="{{ route('videos.index', 2) }}">Video 2</a></li>
            <li><a href="{{ url('about', 3) }}">Video 3</a></li>
        </ul>
    </nav>
