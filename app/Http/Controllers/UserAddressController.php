<?php

namespace App\Http\Controllers;

use App\Address;
use App\User;
use Illuminate\Http\Request;

class UserAddressController extends Controller
{
    /**
     * Return all addresses for a user.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function all(User $user)
    {
        return $user->addresses()->get();
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
     * Create a address for a user.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\User                $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, User $user)
    {
        $this->validate($request, [
            'address_one' => 'required',
            'address_type' => 'required',
            'post_code' => 'required',
            'country_code' => 'required',
        ]);

        $user->addresses()->create($request->all());

        return response()->json(['message' => 'Address created.'], 201);
    }

    /**
     * Update an address.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Address             $address
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Address $address)
    {
        $this->validate($request, [
            'address_one' => 'required',
            'address_type' => 'required',
            'post_code' => 'required',
            'country_code' => 'required',
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
    public function delete(Address $address)
    {
        $address->delete();
        return response()->json(['message' => 'Address deleted.'], 200);
    }
}
