<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Facility;
use App\Models\Inspection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FacilityApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_facilities_support_crud_and_include_their_department(): void
    {
        $department = Department::create(['name' => 'Operations']);
        $facility = Facility::create([
            'department_id' => $department->id,
            'name' => 'Central Library',
            'category' => 'Library',
            'location' => '100 Main Street',
            'condition_score' => 4,
            'is_operational' => true,
        ]);

        $this->getJson('/api/facilities')
            ->assertOk()
            ->assertJsonPath('data.0.id', $facility->id)
            ->assertJsonPath('data.0.department.name', 'Operations');
        $this->getJson("/api/facilities/{$facility->id}")
            ->assertOk()
            ->assertJsonPath('data.name', 'Central Library');

        $payload = [
            'department_id' => $department->id,
            'name' => 'North Library',
            'category' => 'Library',
            'location' => '8 North Road',
            'condition_score' => 3,
            'is_operational' => true,
        ];
        $created = $this->postJson('/api/facilities', $payload)
            ->assertCreated()
            ->assertJsonPath('data.department.id', $department->id);
        $facilityId = $created->json('data.id');

        $payload['name'] = 'North Library Annex';
        $this->putJson("/api/facilities/{$facilityId}", $payload)
            ->assertOk()
            ->assertJsonPath('data.name', 'North Library Annex');
        $this->patchJson("/api/facilities/{$facilityId}", ['condition_score' => 2])
            ->assertOk()
            ->assertJsonPath('data.condition_score', 2);

        $this->deleteJson("/api/facilities/{$facilityId}")
            ->assertOk()
            ->assertJsonPath('message', 'Facility deleted successfully.');
        $this->assertDatabaseMissing('facilities', ['id' => $facilityId]);
    }

    public function test_facility_with_inspection_history_cannot_be_deleted(): void
    {
        $facility = $this->createFacility();
        Inspection::create([
            'facility_id' => $facility->id,
            'rating' => 4,
            'inspected_at' => '2026-09-01 10:00:00',
            'findings' => 'Routine inspection.',
        ]);

        $this->deleteJson("/api/facilities/{$facility->id}")
            ->assertStatus(409)
            ->assertJsonPath('message', 'A facility with inspection or complaint history cannot be deleted.');
        $this->assertDatabaseHas('facilities', ['id' => $facility->id]);
    }

    public function test_facility_creation_validates_required_fields_and_relationships(): void
    {
        $this->postJson('/api/facilities', ['department_id' => 999999])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['department_id', 'name', 'category', 'location']);
    }

    public function test_missing_facility_is_returned_as_a_json_not_found_response(): void
    {
        $this->getJson('/api/facilities/999999')
            ->assertNotFound()
            ->assertJsonStructure(['message']);
    }

    private function createFacility(): Facility
    {
        $department = Department::create(['name' => 'Maintenance']);

        return Facility::create([
            'department_id' => $department->id,
            'name' => 'East Community Center',
            'category' => 'Community',
            'location' => '80 East Avenue',
            'condition_score' => 3,
            'is_operational' => true,
        ]);
    }
}
