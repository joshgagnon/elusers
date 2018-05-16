<?php

namespace App\Http\Controllers;

use App\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Get all contacts.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function all(Request $request)
    {
        $orgId = $request->user()->organisation_id;

        $contacts = Contact::where('organisation_id', $orgId)->with('addresses')->get();

        return $contacts;
    }

    /**
     * Get a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed
     */
    public function get(Request $request, $contactId)
    {
        $orgId = $request->user()->organisation_id;

        $contact = Contact::where('organisation_id', $orgId)->where('id', $contactId)->first();

        if (!$contact) {
            abort(404);
        }

        return $contact;
    }

    /**
     * Create a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->validate($request, Contact::$validationRules);

        $user = $request->user();
        $data = $request->all();

        $contact = Contact::create([
            'organisation_id' => $user->organisation_id,
            'name'            => $data['name'],
            'first_name'      => $data['first_name'],
            'middle_name'     => $data['middle_name'],
            'surname'         => $data['surname'],
            'type'            => $data['type'],
            'name'            => $data['name'],
            'email'           => $data['email'],
            'phone'           => $data['phone']
        ]);

        return response()->json(['message' => 'Contact created.', 'contact_id' => $contact->id], 201);
    }

    /**
     * Update a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Contact             $contact
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Contact $contact)
    {
        $this->validate($request, Contact::$validationRules);

        $data = $request->all();

        $contact->update([
            'name'            => $data['name'],
            'first_name'      => $data['first_name'],
            'middle_name'     => $data['middle_name'],
            'surname'         => $data['surname'],
            'type'            => $data['type'],
            'name'            => $data['name'],
            'email'           => $data['email'],
            'phone'           => $data['phone']
        ]);

        return response()->json(['message' => 'Contact updated.', 'contact_id' => $contact->id]);
    }

    public function delete(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contact deleted.']);
    }
}
