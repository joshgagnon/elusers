<?php

namespace App\Http\Controllers;


use Dcblogdev\MsGraph\Facades\MsGraph;
use Illuminate\Http\Request;
use App\ClientRequest;
use App\Organisation;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;
use Google2FA as G2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $loadData = [];
        $loadData['user'] = $request->user()->toArray();
        $loadData['user']['roles'] = $request->user()->roles->pluck('name');
        $loadData['user']['permissions'] = $request->user()->getAllPermissions();
        $loadData['user']['requires2FA'] = $request->user()->organisation->require_2fa && !$request->user()->google2fa_secret && env('OTP_ENABLED', true);
        $loadData['user']['integrations']['msgraph'] =  MsGraph::isConnected();
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }

    public function amlcft(Request $request)
    {
        $loadData = [];
        $loadData['user'] = false;
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }


    public function startContact(Request $request)
    {
       // grab id for evolution lawyers
        $orgId = Organisation::where('legal_name', 'like', 'Evolution Lawyers%')->first()->id;
       $token = Str::random(40);
       ClientRequest::create(['token' => $token, 'organisation_id' => $orgId]);
       return redirect('contact-us/'.$token);
    }

    public function contact(Request $request)
    {
        $loadData = [];
        $loadData['user'] = false;
        return view('index')->with([
            'loadData' => json_encode($loadData)
        ]);
    }

    public function setup2FA(Request $request)
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();
        $qrCodeUrl = $google2fa->getQRCodeUrl(
            "ELF",
            $request->user()->email,
            $secret
        );
        $writer = new Writer(
            new ImageRenderer(
                new RendererStyle(400),
                new ImagickImageBackEnd()
            )
        );
        $qrcode_image = base64_encode($writer->writeString($qrCodeUrl));
        return view('auth.setup2FA')->with([
            'secret' => $secret,
            'qrcode_image' => $qrcode_image,
            'name' => $request->user()->organisation->name
        ]);
    }

    public function save2FA(Request $request)
    {
        $user = $request->user();
        $secret = $request->input('secret');
        $window = 8; // 8 keys (respectively 4 minutes) past and future
        $key = $request->input('totp');
        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($secret, $key, $window);
        if(!$valid) {
            $qrCodeUrl = $google2fa->getQRCodeUrl(
                "ELF",
                $user->email,
                $secret
            );
            $writer = new Writer(
                new ImageRenderer(
                    new RendererStyle(400),
                    new ImagickImageBackEnd()
                )
            );
            $qrcode_image = base64_encode($writer->writeString($qrCodeUrl));
            return view('auth.setup2FA')->with([
                'secret' => $secret,
                'qrcode_image' => $qrcode_image
            ])->withErrors(["totp"=>"Code didn't match, please try again"]);
        }
        else{
            $user->google2fa_secret = $secret;
            $user->save();
            G2FA::login();
            return redirect('/');
        }
    }

    public function otp(Request $request)
    {
        return redirect('/');
    }


}