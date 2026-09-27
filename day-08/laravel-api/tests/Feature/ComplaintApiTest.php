<?php

namespace Tests\Feature;

use App\Models\Complaint;
use App\Models\Department;
use App\Models\Facility;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComplaintApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_complaints_support_crud_and_include_facility_and_submitter(): void
    {
        [$facility, $reporter] = $this->createComplaintReferences();
        $complaint = Complaint::create([
            'facility_id' => $facility->id,
            'submitted_by' => $reporter->id,
            'subject' => 'Flickering hallway light',
            'description' => 'The light flickers throughout the day.',
            'priority' => 'low',
            'status' => 'open',
            'reported_at' => '2026-09-01 10:00:00',
        ]);

        $this->getJson('/api/complaints')
            ->assertOk()
            ->assertJsonPath('data.0.facility.name', 'East Community Center')
            ->assertJsonPath('data.0.submitter.name', 'Sam Rivera');
        $this->getJson("/api/complaints/{$complaint->id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'open');

        $payload = [
            'facility_id' => $facility->id,
            'submitted_by' => $reporter->id,
            'subject' => 'Broken side entrance',
            'description' => 'The side entrance door does not close.',
            'priority' => 'high',
            'status' => 'open',
            'reported_at' => '2026-09-12 09:30:00',
        ];
        $created = $this->postJson('/api/complaints', $payload)
            ->assertCreated()
            ->assertJsonPath('data.submitter.name', 'Sam Rivera');
        $complaintId = $created->json('data.id');

        $payload['status'] = 'in_progress';
        $this->putJson("/api/complaints/{$complaintId}", $payload)
            ->assertOk()
            ->assertJsonPath('data.status', 'in_progress');
        $this->patchJson("/api/complaints/{$complaintId}", ['status' => 'resolved'])
            ->assertOk()
            ->assertJsonPath('data.status', 'resolved');

        $this->deleteJson("/api/complaints/{$complaintId}")
            ->assertOk()
            ->assertJsonPath('message', 'Complaint deleted successfully.');
        $this->assertDatabaseMissing('complaints', ['id' => $complaintId]);
    }

    public function test_complaint_creation_rejects_unknown_status_and_priority_values(): void
    {
        [$facility] = $this->createComplaintReferences();

        $this->postJson('/api/complaints', [
            'facility_id' => $facility->id,
            'subject' => 'Broken entrance',
            'description' => 'The door does not close.',
            'priority' => 'immediate',
            'status' => 'waiting',
            'reported_at' => '2026-09-12 09:30:00',
        ])->assertUnprocessable()->assertJsonValidationErrors(['priority', 'status']);
    }

    private function createComplaintReferences(): array
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
        $reporter = User::create([
            'name' => 'Sam Rivera',
            'email' => 'sam.rivera@example.com',
            'password' => 'test-password',
            'role' => 'staff',
        ]);

        return [$facility, $reporter];
    }
}
