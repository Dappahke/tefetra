<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AddOnController;
use App\Http\Controllers\Api\AdminClientProjectController;
use App\Http\Controllers\Api\AdminConsultationRequestController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AdminOrderController;
use App\Http\Controllers\Api\AdminProjectUpdateController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\ClientPortalController;
use App\Http\Controllers\Api\ConsultationRequestController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\StripeWebhookController;

Route::apiResource('addons', AddOnController::class)->only(['index', 'show']);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::post('/consultations', [ConsultationRequestController::class, 'store']);
Route::post('/checkouts/stripe', [CheckoutController::class, 'stripe']);
Route::get('/payments/stripe/session-status', [CheckoutController::class, 'stripeSessionStatus']);
Route::post('/payments/stripe/webhook', StripeWebhookController::class);
Route::post('/checkouts/mpesa', [CheckoutController::class, 'mpesa']);
Route::post('/payments/mpesa/callback', [CheckoutController::class, 'mpesaCallback']);
Route::get('/orders/{token}/status', [OrderController::class, 'status'])->whereUuid('token');
Route::get('/download/{token}', [OrderController::class, 'download'])->whereUuid('token');
Route::get('/client-portal/{token}', [ClientPortalController::class, 'show'])->whereUuid('token');

Route::prefix('admin')
    ->middleware('admin.api')
    ->group(function (): void {
        Route::get('/dashboard', AdminDashboardController::class);
        Route::apiResource('products', ProductController::class);
        Route::apiResource('addons', AddOnController::class);
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{order}', [AdminOrderController::class, 'update']);
        Route::get('/consultations', [AdminConsultationRequestController::class, 'index']);
        Route::get('/consultations/{consultation}', [AdminConsultationRequestController::class, 'show']);
        Route::patch('/consultations/{consultation}', [AdminConsultationRequestController::class, 'update']);
        Route::apiResource('client-projects', AdminClientProjectController::class);
        Route::post('/client-projects/{clientProject}/updates', [AdminProjectUpdateController::class, 'store']);
        Route::patch('/project-updates/{projectUpdate}', [AdminProjectUpdateController::class, 'update']);
        Route::delete('/project-updates/{projectUpdate}', [AdminProjectUpdateController::class, 'destroy']);
    });
