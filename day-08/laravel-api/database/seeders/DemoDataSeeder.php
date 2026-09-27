<?php

namespace Database\Seeders;

use App\Models\Complaint;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Facility;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $operations = Department::firstOrCreate(
                ['name' => 'Operations'],
                ['description' => 'Coordinates public services and facility operations.'],
            );
            $maintenance = Department::firstOrCreate(
                ['name' => 'Maintenance'],
                ['description' => 'Maintains buildings, equipment, and grounds.'],
            );
            $sanitation = Department::firstOrCreate(
                ['name' => 'Sanitation'],
                ['description' => 'Oversees cleaning and waste management.'],
            );

            foreach ([
                [$operations, 'Asha Patel', 'asha.patel@example.com', 'Operations Manager', 72000, '2021-04-12'],
                [$operations, 'Daniel Kim', 'daniel.kim@example.com', 'Facilities Coordinator', 54000, '2022-02-07'],
                [$maintenance, 'Mina Chen', 'mina.chen@example.com', 'Maintenance Engineer', 68000, '2020-09-21'],
                [$maintenance, 'Luis Garcia', 'luis.garcia@example.com', 'Building Technician', 49000, '2023-06-19'],
                [$sanitation, 'Priya Shah', 'priya.shah@example.com', 'Sanitation Lead', 58000, '2021-11-03'],
                [$sanitation, 'Noah Wilson', 'noah.wilson@example.com', 'Grounds Technician', 46000, '2024-01-15'],
            ] as [$department, $name, $email, $position, $salary, $hiredOn]) {
                Employee::updateOrCreate(
                    ['email' => $email],
                    [
                        'department_id' => $department->id,
                        'name' => $name,
                        'position' => $position,
                        'salary' => $salary,
                        'hired_on' => $hiredOn,
                    ],
                );
            }

            $inspector = User::updateOrCreate(
                ['email' => 'inspector@example.com'],
                [
                    'name' => 'Jordan Lee',
                    'password' => Hash::make('password'),
                    'role' => 'inspector',
                ],
            );
            $reporter = User::updateOrCreate(
                ['email' => 'reporter@example.com'],
                [
                    'name' => 'Sam Rivera',
                    'password' => Hash::make('password'),
                    'role' => 'staff',
                ],
            );

            $facilities = [];
            foreach ([
                [$operations, 'Central Library', 'Library', '100 Main Street', 4, true],
                [$operations, 'Civic Hall', 'Government', '25 Civic Plaza', 2, true],
                [$maintenance, 'East Community Center', 'Community', '80 East Avenue', 3, true],
                [$maintenance, 'Riverside Pool', 'Recreation', '12 River Road', 1, false],
                [$sanitation, 'North Service Yard', 'Operations', '7 North Industrial Way', 5, true],
            ] as [$department, $name, $category, $location, $score, $operational]) {
                $facilities[$name] = $department->facilities()->firstOrCreate(
                    ['name' => $name],
                    [
                        'category' => $category,
                        'location' => $location,
                        'condition_score' => $score,
                        'is_operational' => $operational,
                    ],
                );
            }

            foreach ([
                ['Central Library', '2026-02-03 09:00:00', 4, 'Fire exits clear; one hallway light needs replacement.'],
                ['Central Library', '2026-06-12 10:30:00', 5, 'Lighting repaired; all inspected areas are in good condition.'],
                ['Civic Hall', '2026-03-18 08:45:00', 2, 'Water damage found near the east stairwell.'],
                ['East Community Center', '2026-04-22 13:15:00', 3, 'Routine inspection; replace two worn door closers.'],
                ['East Community Center', '2026-07-08 11:00:00', 4, 'Door closers replaced; no new safety concerns.'],
                ['Riverside Pool', '2026-05-06 07:30:00', 1, 'Pool filtration system is offline; restrict access pending repair.'],
                ['North Service Yard', '2026-06-25 14:00:00', 5, 'Perimeter and equipment storage areas are in good condition.'],
            ] as [$facilityName, $inspectedAt, $rating, $findings]) {
                Inspection::updateOrCreate(
                    [
                        'facility_id' => $facilities[$facilityName]->id,
                        'inspected_at' => $inspectedAt,
                    ],
                    [
                        'inspector_id' => $inspector->id,
                        'rating' => $rating,
                        'findings' => $findings,
                    ],
                );
            }

            foreach ([
                ['Civic Hall', 'Repair east stairwell water damage', 'Water is entering the east stairwell after heavy rain.', 'high', 'open', '2026-03-19 09:10:00'],
                ['Civic Hall', 'Inspect ceiling above meeting room', 'A ceiling tile is stained and should be checked for leaks.', 'medium', 'in_progress', '2026-03-22 15:45:00'],
                ['East Community Center', 'Replace worn door closer', 'The side entrance does not close reliably.', 'low', 'resolved', '2026-04-20 10:00:00'],
                ['Riverside Pool', 'Restore pool filtration system', 'The filtration system is offline and the pool should remain closed.', 'urgent', 'open', '2026-05-06 08:00:00'],
                ['Central Library', 'Add a reading-room light', 'One reading-room fixture is flickering.', 'low', 'closed', '2026-06-14 12:30:00'],
            ] as [$facilityName, $subject, $description, $priority, $status, $reportedAt]) {
                Complaint::updateOrCreate(
                    ['subject' => $subject],
                    [
                        'facility_id' => $facilities[$facilityName]->id,
                        'submitted_by' => $reporter->id,
                        'description' => $description,
                        'priority' => $priority,
                        'status' => $status,
                        'reported_at' => $reportedAt,
                    ],
                );
            }
        });
    }
}
