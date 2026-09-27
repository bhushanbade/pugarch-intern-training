<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Facility;
use App\Models\Inspection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InspectionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_inspections_support_crud_and_include_facility_and_inspector(): void
    {
        [$facility, $inspector] = $this->createInspectionReferences();
        $inspection = Inspection::create([
            'facility_id' => $facility->id,
            'inspector_id' => $inspector->id,
            'rating' => 4,
            'inspected_at' => '2026-09-01 10:00:00',
            'findings' => 'One light needs replacement.',
        ]);

        $this->getJson('/api/inspections')
            ->assertOk()
            ->assertJsonPath('data.0.facility.name', 'East Community Center')
            ->assertJsonPath('data.0.inspector.name', 'Jordan Lee');
        $this->getJson("/api/inspections/{$inspection->id}")
            ->assertOk()
            ->assertJsonPath('data.rating', 4);

        $payload = [
            'facility_id' => $facility->id,
            'inspector_id' => $inspector->id,
            'rating' => 3,
            'inspected_at' => '2026-09-12 09:30:00',
            'findings' => 'Replace a worn door closer.',
        ];
        $created = $this->postJson('/api/inspections', $payload)
            ->assertCreated()
            ->assertJsonPath('data.facility.id', $facility->id);
        $inspectionId = $created->json('data.id');

        $payload['rating'] = 5;
        $this->putJson("/api/inspections/{$inspectionId}", $payload)
            ->assertOk()
            ->assertJsonPath('data.rating', 5);
        $this->patchJson("/api/inspections/{$inspectionId}", ['findings' => 'Repairs completed.'])
            ->assertOk()
            ->assertJsonPath('data.findings', 'Repairs completed.');

        $this->deleteJson("/api/inspections/{$inspectionId}")
            ->assertOk()
            ->assertJsonPath('message', 'Inspection deleted successfully.');
        $this->assertDatabaseMissing('inspections', ['id' => $inspectionId]);
    }

    public function test_inspection_creation_rejects_ratings_outside_the_one_to_five_scale(): void
    {
        [$facility] = $this->createInspectionReferences();

        $this->postJson('/api/inspections', [
            'facility_id' => $facility->id,
            'rating' => 8,
            'inspected_at' => '2026-09-12 09:30:00',
            'findings' => 'Invalid rating.',
        ])->assertUnprocessable()->assertJsonValidationErrors(['rating']);
    }

    private function createInspectionReferences(): array
    {
        $department = Department::create(['name' => 'Maintenance']);
        $facility = Facility::create([
            'department_id' => $department->id,
            'name' => 'East Community Center',
            'category' => 'Community',
            'location' => '80 East Avenue',
            'condition_score' => 3,
            'is_operational' => true,
        ]);
        $inspector = User::create([
            'name' => 'Jordan Lee',
            'email' => 'jordan.lee@example.com',
            'password' => 'test-password',
            'role' => 'inspector',
        ]);

        return [$facility, $inspector];
    }
}
