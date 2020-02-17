<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class CollectionProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        Collection::macro('loadMorph', function ($relation, $relations) {
            $this->pluck($relation)
                ->filter()
                ->groupBy(function ($model) {
                    return get_class($model);
                })
                ->filter(function ($models, $className) use ($relations) {
                    return array_has($relations, $className);
                })
                ->each(function ($models, $className) use ($relations) {
                    $className::with($relations[$className])
                        ->eagerLoadRelations($models->all());
                });

                return $this;
        });

    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
