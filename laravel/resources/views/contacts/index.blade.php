@extends('layouts.app')

@section('content')
<div class="container">
  <div class="row">
    <div class="col-sm-12">
      <div class="row">
        <div class="col-sm">
          <h1>Contacts</h1>
        </div>
        <div class="col-sm">
          <a href="{{ route('contacts.create')}}" class="btn btn-primary float-sm-right">New contact</a>
        </div>
      </div>
    </div>
    <div class="col-sm-12">
      <table class="table table-striped">
        <thead>
            <tr>
              <td>ID</td>
              <td>Name</td>
              <td>Email</td>
              <td>Job Title</td>
              <td>City</td>
              <td>Country</td>
              <td colspan = 2>Actions</td>
            </tr>
        </thead>
        <tbody>
            @foreach($contacts as $contact)
            <tr>
                <td>{{$contact->id}}</td>
                <td>{{$contact->first_name}} {{$contact->last_name}}</td>
                <td>{{$contact->email}}</td>
                <td>{{$contact->job_title}}</td>
                <td>{{$contact->city}}</td>
                <td>{{$contact->country}}</td>
                <td>
                    <a href="{{ route('contacts.edit',$contact->id)}}" class="btn btn-primary">Edit</a>
                </td>
                <td>
                    <form action="{{ route('contacts.destroy', $contact->id)}}" method="post">
                      @csrf
                      @method('DELETE')
                      <button class="btn btn-danger" type="submit">Delete</button>
                    </form>
                </td>
            </tr>
            @endforeach
        </tbody>
      </table>
    </div>
  </div>
</div>
@endsection