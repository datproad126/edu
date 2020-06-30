@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Dashboard</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    You are logged in!
                </div>
                <h1>{{ $session ?? ''}}</h1>
                <div class="container">
                    <a href="{{ route('contacts.index')}}" class="btn btn-primary">go to contact</a>
                    <input id="session" type="hidden" value="{{ Auth::user()->id }}">
                    <button id="get_session" type="button" class="btn btn-primary">get session</button>
                    
                    {{-- download pdf --}}
                    <a id="get_pdf" type="button" class="btn btn-danger" href="{{ url('/home/pdf/{id}/yoursession.pdf', ) }}">download pdf</a>
                    <a type="button" class="btn btn-danger" href="{{ url('/home/handling-pdf') }}">override pdf</a>
                    <a type="button" class="btn btn-primary" href="{{ url('/home/view-pdf') }}">view pdf</a>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection