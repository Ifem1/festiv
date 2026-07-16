import pytest


@pytest.mark.integration
def test_studionet_contract_lifecycle():
    """Run with `gltest tests/integration -v --network studionet`.

    The live transaction evidence for this contract is recorded in
    MORE_INFORMATION.md; this test is intentionally opt-in because it spends
    network resources and requires a configured Studio/StudioNet account.
    """
    pytest.skip("Opt-in StudioNet integration; run with gltest --network studionet")
