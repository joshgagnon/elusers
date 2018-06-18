<?php

namespace App\Http\Controllers;

use App\Address;
use App\Contact;
use Illuminate\Http\Request;

class ContactAddressController extends Controller
{
    /**
     * Return all addresses for a contact.
     *
     * @param \App\Contact $contact
     * @return mixed
     */
    public function all(Contact $contact)
    {
        return $contact->addresses()->get();
    }

    /**
     * Get an address
     *
     * @param \App\Address $address
     * @return \App\Address
     */
    public function get(Address $address)
    {
        return $address;
    }

    /**
     * Create a address for a contact.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Contact                $contact
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, Contact $contact)
    {
        $this->validate($request, [
            'address_one' => 'required',
            'address_type' => 'required',
            'post_code' => 'required',
            'country' => 'required',
        ]);

        $contact->addresses()->create($request->all());

        return response()->json(['message' => 'Address created.'], 201);
    }

    /**
     * Update an address.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Address             $address
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Contact $contact, Address $address)
    {
        // address must be owned by contact
        $this->validate($request, [
            'address_one' => 'required',
            'address_type' => 'required',
            'post_code' => 'required',
            'country' => 'required',
        ]);

        $address->update($request->all());
        return response()->json(['message' => 'Address updated.'], 200);
    }

    /**
     * Delete an address.
     *
     * @param \App\Address $address
     * @return \Illuminate\Http\JsonResponse
     */
    public function delete(Contact $contact, Address $address)
    {
        // address must be owned by contact // is this done?
        $address->delete();
        return response()->json(['message' => 'Address deleted.'], 200);
    }
}