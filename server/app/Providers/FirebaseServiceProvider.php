<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;

class FirebaseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton('firebase', function ($app) {
            return (new Factory)
                ->withServiceAccount(config('firebase.credentials.path'));
        });

        $this->app->singleton('firebase.storage', function ($app) {
            $firebase = $app->make('firebase');
            return $firebase->createStorage();
        });

        $this->app->singleton('firebase.upload', function ($app) {
            return new class {
                public function upload($file)
                {
                    try {
                        $storage = app('firebase.storage');
                        $bucket = $storage->getBucket();

                        $imageData = file_get_contents($file);

                        $originalFilename = $file->getClientOriginalName();
                        $uniqueFilename = uniqid() . '_' . now()->format('Y-m-d_H-i-s') . '_' . $originalFilename;

                        $object = $bucket->upload($imageData, [
                            'name' => $uniqueFilename,
                        ]);

                        return 'https://firebasestorage.googleapis.com/v0/b/' . $bucket->name() . '/o/' . urlencode($object->name()) . '?alt=media';
                    } catch (\Exception $e) {
                        throw new \Exception('Failed to upload file to Firebase: ' . $e->getMessage());
                    }
                }
            };
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
