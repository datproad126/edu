<?php

namespace App\Http\Controllers;

use App\Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use GuzzleHttp\Client;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user_id = (Auth::check() ? Auth::user()->id : null);
        $data = Auth::user();
        Session::create([
            'user_id' => $user_id,
            'pay_load' => $data,
            'last_activity' => time()
        ]);
        return view('home');
    }

    public function getSession(Request $request)
    {
        $id = $request->get('id');
        if (Auth::user()->id != $id) {
            return 0;
        }
        $session_table = Session::find($id);
        $session = $session_table ? $request->session()->getId() : null;
        $session_table->payload = $session . $session_table->last_activity . $session_table->user_id;
        $session_table->save();
        $data = [
            'message' => 'success',
            'session' => $session_table->payload
        ];
        return json_encode($data);
    }
    public function getPdf()
    {
        $session_table = Session::find(Auth::user()->id);

        $pdf = App::make('dompdf.wrapper');
        $pdf->loadHTML("<h1>Your session</h1>" . "<h2>" . $session_table->payload . "</h2>");
        $content = $pdf->download()->getOriginalContent();
        Storage::put('public/csv/yoursession.pdf', $content);
        $file_path = storage_path() . '/app/public/csv/yoursession.pdf';
        // dd($file_path);
        if (file_exists($file_path)) {
            $headers = array(
                'Content-Type: application/pdf',
            );
            // Send Download
            return response()->download($file_path, "yoursession.pdf", $headers)->deleteFileAfterSend(true);
        } else {
            // Error
            exit('Requested file does not exist on our server!');
        }
    }
    public function overridePdf()
    {
        $session_id = Session::find(Auth::user()->id);
        $file_input = storage_path('app/public/csv/PhoenixProjectExcerpt.pdf');
        $client = new Client();
        // $headers = ['Content-Type' => 'application/json'];
        $response = $client->post('http://localhost:4002/api/v1/overridePDF',     array(
            'form_params' => array(
                'session' => $session_id,
                'link' => $file_input
            )
        ));
        dd($response);
    }

    public function viewPdf()
    {
        return view('pdf');
    }
}