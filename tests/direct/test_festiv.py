import json


CONTRACT = "contract/festiv.py"


def create_args(public=False):
    return [
        "A careful launch", "launch", "Example DAO", "Welcome the new project",
        "Remote contributors", "10-25", "online", "30 minutes", "warm",
        "candles", "flags", "mixed", "captions", "opt-in only", public,
    ]


def test_private_reads_and_revision(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT)
    direct_vm.sender = direct_alice
    ritual_id = contract.create_ritual(*create_args(False))
    assert json.loads(contract.get_ritual(ritual_id))["creator"] == direct_alice.as_hex.lower()

    with direct_vm.prank(direct_bob):
        with direct_vm.expect_revert("private ritual"):
            contract.get_ritual(ritual_id)

    contract.update_ritual_brief(
        ritual_id, "Revised purpose", "Revised context", "calm", "bell", "fire",
        "intercultural", "screen reader", "explicit consent",
    )
    assert json.loads(contract.get_ritual(ritual_id))["purpose"] == "Revised purpose"


def test_public_read(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT)
    direct_vm.sender = direct_alice
    ritual_id = contract.create_ritual(*create_args(True))
    with direct_vm.prank(direct_bob):
        assert json.loads(contract.get_ritual(ritual_id))["ritual_id"] == ritual_id


def test_generation_and_completion_with_mocked_llm(direct_vm, direct_deploy, direct_alice):
    direct_vm.mock_llm(
        r"Design a community ritual.*",
        json.dumps({
            "status": "approved", "ritual_title": "Launch", "ritual_type": "launch",
            "emotional_intent": "welcome", "recommended_duration_minutes": 25,
            "tone_summary": "warm", "cultural_sensitivity_level": "normal",
            "facilitator_style": "steady", "opening_moment": "welcome", "sequence": [],
            "symbols": [], "adaptation_notes": [], "safety_notes": [],
            "accessibility_notes": [], "closing_moment": "close", "short_version": "short",
            "reasoning_summary": "safe", "confidence": 0.9,
            "consensus_envelope": {"status": "approved", "ritual_type": "launch",
                "dominant_tone": "warm", "sensitivity_level": "normal", "duration_band": "short",
                "facilitation_complexity": "simple", "requires_human_review": False,
                "confidence_band": "high"},
        }),
    )
    contract = direct_deploy(CONTRACT)
    direct_vm.sender = direct_alice
    ritual_id = contract.create_ritual(*create_args(False))
    assert contract.request_ritual_plan(ritual_id) == "approved"
    contract.mark_completed(ritual_id)
    assert json.loads(contract.get_ritual(ritual_id))["status"] == "completed"
