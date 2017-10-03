<?php

namespace App\Http\Controllers;

use App\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $contacts = Contact::where('organisation_id', $orgId)->get();

        return $contacts;
    }
}
