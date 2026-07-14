import importlib.util
import json
import pathlib
import sys
import types
import unittest


class UserError(Exception):
    pass


class TreeMap(dict):
    pass


class Decorator:
    def __getattr__(self, _name):
        return lambda fn: fn


class Address:
    def __init__(self, value):
        self.value = value

    @property
    def as_hex(self):
        return self.value


genlayer = types.ModuleType("genlayer")
genlayer.gl = types.SimpleNamespace(
    Contract=object,
    public=Decorator(),
    message=types.SimpleNamespace(sender_address=Address("0xcreator")),
    vm=types.SimpleNamespace(UserError=UserError),
    eq_principle=types.SimpleNamespace(),
)
genlayer.TreeMap = TreeMap
genlayer.u256 = int
genlayer.json = json
genlayer.typing = __import__("typing")
genlayer.__all__ = ["gl", "TreeMap", "u256", "json", "typing"]
sys.modules["genlayer"] = genlayer

spec = importlib.util.spec_from_file_location("festiv", pathlib.Path(__file__).with_name("festiv.py"))
festiv = importlib.util.module_from_spec(spec)
spec.loader.exec_module(festiv)


CREATE_ARGS = (
    "A careful launch", "launch", "Example DAO", "Welcome the new project",
    "Remote contributors", "10-25", "online", "30 minutes", "warm",
    "candles", "flags", "mixed", "captions", "opt-in only",
)


class FestivLifecycleTests(unittest.TestCase):
    def setUp(self):
        genlayer.gl.message.sender_address = Address("0xcreator")
        self.contract = festiv.FestivContract()

    def create(self, public=False):
        return self.contract.create_ritual(*CREATE_ARGS, public)

    def test_private_reads_are_creator_only_for_brief_and_plan(self):
        ritual_id = self.create(False)
        self.contract.ritual_plans[ritual_id] = json.dumps({"ritual_id": ritual_id})
        self.assertEqual(json.loads(self.contract.get_ritual(ritual_id))["creator"], "0xcreator")
        self.assertEqual(json.loads(self.contract.get_ritual_plan(ritual_id))["ritual_id"], ritual_id)

        genlayer.gl.message.sender_address = Address("0xstranger")
        with self.assertRaisesRegex(UserError, "only creator"):
            self.contract.get_ritual(ritual_id)
        with self.assertRaisesRegex(UserError, "only creator"):
            self.contract.get_ritual_plan(ritual_id)

    def test_public_reads_remain_available(self):
        ritual_id = self.create(True)
        self.contract.ritual_plans[ritual_id] = json.dumps({"ritual_id": ritual_id})
        genlayer.gl.message.sender_address = Address("0xstranger")
        self.assertEqual(json.loads(self.contract.get_ritual(ritual_id))["ritual_id"], ritual_id)
        self.assertEqual(json.loads(self.contract.get_ritual_plan(ritual_id))["ritual_id"], ritual_id)

    def test_revision_generation_completion_and_archive_lifecycle(self):
        ritual_id = self.create(False)
        self.contract.update_ritual_brief(
            ritual_id, "Revised purpose", "Revised context", "calm", "bell", "fire",
            "intercultural", "screen reader", "explicit consent",
        )
        self.assertEqual(json.loads(self.contract.get_ritual(ritual_id))["purpose"], "Revised purpose")

        approved = {
            "status": "approved", "ritual_title": "Launch", "ritual_type": "launch",
            "recommended_duration_minutes": 25,
            "consensus_envelope": {"confidence_band": "high"},
        }
        genlayer.gl.eq_principle.prompt_non_comparative = lambda *_args, **_kwargs: json.dumps(approved)
        self.assertEqual(self.contract.request_ritual_plan(ritual_id), "approved")
        self.contract.mark_completed(ritual_id)
        self.assertEqual(json.loads(self.contract.get_ritual(ritual_id))["status"], "completed")

        second_id = self.create(True)
        self.contract.archive_ritual(second_id)
        self.assertEqual(json.loads(self.contract.get_ritual(second_id))["status"], "archived")


if __name__ == "__main__":
    unittest.main()
