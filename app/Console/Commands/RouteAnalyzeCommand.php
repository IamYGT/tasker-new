<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Collection;

class RouteAnalyzeCommand extends Command
{
    protected $signature = 'route:analyze';
    protected $description = 'Analyze routes for potential issues';

    public function handle()
    {
        $routes = collect(Route::getRoutes());

        // Duplicate route names check
        $this->checkDuplicateNames($routes);

        // Duplicate paths check
        $this->checkDuplicatePaths($routes);

        // Missing names check
        $this->checkMissingNames($routes);

        // Middleware consistency check
        $this->checkMiddlewareConsistency($routes);

        return Command::SUCCESS;
    }

    private function checkDuplicateNames(Collection $routes)
    {
        $this->info('Checking for duplicate route names...');

        $duplicates = $routes->groupBy(function ($route) {
            return $route->getName();
        })->filter(function ($group) {
            return $group->count() > 1 && !empty($group->first()->getName());
        });

        if ($duplicates->isNotEmpty()) {
            $this->error('Found duplicate route names:');
            foreach ($duplicates as $name => $routes) {
                $this->warn("Name '$name' is used " . $routes->count() . " times:");
                $routes->each(function ($route) {
                    $this->line(" - " . $route->uri());
                });
            }
        } else {
            $this->info('No duplicate route names found.');
        }
    }

    private function checkDuplicatePaths(Collection $routes)
    {
        $this->info('Checking for duplicate paths...');

        $duplicates = $routes->groupBy(function ($route) {
            return $route->uri() . '|' . $route->methods()[0];
        })->filter(function ($group) {
            return $group->count() > 1;
        });

        if ($duplicates->isNotEmpty()) {
            $this->error('Found duplicate paths:');
            foreach ($duplicates as $path => $routes) {
                $this->warn("Path '$path' is defined " . $routes->count() . " times");
            }
        } else {
            $this->info('No duplicate paths found.');
        }
    }

    private function checkMissingNames(Collection $routes)
    {
        $this->info('Checking for routes without names...');

        $unnamed = $routes->filter(function ($route) {
            return empty($route->getName()) && !in_array($route->uri(), ['_ignition/health-check', '_ignition/execute-solution', '_ignition/update-config']);
        });

        if ($unnamed->isNotEmpty()) {
            $this->warn('Found routes without names:');
            $unnamed->each(function ($route) {
                $this->line(" - " . $route->uri());
            });
        } else {
            $this->info('All routes are named properly.');
        }
    }

    private function checkMiddlewareConsistency(Collection $routes)
    {
        $this->info('Checking middleware consistency...');

        $routes->groupBy(function ($route) {
            return $route->getPrefix();
        })->each(function ($group, $prefix) {
            if ($prefix) {
                $middlewares = $group->pluck('middleware')->flatten()->unique();
                if ($middlewares->count() > 1) {
                    $this->warn("Routes under prefix '$prefix' have inconsistent middleware:");
                    $this->line("Middlewares found: " . $middlewares->implode(', '));
                }
            }
        });
    }
}
