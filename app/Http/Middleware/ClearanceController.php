<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class ClearanceMiddleware {
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {

        if (Auth::user()->hasPermissionTo('administer')) //If user has this //permission
        {
            return $next($request);
        }



        if($requests->is('api/*'))
        {
            if ($request->is('api/xxxx'))//If user is creating a post
             {
                if (!Auth::user()->hasPermissionTo('Create Post'))
             {
                    abort('401');
                }
             else {
                    return $next($request);
                }
            }


        }



        return $next($request);
    }
}